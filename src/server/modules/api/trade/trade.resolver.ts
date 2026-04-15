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

const HEX_PUBKEY_RE = /^[0-9a-f]{66}$/;
const HEX_ASSET_ID_RE = /^[0-9a-f]{64}$/;

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
    this.validateIdentifiers(input);

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
    this.validateIdentifiers(input);

    if (input.expiryEpoch) {
      const expirySec = Number(input.expiryEpoch);
      if (expirySec > 0 && Date.now() / 1000 > expirySec) {
        throw new GraphQLError('Quote has expired — request a new quote');
      }
    }

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

    const quoteSats = this.deriveSatsFromRate(
      input.assetAmount,
      rate,
      quote.minTransportableMsat
    );
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
    const { paymentRequest } = input;

    if (!paymentRequest) {
      throw new GraphQLError(
        'paymentRequest is required - please generate an asset invoice first'
      );
    }

    // Decode the invoice so we know the exact sats leg before paying it,
    // then verify we actually have enough local BTC liquidity with the peer.
    // Fails fast with a friendly error instead of letting the payment stall.
    const [decoded, decodeError] = await toWithError(
      this.nodeService.decodePaymentRequest(id, paymentRequest)
    );

    if (decodeError || decoded?.tokens == null) {
      this.logger.error('Failed to decode asset invoice before buy', {
        error: decodeError,
      });
      throw new GraphQLError('Failed to decode asset invoice');
    }

    await this.assertBtcLiquidity(
      id,
      input.peerPubkey,
      decoded.tokens,
      'local'
    );

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
    const { rfqId } = input;

    if (!rfqId) {
      throw new GraphQLError(
        'rfqId is required for sells — call getTradeQuote first'
      );
    }

    // Re-derive satsAmount server-side from the accepted quote instead of
    // trusting the client-provided value.
    const [quote, quoteError] = await toWithError(
      this.tapdNodeService.queryAcceptedSellQuote({ id, rfqId })
    );

    if (quoteError || !quote) {
      this.logger.error('Failed to look up accepted sell quote', {
        error: quoteError,
        rfqId,
      });
      throw new GraphQLError(
        'Failed to look up accepted sell quote — it may have expired'
      );
    }

    const rate = quote.bidAssetRate;
    if (!rate || !rate.coefficient || rate.coefficient === '0') {
      throw new GraphQLError('Accepted quote has invalid rate');
    }

    const invoiceSats = this.deriveSatsFromRate(
      input.assetAmount,
      rate,
      quote.minTransportableMsat
    );

    if (invoiceSats <= 0) {
      throw new GraphQLError('Derived sats amount is zero or negative');
    }

    // For sells, the sats return leg comes from the peer's local balance (our
    // remote). Check that up front so we fail with a clear message instead of
    // triggering a routing failure partway through.
    await this.assertBtcLiquidity(id, input.peerPubkey, invoiceSats, 'remote');

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
      quote,
    });

    const [payResult, payError] = await toWithError(
      this.tapdNodeService.sendAssetPayment({
        id,
        assetId: input.tapdAssetId || undefined,
        groupKey: input.tapdGroupKey || undefined,
        assetAmount: input.assetAmount,
        paymentRequest: invoice.request,
        peerPubkey: input.peerPubkey,
        rfqId,
      })
    );

    if (payError || !payResult) {
      this.logger.error('Failed to execute sell trade', { error: payError });
      throw new GraphQLError('Failed to execute sell trade');
    }

    return {
      success: true,
      paymentPreimage: payResult.paymentPreimage || undefined,
      satsAmount: String(invoiceSats),
      feeSats: payResult.feeSat ? String(payResult.feeSat) : undefined,
    };
  }

  /**
   * Finds all active BTC channels with the given peer. Taproot Asset channels
   * use SIMPLE_TAPROOT_OVERLAY, which the `lightning` package does not map —
   * it leaves `type` undefined. BTC channels map to "anchor",
   * "simplified_taproot", etc. Filtering by a truthy `type` isolates BTC.
   */
  private async getBtcChannelsWithPeer(
    id: string,
    peerPubkey: string
  ): Promise<Array<{ local_balance: number; remote_balance: number }>> {
    const [channelsResult, channelsError] = await toWithError(
      this.nodeService.getChannels(id, {
        partner_public_key: peerPubkey,
        is_active: true,
      })
    );

    if (channelsError || !channelsResult?.channels?.length) {
      return [];
    }

    return channelsResult.channels.filter(
      (ch: { type?: string }) => !!ch.type
    ) as Array<{ local_balance: number; remote_balance: number }>;
  }

  /**
   * Pre-flight BTC liquidity check for the self-payment trade loop. A single
   * Lightning payment has to flow through one channel, so we compare against
   * the biggest balance across BTC channels with the peer (not the sum).
   * - 'local': the trader needs enough outbound (their balance) to pay sats
   *   out — used for buys.
   * - 'remote': the trader needs enough inbound (peer's balance) to receive
   *   the sats leg back — used for sells.
   */
  private async assertBtcLiquidity(
    id: string,
    peerPubkey: string,
    requiredSats: number,
    direction: 'local' | 'remote'
  ): Promise<void> {
    const channels = await this.getBtcChannelsWithPeer(id, peerPubkey);

    if (channels.length === 0) {
      throw new GraphQLError(
        'No active BTC channel with trade partner — cannot execute trade'
      );
    }

    const available = channels.reduce((max, ch) => {
      const balance =
        direction === 'local' ? ch.local_balance : ch.remote_balance;
      return balance > max ? balance : max;
    }, 0);

    if (available < requiredSats) {
      const label = direction === 'local' ? 'outbound' : 'inbound';
      throw new GraphQLError(
        `Insufficient ${label} BTC liquidity with trade partner: need ${requiredSats} sats, have ${available} sats`
      );
    }
  }

  /**
   * Derives the sats amount from an RFQ rate and asset amount.
   * The rate is a fixed-point number: coefficient × 10^(-scale) gives the
   * number of asset units per BTC. We convert to msat, then ceil to sats.
   */
  private deriveSatsFromRate(
    assetAmount: string,
    rate: { coefficient: string; scale: number },
    minTransportableMsat: string
  ): number {
    const assetAmt = BigInt(assetAmount);
    const coeff = BigInt(rate.coefficient);
    const scaleMult = BigInt(10) ** BigInt(rate.scale);
    const msatAmount = (assetAmt * BigInt(100_000_000_000) * scaleMult) / coeff;
    const sats = Number((msatAmount + BigInt(999)) / BigInt(1000));

    const minMsat = BigInt(minTransportableMsat || '0');
    const minSats =
      minMsat > BigInt(0) ? Number((minMsat + BigInt(999)) / BigInt(1000)) : 0;

    return Math.max(sats, minSats);
  }

  /**
   * Validates hex-encoded identifiers at the resolver entry points.
   * Rejects malformed pubkeys / asset IDs before they reach tapd.
   */
  private validateIdentifiers(
    input: Pick<TradeQuoteInput, 'peerPubkey' | 'tapdAssetId' | 'tapdGroupKey'>
  ): void {
    if (!HEX_PUBKEY_RE.test(input.peerPubkey)) {
      throw new GraphQLError('Invalid peerPubkey: expected 66-char hex');
    }
    if (input.tapdAssetId && !HEX_ASSET_ID_RE.test(input.tapdAssetId)) {
      throw new GraphQLError('Invalid tapdAssetId: expected 64-char hex');
    }
    if (input.tapdGroupKey && !HEX_PUBKEY_RE.test(input.tapdGroupKey)) {
      throw new GraphQLError('Invalid tapdGroupKey: expected 66-char hex');
    }
  }
}
