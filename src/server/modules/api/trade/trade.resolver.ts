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
        expiry: 30,
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

    // Decode the invoice to extract the payment hash, amount, cltv_delta,
    // route hints (containing the virtual SCID), and payment address.
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

    // Extract the virtual SCID from the invoice's route hints. The RFQ buy
    // quote embeds a route hint with the peer's pubkey and the virtual SCID
    // that tapd's HTLC interceptor listens on.
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

    await this.assertBtcLiquidity(
      id,
      input.peerPubkey,
      decoded.tokens,
      'local'
    );

    // Gather the data needed to construct the explicit 2-hop route:
    // current block height, our identity pubkey, BTC channel with peer, and
    // the peer's fee policy on that channel.
    const [heightResult, heightError] = await toWithError(
      this.nodeService.getHeight(id)
    );

    if (heightError || !heightResult?.current_block_height) {
      throw new GraphQLError('Failed to get current block height');
    }

    const [identity, identityError] = await toWithError(
      this.nodeService.getIdentity(id)
    );

    if (identityError || !identity?.public_key) {
      throw new GraphQLError('Failed to get node identity');
    }

    const btcChannel = await this.findBtcChannelWithPeer(id, input.peerPubkey);

    const [channelInfo] = await toWithError(
      this.nodeService.getChannel(id, btcChannel.id)
    );
    const peerPolicy = channelInfo?.policies?.find(
      (p: { public_key: string }) => p.public_key === input.peerPubkey
    );

    // Build the explicit 2-hop route: sender → peer (BTC channel) → sender
    // (virtual SCID). This forces LND to route through the virtual edge that
    // tapd's HTLC interceptor listens on, instead of letting pathfinding
    // skip it due to fee heuristics.
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

    // Hop 1 fee: base_fee + (forward_amount * fee_rate / 1_000_000)
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

    // Self-payment loop: assets leave via the TA channel (forced first hop by
    // tapd/RFQ) and the sats return leg comes back via the BTC channel. If we
    // let LND auto-include private channel hints (is_including_private_channels),
    // the TA channel also gets advertised — htlcswitch then rejects the forward
    // with "same incoming and outgoing channel" because tapd already picked the
    // TA channel for the outgoing hop. Build an explicit BTC-only route hint
    // instead so pathfinding only sees the valid return path.
    const btcHopHint = await this.buildBtcReturnHint(id, input.peerPubkey);

    // For sells, the sats return leg comes from the peer's local balance (our
    // remote). Check that up front so we fail with a clear message instead of
    // triggering a routing failure partway through.
    await this.assertBtcLiquidity(id, input.peerPubkey, invoiceSats, 'remote');

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
    peerPubkey: string
  ): Promise<Route | undefined> {
    const [channelsResult, channelsError] = await toWithError(
      this.nodeService.getChannels(id, {
        partner_public_key: peerPubkey,
        is_active: true,
      })
    );

    if (channelsError || !channelsResult?.channels?.length) {
      this.logger.warn(
        'Could not fetch channels for BTC return hint; omitting hint',
        { error: channelsError, peerPubkey }
      );
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

    // Taproot Asset channels use LND's SIMPLE_TAPROOT_OVERLAY commitment type,
    // which the `lightning` package does not map — it leaves `type` undefined.
    // BTC channels map to "anchor", "simplified_taproot", etc. Filtering by a
    // truthy `type` isolates BTC channels. Sort by `remote_balance` descending
    // so the return leg uses the channel with the most peer-side capacity.
    const btcChannels = channelsResult.channels
      .filter(
        (ch: { type?: string; id: string; remote_balance: number }) => !!ch.type
      )
      .sort(
        (a: { remote_balance: number }, b: { remote_balance: number }) =>
          b.remote_balance - a.remote_balance
      );

    const btcChannel = btcChannels[0];

    if (!btcChannel) {
      this.logger.warn('No BTC channel with peer; omitting return hint', {
        peerPubkey,
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

  /*
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

      // Check the peer's own entry first
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
   * Finds the best BTC channel with the given peer (highest local balance),
   * including channel ID and capacity needed for route construction.
   */
  private async findBtcChannelWithPeer(
    id: string,
    peerPubkey: string
  ): Promise<{ id: string; capacity: number; local_balance: number }> {
    const [channelsResult, channelsError] = await toWithError(
      this.nodeService.getChannels(id, {
        partner_public_key: peerPubkey,
        is_active: true,
      })
    );

    if (channelsError || !channelsResult?.channels?.length) {
      throw new GraphQLError(
        'No active channels with trade partner — cannot execute trade'
      );
    }

    // Filter to BTC-only channels (TA channels have undefined `type`) and
    // pick the one with the most local balance for the outgoing BTC leg.
    const btcChannels = channelsResult.channels
      .filter((ch: { type?: string }) => !!ch.type)
      .sort(
        (a: { local_balance: number }, b: { local_balance: number }) =>
          b.local_balance - a.local_balance
      );

    const best = btcChannels[0] as
      | { id: string; capacity: number; local_balance: number }
      | undefined;

    if (!best) {
      throw new GraphQLError(
        'No active BTC channel with trade partner — cannot execute trade'
      );
    }

    return best;
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
