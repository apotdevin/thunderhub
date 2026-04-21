import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { GraphQLError } from 'graphql';
import type { Route } from 'lightning';
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
const DEFAULT_INVOICE_EXPIRY_SEC = 30;

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
        assetAmount: input.assetAmount,
        peerPubkey: input.peerPubkey,
        expiry: input.expiry ?? DEFAULT_INVOICE_EXPIRY_SEC,
      })
    );

    if (error || !invoice) {
      this.logger.error('Failed to get buy quote', { error });
      throw new GraphQLError('Failed to get buy quote from peer');
    }

    const quote = invoice.acceptedBuyQuote;
    const rate = quote?.askAssetRate;

    // The peer may accept fewer assets than requested. Verify and fail early
    // so the user doesn't unknowingly pay for fewer assets than intended.
    const acceptedAmount = quote?.assetMaxAmount;
    if (
      acceptedAmount &&
      String(acceptedAmount) !== String(input.assetAmount)
    ) {
      this.logger.warn('Peer accepted fewer assets than requested', {
        requested: input.assetAmount,
        accepted: acceptedAmount,
      });
      throw new GraphQLError(
        `Peer can only convert ${acceptedAmount} assets (requested ${input.assetAmount})`
      );
    }

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

    const [decoded, decodeError] = await toWithError(
      this.nodeService.decodePaymentRequest(id, paymentRequest)
    );

    if (decodeError || decoded?.tokens == null) {
      this.logger.error('Failed to decode asset invoice before buy', {
        error: decodeError,
      });
      throw new GraphQLError('Failed to decode asset invoice');
    }

    if (!decoded.payment) {
      throw new GraphQLError(
        'Invoice missing payment address — cannot construct route'
      );
    }

    this.logger.debug('Decoded invoice route hints', {
      routes: JSON.stringify(decoded.routes),
      peerPubkey: input.peerPubkey,
      cltvDelta: decoded.cltv_delta,
      paymentHash: decoded.id,
    });

    const routeHint = this.findVirtualScidHint(
      decoded.routes,
      input.peerPubkey
    );

    if (!routeHint) {
      this.logger.error('No virtual SCID route hint found in invoice', {
        routes: JSON.stringify(decoded.routes),
        peerPubkey: input.peerPubkey,
      });
      throw new GraphQLError(
        'Invoice has no route hint for the trade peer — was it created via addAssetInvoice?'
      );
    }

    this.logger.debug('Found virtual SCID route hint', {
      virtualScid: routeHint.channel,
      cltvDelta: routeHint.cltv_delta,
    });

    const btcChannels = await this.getBtcChannelsWithPeer(id, input.peerPubkey);

    if (btcChannels.length === 0) {
      throw new GraphQLError(
        'No active BTC channel with trade partner — cannot execute trade'
      );
    }

    const btcChannel = [...btcChannels].sort(
      (a, b) => b.local_balance - a.local_balance
    )[0];

    if (btcChannel.local_balance < decoded.tokens) {
      throw new GraphQLError(
        `Insufficient outbound BTC liquidity with trade partner: need ${decoded.tokens} sats, have ${btcChannel.local_balance} sats`
      );
    }

    const [
      [heightResult, heightError],
      [identity, identityError],
      [channelInfo, channelInfoError],
    ] = await Promise.all([
      toWithError(this.nodeService.getHeight(id)),
      toWithError(this.nodeService.getIdentity(id)),
      toWithError(this.nodeService.getChannel(id, btcChannel.id)),
    ]);

    if (channelInfoError) {
      this.logger.warn(
        'Could not fetch channel info for fee estimation; using defaults',
        { error: channelInfoError, channelId: btcChannel.id }
      );
    }

    if (heightError || !heightResult?.current_block_height) {
      throw new GraphQLError('Failed to get current block height');
    }

    if (identityError || !identity?.public_key) {
      throw new GraphQLError('Failed to get node identity');
    }

    const peerPolicy = channelInfo?.policies?.find(
      (p: { public_key: string }) => p.public_key === input.peerPubkey
    );

    const currentHeight: number = heightResult.current_block_height;
    const invoiceCltvDelta = decoded.cltv_delta ?? 40;
    const hintCltvDelta = routeHint.cltv_delta ?? 144;
    const btcChannelCltvDelta: number = peerPolicy?.cltv_delta ?? 40;

    // +3 block buffer on final CLTV to tolerate a block arriving between
    // getHeight and HTLC settlement. Use the larger of the virtual SCID's
    // cltv_delta and the BTC channel's cltv_delta for the hop delta — the
    // peer may enforce its BTC channel policy on forwards.
    const hop2Timeout = currentHeight + invoiceCltvDelta + 3;
    const hopCltvDelta = Math.max(hintCltvDelta, btcChannelCltvDelta);
    const hop1Timeout = hop2Timeout + hopCltvDelta;

    const forwardMtokens = BigInt(decoded.mtokens);
    const baseFee = BigInt(peerPolicy?.base_fee_mtokens ?? '1000');
    const feeRate = BigInt(peerPolicy?.fee_rate ?? 2500);
    const hop1FeeMtokens =
      baseFee + (forwardMtokens * feeRate) / BigInt(1_000_000);
    const hop1Fee = Number((hop1FeeMtokens + BigInt(999)) / BigInt(1000));

    const totalMtokens = forwardMtokens + hop1FeeMtokens;

    const route = {
      fee: hop1Fee,
      fee_mtokens: String(hop1FeeMtokens),
      hops: [
        {
          channel: btcChannel.id,
          channel_capacity: btcChannel.capacity,
          fee: hop1Fee,
          fee_mtokens: String(hop1FeeMtokens),
          forward: decoded.tokens,
          forward_mtokens: decoded.mtokens,
          public_key: input.peerPubkey,
          timeout: hop2Timeout,
        },
        {
          channel: routeHint.channel,
          channel_capacity: btcChannel.capacity,
          fee: 0,
          fee_mtokens: '0',
          forward: decoded.tokens,
          forward_mtokens: decoded.mtokens,
          public_key: identity.public_key,
          timeout: hop2Timeout,
        },
      ],
      mtokens: String(totalMtokens),
      payment: decoded.payment,
      timeout: hop1Timeout,
      tokens: Number((totalMtokens + BigInt(999)) / BigInt(1000)),
      total_mtokens: decoded.mtokens,
    };

    this.logger.info('Executing buy trade via explicit route', {
      assetAmount: input.assetAmount,
      invoicePrefix: paymentRequest.slice(0, 20),
      virtualScid: routeHint.channel,
      btcChannelId: btcChannel.id,
      currentHeight,
      hintCltvDelta,
      btcChannelCltvDelta,
      hopCltvDelta,
      route,
    });

    let payResult:
      | {
          is_confirmed: boolean;
          secret: string;
          safe_tokens?: number;
          fee?: number;
        }
      | undefined;

    try {
      payResult = await this.nodeService.payViaRoutes(id, {
        id: decoded.id,
        routes: [route],
      });
    } catch (err: unknown) {
      // payViaRoutes throws [code, message, {failures}] on failure.
      // Log the full failure chain for debugging CLTV/routing issues.
      const rawErr = err as unknown[];
      const failures = Array.isArray(rawErr) ? rawErr[2] : undefined;
      this.logger.error('Failed to pay asset invoice via route', {
        error: Array.isArray(rawErr) ? rawErr[1] : String(err),
        failures: JSON.stringify(failures),
        paymentRequest,
      });
      throw new GraphQLError('Failed to pay asset invoice with sats');
    }

    if (!payResult?.is_confirmed) {
      this.logger.error('Payment via route not confirmed', { payResult });
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

    // Fetch BTC channels once for both the return-hint and the liquidity check.
    const btcChannels = await this.getBtcChannelsWithPeer(id, input.peerPubkey);
    if (btcChannels.length === 0) {
      throw new GraphQLError(
        'No active BTC channel with trade partner — cannot execute trade'
      );
    }

    const maxRemote = btcChannels.reduce(
      (max, ch) => (ch.remote_balance > max ? ch.remote_balance : max),
      0
    );
    if (maxRemote < invoiceSats) {
      throw new GraphQLError(
        `Insufficient inbound BTC liquidity with trade partner: need ${invoiceSats} sats, have ${maxRemote} sats`
      );
    }

    // Self-payment loop: assets leave via the TA channel (forced first hop by
    // tapd/RFQ) and the sats return leg comes back via the BTC channel. Build
    // an explicit BTC-only route hint so pathfinding only sees the valid return
    // path — omitting TA channels prevents "same incoming and outgoing channel".
    const btcHopHint = await this.buildBtcReturnHint(
      id,
      input.peerPubkey,
      btcChannels
    );

    const [invoice, invoiceError] = await toWithError(
      this.nodeService.createInvoice(id, {
        tokens: invoiceSats,
        routes: btcHopHint ? [btcHopHint] : undefined,
      })
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
   * Builds a single-hop BOLT11 route hint covering the BTC return leg from
   * the edge peer back to the trader. Skips the Taproot Asset channel so the
   * self-payment loop does not try to return funds over the same channel that
   * carried the outgoing asset HTLC.
   *
   * Returns undefined when no suitable BTC channel is found; the caller omits
   * the hint entirely in that case.
   */
  private async buildBtcReturnHint(
    id: string,
    peerPubkey: string,
    btcChannels: Array<{
      id: string;
      capacity: number;
      local_balance: number;
      remote_balance: number;
    }>
  ): Promise<Route | undefined> {
    const sorted = [...btcChannels].sort(
      (a, b) => b.remote_balance - a.remote_balance
    );
    const btcChannel = sorted[0];

    if (!btcChannel) {
      this.logger.warn('No BTC channel with peer; omitting return hint', {
        peerPubkey,
      });
      return undefined;
    }

    const [identity, identityError] = await toWithError(
      this.nodeService.getIdentity(id)
    );

    if (identityError || !identity?.public_key) {
      this.logger.warn('Could not fetch identity for return hint; omitting', {
        error: identityError,
      });
      return undefined;
    }

    // Pull the peer's gossiped policy for this channel so the hint reflects the
    // fees they actually advertise. Falls back to a conservative upper bound
    // when gossip isn't available (e.g. private or freshly opened channel) —
    // LND only uses the hint to budget routes; the peer re-applies its real
    // policy at HTLC time.
    const [channelInfo] = await toWithError(
      this.nodeService.getChannel(id, btcChannel.id)
    );
    const peerPolicy = channelInfo?.policies?.find(
      (policy: { public_key: string }) => policy.public_key === peerPubkey
    );

    return [
      { public_key: peerPubkey },
      {
        public_key: identity.public_key,
        channel: btcChannel.id,
        base_fee_mtokens: peerPolicy?.base_fee_mtokens ?? '1000',
        fee_rate: peerPolicy?.fee_rate ?? 2500, // parts per million
        cltv_delta: peerPolicy?.cltv_delta ?? 40,
      },
    ];
  }

  // Filters by truthy `type` — SIMPLE_TAPROOT_OVERLAY stays undefined in the
  // `lightning` package, so TA channels are excluded while BTC channels pass.
  private async getBtcChannelsWithPeer(
    id: string,
    peerPubkey: string
  ): Promise<
    Array<{
      id: string;
      capacity: number;
      local_balance: number;
      remote_balance: number;
    }>
  > {
    const [channelsResult, channelsError] = await toWithError(
      this.nodeService.getChannels(id, {
        partner_public_key: peerPubkey,
        is_active: true,
      })
    );

    if (channelsError) {
      this.logger.warn('Failed to fetch channels with peer', {
        error: channelsError,
        peerPubkey,
      });
    }

    if (channelsError || !channelsResult?.channels?.length) {
      return [];
    }

    return channelsResult.channels.filter(
      (ch: { type?: string }) => !!ch.type
    ) as Array<{
      id: string;
      capacity: number;
      local_balance: number;
      remote_balance: number;
    }>;
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
   * Finds the virtual SCID route hint embedded by tapd's addAssetInvoice.
   * BOLT11 route hints use RouteNode[] where each entry has a public_key. The
   * channel/cltv_delta may live on the peer's own entry or on the next entry
   * (destination), depending on the encoding convention. We check both.
   */
  private findVirtualScidHint(
    routes: Array<
      Array<{ public_key: string; channel?: string; cltv_delta?: number }>
    >,
    peerPubkey: string
  ): { channel: string; cltv_delta?: number } | undefined {
    for (const route of routes) {
      const peerIdx = route.findIndex(hop => hop.public_key === peerPubkey);
      if (peerIdx === -1) continue;

      if (route[peerIdx].channel) {
        return {
          channel: route[peerIdx].channel as string,
          cltv_delta: route[peerIdx].cltv_delta,
        };
      }

      // lightning package convention: channel on the next entry (destination)
      const nextHop = route[peerIdx + 1];
      if (nextHop?.channel) {
        return { channel: nextHop.channel, cltv_delta: nextHop.cltv_delta };
      }
    }
    return undefined;
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
