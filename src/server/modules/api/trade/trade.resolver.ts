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
    return this.getSellQuote(id, input);
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

  // ── Buy (PURCHASE) ──
  // addAssetInvoice bundles RFQ negotiation + invoice creation atomically.
  // The returned invoice embeds the accepted buy quote, so reusing it at
  // execute time guarantees the same rate — no separate addAssetBuyOrder needed.

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

    this.logger.info('Buy quote received', {
      assetAmount: input.assetAmount,
      sats,
      rfqId: quote?.id ? Buffer.from(quote.id).toString('hex') : undefined,
      expiry: quote?.expiry,
      quote,
    });

    return {
      satsAmount: sats || '0',
      assetAmount: input.assetAmount,
      rateFixed: rate ? `${rate.coefficient}e-${rate.scale}` : undefined,
      paymentRequest,
      expiryEpoch: quote?.expiry,
    };
  }

  // ── Sell (SALE) ──
  // Uses addAssetSellOrder to get an explicit RFQ quote. The rfqId must be
  // passed back at execute time to bind sendAssetPayment to this rate.

  private async getSellQuote(
    id: string,
    input: TradeQuoteInput
  ): Promise<TradeQuoteResult> {
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
    const rfqIdHex = quote.rfqId.toString('hex');

    this.logger.info('Sell quote received', {
      assetAmount: input.assetAmount,
      sats: String(quoteSats),
      rfqId: rfqIdHex,
      expiry: quote.expiry,
    });

    return {
      satsAmount: String(quoteSats),
      assetAmount: input.assetAmount,
      rateFixed: `${rate.coefficient}e-${rate.scale}`,
      rfqId: rfqIdHex,
      expiryEpoch: quote.expiry,
    };
  }

  private async executePurchase(
    id: string,
    input: ExecuteTradeInput
  ): Promise<ExecuteTradeResult> {
    let paymentRequest = input.paymentRequest;

    if (!paymentRequest) {
      // Fallback: create a fresh invoice (loses rate binding)
      this.logger.warn(
        'executePurchase called without paymentRequest — creating new invoice'
      );
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

      paymentRequest = invoice.invoiceResult?.paymentRequest || '';
    }

    if (!paymentRequest) {
      throw new GraphQLError('Asset invoice returned no payment request');
    }

    this.logger.info('Executing buy trade', {
      assetAmount: input.assetAmount,
      invoicePrefix: paymentRequest.slice(0, 20),
    });

    const [payResult, payError] = await toWithError(
      this.nodeService.pay(id, {
        request: paymentRequest,
        is_allow_self_payment: true,
        max_fee: 1000,
      })
    );

    if (payError || !payResult?.is_confirmed) {
      this.logger.error('Failed to pay asset invoice', {
        error: payError,
        paymentRequest,
        payResult,
      });
      throw new GraphQLError('Failed to pay asset invoice with sats');
    }

    return {
      success: true,
      paymentPreimage: payResult.secret,
      satsAmount:
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

    const [invoice, invoiceError] = await toWithError(
      this.nodeService.createInvoice(id, { tokens: invoiceSats })
    );

    if (invoiceError || !invoice?.request) {
      this.logger.error('Failed to create sats invoice for trade', {
        error: invoiceError,
      });
      throw new GraphQLError('Failed to create sats invoice');
    }

    this.logger.info('Executing sell trade', {
      assetAmount: input.assetAmount,
      invoiceSats,
      rfqId: input.rfqId ? 'present' : 'missing',
    });

    const [payResult, payError] = await toWithError(
      this.tapdNodeService.sendAssetPayment({
        id,
        assetId: input.tapdAssetId || undefined,
        groupKey: input.tapdGroupKey || undefined,
        assetAmount: input.assetAmount,
        paymentRequest: invoice.request,
        peerPubkey: input.peerPubkey,
        rfqId: input.rfqId || undefined,
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
      satsAmount: String(invoiceSats),
      feeSats: payResult.feeSat ? String(payResult.feeSat) : undefined,
    };
  }
}
