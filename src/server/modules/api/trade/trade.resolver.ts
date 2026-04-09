import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { GraphQLError } from 'graphql';
import { TapdNodeService } from '../../node/tapd/tapd-node.service';
import { NodeService } from '../../node/node.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import { toWithError } from '../../../utils/async';
import { TapTransactionType } from '../magma/magma.types';
import {
  TradeQuoteInput,
  TradeQuoteResult,
  ExecuteTradeInput,
  ExecuteTradeResult,
} from './trade.types';

@Resolver()
export class TradeResolver {
  constructor(
    private tapdNodeService: TapdNodeService,
    private nodeService: NodeService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => TradeQuoteResult)
  async getTradeQuote(
    @CurrentUser() { id }: UserId,
    @Args('input') input: TradeQuoteInput
  ): Promise<TradeQuoteResult> {
    if (input.transactionType === TapTransactionType.PURCHASE) {
      return this.getBuyQuote(id, input);
    }
    return this.getSellQuoteResult(id, input);
  }

  @Mutation(() => ExecuteTradeResult)
  async executeTrade(
    @CurrentUser() { id }: UserId,
    @Args('input') input: ExecuteTradeInput
  ): Promise<ExecuteTradeResult> {
    if (input.transactionType === TapTransactionType.PURCHASE) {
      return this.executePurchase(id, input);
    }
    return this.executeSale(id, input);
  }

  private async getBuyQuote(
    id: string,
    input: TradeQuoteInput
  ): Promise<TradeQuoteResult> {
    const [invoice, error] = await toWithError(
      this.tapdNodeService.addAssetInvoice({
        id,
        assetId: input.tapdAssetId || undefined,
        groupKey: input.tapdGroupKey || undefined,
        assetAmount: Number(input.assetAmount),
        peerPubkey: input.peerPubkey,
      })
    );

    if (error || !invoice) {
      this.logger.error('Failed to get buy quote', { error });
      throw new GraphQLError('Failed to get buy quote from peer');
    }

    const quote = invoice.acceptedBuyQuote;
    const rate = quote?.askAssetRate;

    // Decode the invoice to get the sats amount
    const paymentRequest = invoice.invoiceResult?.paymentRequest || '';
    const [decoded, decodeError] = await toWithError(
      this.nodeService.decodePaymentRequest(id, paymentRequest)
    );

    if (decodeError || decoded == null) {
      this.logger.error('Failed to decode asset invoice payment request', {
        error: decodeError,
      });
      throw new GraphQLError('Failed to decode asset invoice');
    }

    const sats = decoded.tokens != null ? String(decoded.tokens) : undefined;

    return {
      amountSats: sats || '0',
      assetAmount: input.assetAmount,
      rateFixed: rate ? `${rate.coefficient}e-${rate.scale}` : undefined,
    };
  }

  private async getSellQuoteResult(
    id: string,
    input: TradeQuoteInput
  ): Promise<TradeQuoteResult> {
    // paymentMaxAmt is in msat — use a generous upper bound (1 BTC)
    // The actual amount will be determined by the quoted rate
    const paymentMaxAmtMsat = String(BigInt(100_000_000_000));

    const [quote, error] = await toWithError(
      this.tapdNodeService.getSellQuote({
        id,
        assetId: input.tapdAssetId || undefined,
        groupKey: input.tapdGroupKey || undefined,
        paymentMaxAmtMsat,
        peerPubkey: input.peerPubkey,
      })
    );

    if (error || !quote) {
      this.logger.error('Failed to get sell quote', { error });
      throw new GraphQLError('Failed to get sell quote from peer');
    }

    const rate = quote.bidAssetRate;
    if (!rate || !rate.coefficient || rate.coefficient === '0') {
      throw new GraphQLError('Peer returned invalid rate in sell quote');
    }

    const assetAmt = BigInt(input.assetAmount);
    const coeff = BigInt(rate.coefficient);
    const scaleMult = BigInt(10) ** BigInt(rate.scale);
    const msatAmount = (assetAmt * BigInt(100_000_000_000) * scaleMult) / coeff;
    const sats = ((msatAmount + BigInt(999)) / BigInt(1000)).toString();

    const minMsat = BigInt(quote.minTransportableMsat || '0');
    const minSats =
      minMsat > BigInt(0) ? Number((minMsat + BigInt(999)) / BigInt(1000)) : 0;
    const quoteSats = Math.max(Number(sats), minSats);

    return {
      amountSats: String(quoteSats),
      assetAmount: input.assetAmount,
      rateFixed: `${rate.coefficient}e-${rate.scale}`,
    };
  }

  private async executePurchase(
    id: string,
    input: ExecuteTradeInput
  ): Promise<ExecuteTradeResult> {
    // 1. Create asset invoice via tapd
    const [invoice, invoiceError] = await toWithError(
      this.tapdNodeService.addAssetInvoice({
        id,
        assetId: input.tapdAssetId || undefined,
        groupKey: input.tapdGroupKey || undefined,
        assetAmount: Number(input.assetAmount),
        peerPubkey: input.peerPubkey,
      })
    );

    if (invoiceError || !invoice) {
      this.logger.error('Failed to create asset invoice for trade', {
        error: invoiceError,
      });
      throw new GraphQLError('Failed to create asset invoice');
    }

    const paymentRequest = invoice.invoiceResult?.paymentRequest || '';

    if (!paymentRequest) {
      throw new GraphQLError('Asset invoice returned no payment request');
    }

    this.logger.info('Asset invoice created for trade', {
      assetAmount: input.assetAmount,
      invoicePrefix: paymentRequest.slice(0, 20),
    });

    // 2. Pay the asset invoice with sats via LND
    const [payResult, payError] = await toWithError(
      this.nodeService.pay(id, { request: paymentRequest })
    );

    if (payError || !payResult?.is_confirmed) {
      this.logger.error('Failed to pay asset invoice', {
        error: payError,
        invoicePrefix: paymentRequest.slice(0, 20),
        payResult,
      });
      throw new GraphQLError('Failed to pay asset invoice with sats');
    }

    return {
      success: true,
      paymentPreimage: payResult.secret,
      amountSats:
        payResult.safe_tokens != null
          ? String(payResult.safe_tokens)
          : undefined,
      feeSats: payResult.fee != null ? String(payResult.fee) : undefined,
    };
  }

  private async executeSale(
    id: string,
    input: ExecuteTradeInput
  ): Promise<ExecuteTradeResult> {
    const invoiceSats = Number(input.satsAmount);

    if (!invoiceSats || invoiceSats <= 0) {
      throw new GraphQLError('Invalid sats amount for sale');
    }

    // 1. Create sats invoice on our node — tapd will pay it via the peer
    const [invoice, invoiceError] = await toWithError(
      this.nodeService.createInvoice(id, { tokens: invoiceSats })
    );

    if (invoiceError || !invoice?.request) {
      this.logger.error('Failed to create sats invoice for trade', {
        error: invoiceError,
      });
      throw new GraphQLError('Failed to create sats invoice');
    }

    this.logger.info('Sell trade: invoice created', {
      assetAmount: input.assetAmount,
      invoiceSats,
    });

    // 2. Send assets via tapd — it handles RFQ negotiation with the peer,
    //    routes assets out and sats back to our invoice (circular self-payment)
    const [payResult, payError] = await toWithError(
      this.tapdNodeService.sendAssetPayment({
        id,
        assetId: input.tapdAssetId || undefined,
        groupKey: input.tapdGroupKey || undefined,
        assetAmount: input.assetAmount,
        paymentRequest: invoice.request,
        peerPubkey: input.peerPubkey,
      })
    );

    if (payError || !payResult) {
      const details =
        payError instanceof Error ? payError.message : String(payError);
      this.logger.error('Failed to execute sell trade', { error: payError });
      throw new GraphQLError(`Failed to execute sell trade: ${details}`);
    }

    return {
      success: true,
      paymentPreimage: payResult.paymentPreimage || undefined,
      amountSats: String(invoiceSats),
      feeSats: payResult.feeSat ? String(payResult.feeSat) : undefined,
    };
  }
}
