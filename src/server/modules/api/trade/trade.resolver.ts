import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { GraphQLError } from 'graphql';
import type { PayViaRoutesResult, Route } from 'lightning';
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
  BtcChannel,
  TaChannel,
  TaChannelPointAndId,
} from './trade.types';

const HEX_PUBKEY_RE = /^[0-9a-f]{66}$/;
const HEX_ASSET_ID_RE = /^[0-9a-f]{64}$/;
const DEFAULT_INVOICE_EXPIRY_SEC = 30;

// How much we overshoot the channel reserve requirement when rebalancing
const SATS_RESERVE_BUFFER_PCT = 50;

// Minimum local balance a TA channel needs to anchor an outgoing asset HTLC.
// LND requires the local side to cover the commitment reserve AND have enough
// to fund the anchor output for the HTLC. In practice this is ~1062 sats
// (3 × dust_limit of 354 sats). We use a round number slightly above that.
const DEFAULT_CHANNEL_CLTV_DELTA = 40; // LND default for channel forwarding policies
// Deliberately small: this is a self-payment, settled within seconds. Must be
// ≥ FinalCltvRejectDelta (19) so LND accepts the HTLC at the final hop. Must
// match the cltv_delta passed to createInvoice so the route satisfies the
// invoice's min_final_cltv_expiry.
const DEFAULT_INVOICE_CLTV_DELTA = 24;

// Extra blocks added to final CLTV to tolerate a block arriving between
// getHeight and HTLC settlement.
const CLTV_BLOCK_BUFFER = 3;

// The `lightning` package intentionally leaves SIMPLE_TAPROOT_OVERLAY unmapped,
// so TA channels have type === undefined while all BTC channel types are strings.
const isTaChannel = (ch: { type?: string }) => !ch.type;
const isBtcChannel = (ch: { type?: string }) => !!ch.type;

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

  /**
   * Uses addAssetSellOrder to get an explicit RFQ quote. The rfqId must be
   * passed back at execute time to bind sendAssetPayment to this rate.
   */
  private async getSellQuote(
    accountId: string,
    input: TradeQuoteInput
  ): Promise<TradeQuoteResult> {
    const paymentMaxAmtMsat = String(BigInt(100_000_000_000));

    const [quote, error] = await toWithError(
      this.tapdNodeService.getSellQuote({
        id: accountId,
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
        `Insufficient outbound BTC liquidity with trade partner: ` +
          `need ${decoded.tokens} sats, have ${btcChannel.local_balance} sats`
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
    const invoiceCltvDelta = decoded.cltv_delta ?? DEFAULT_INVOICE_CLTV_DELTA;
    const hintCltvDelta = routeHint.cltv_delta ?? 144;
    const btcChannelCltvDelta: number =
      peerPolicy?.cltv_delta ?? DEFAULT_CHANNEL_CLTV_DELTA;

    // Use the larger of the virtual SCID's cltv_delta and the BTC channel's
    // cltv_delta for the hop delta — the peer may enforce its BTC channel
    // policy on forwards.
    const hop2Timeout = currentHeight + invoiceCltvDelta + CLTV_BLOCK_BUFFER;
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

    await this.ensureTaChannelSatReserve(
      id,
      input.peerPubkey,
      input.tapdAssetId || undefined,
      input.tapdGroupKey || undefined,
      btcChannels,
      invoiceSats
    );

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
      tapdAssetId: input.tapdAssetId,
      tapdGroupKey: input.tapdGroupKey,
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
      const detail =
        (payError as any)?.details ||
        (payError instanceof Error ? payError.message : undefined);
      throw new GraphQLError(
        detail
          ? `Failed to execute sell trade: ${detail}`
          : 'Failed to execute sell trade'
      );
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
    btcChannels: Array<BtcChannel>
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
        cltv_delta: peerPolicy?.cltv_delta ?? DEFAULT_CHANNEL_CLTV_DELTA,
      },
    ];
  }

  /**
   * The TA channel must hold local_balance >= local_reserve in sats for LND to
   * anchor the asset HTLC. If it doesn't, we circular-rebalance sats from the
   * BTC channel into the TA channel before the sale.
   *
   * When there are multiple TA channels with the same peer and asset (e.g. two
   * channels opened with the same edge node), LND's router selects the outgoing
   * channel independently of our earlier pick. We therefore rebalance ALL
   * matching channels that are below reserve so whichever one LND picks is
   * already funded. Best-effort: a single failure is logged as a warning and
   * the sell proceeds regardless.
   */
  private async ensureTaChannelSatReserve(
    id: string,
    peerPubkey: string,
    assetId: string | undefined,
    groupKey: string | undefined,
    btcChannels: Array<BtcChannel>,
    invoiceSats: number
  ): Promise<void> {
    this.logger.info('ensureTaChannelSatReserve: called', {
      assetId,
      groupKey,
      peerPubkey,
      invoiceSats,
    });

    const taChannels = await this.findTaChannelsForAsset(
      id,
      peerPubkey,
      assetId,
      groupKey
    );

    for (const taChannel of taChannels) {
      // Need enough local sats above the commitment reserve to transport the
      // asset HTLC. SATS_RESERVE_BUFFER_PCT provides the headroom above this.
      const effectiveReserve = taChannel.localReserve + invoiceSats;

      this.logger.info('ensureTaChannelSatReserve: channel balance check', {
        taChannelScid: taChannel.scid,
        localBalance: taChannel.localBalance,
        localReserve: taChannel.localReserve,
        invoiceSats,
        effectiveReserve,
        needsRebalance: taChannel.localBalance < effectiveReserve,
      });

      if (taChannel.localBalance >= effectiveReserve) continue;

      const rebalanceSats =
        Math.ceil(effectiveReserve * (1 + SATS_RESERVE_BUFFER_PCT / 100)) -
        taChannel.localBalance;

      this.logger.info(
        'TA channel below reserve; initiating circular rebalance',
        {
          taChannelScid: taChannel.scid,
          localBalance: taChannel.localBalance,
          localReserve: taChannel.localReserve,
          effectiveReserve,
          rebalanceSats,
        }
      );

      try {
        await this.rebalanceTaChannel(
          id,
          peerPubkey,
          taChannel.scid,
          taChannel.peerAlias,
          taChannel.capacity,
          btcChannels,
          rebalanceSats
        );
      } catch (err: unknown) {
        this.logger.warn(
          'Circular rebalance failed; attempting sell trade anyway',
          {
            taChannelScid: taChannel.scid,
            error: err instanceof Error ? err.message : String(err),
          }
        );
      }
    }
  }

  /**
   * Finds ALL TA channels for the given asset and peer, joining LND's BTC-layer
   * channel data (SCID, local_reserve) with tapd's asset-layer data (assetId,
   * groupKey) via the channelPoint key (txid:vout).
   *
   * Returns all matching channels because when multiple TA channels exist with
   * the same peer, LND's router selects the outgoing channel independently —
   * we need all candidates so we can ensure each one meets its reserve.
   */
  private async findTaChannelsForAsset(
    accountId: string,
    peerPubkey: string,
    assetId: string | undefined,
    groupKey: string | undefined
  ): Promise<
    Array<{
      scid: string;
      peerAlias: string | undefined;
      capacity: number;
      localBalance: number;
      localReserve: number;
    }>
  > {
    if (!assetId && !groupKey) {
      this.logger.error(
        'findTaChannelsForAsset: neither assetId nor groupKey provided',
        { assetId, groupKey }
      );
      return [];
    }

    const [channelsResult, channelsError] = await toWithError(
      this.nodeService.getChannels(accountId, {
        partner_public_key: peerPubkey,
        is_active: true,
      })
    );

    if (channelsError) {
      this.logger.warn('Failed to fetch TA channel info with peer', {
        error: channelsError,
        peerPubkey,
      });
      return [];
    }

    if (!channelsResult?.channels?.length) return [];

    // Get satoshi-level channel data for TA channels
    const satLayerTaChannels = channelsResult.channels.filter(
      isTaChannel
    ) as Array<TaChannel>;

    if (satLayerTaChannels.length === 0) return [];

    // Get asset-level channel data for TA channels
    const [assetLayerTaChannels, assetError] = await toWithError(
      this.tapdNodeService.getAssetChannelBalances({
        id: accountId,
        peerPubkey,
      })
    );

    if (assetError || !assetLayerTaChannels) {
      this.logger.warn('Failed to fetch asset channel balances with peer', {
        error: assetError,
        peerPubkey,
      });
      return [];
    }

    const assetLayerByChannelPoint = new Map<string, TaChannelPointAndId>(
      assetLayerTaChannels.map((ac: TaChannelPointAndId) => [
        ac.channelPoint,
        ac,
      ])
    );

    const results: Array<{
      scid: string;
      peerAlias: string | undefined;
      capacity: number;
      localBalance: number;
      localReserve: number;
    }> = [];

    for (const ch of satLayerTaChannels) {
      const channelPoint = `${ch.transaction_id}:${ch.transaction_vout}`;
      const assetInfo = assetLayerByChannelPoint.get(channelPoint);

      if (!assetInfo) continue;

      const matches = groupKey
        ? assetInfo.groupKey === groupKey
        : assetInfo.assetId === assetId;

      if (matches) {
        results.push({
          scid: ch.id,
          // partner_scid_alias is the alias the peer assigned to their side
          // of this channel — the ID in their own forwarding table. Use it
          // for hop 2 of the circular rebalance (peer → us) so the peer can
          // look up the channel locally. The real SCID and our own aliases
          // (other_ids) are not in the peer's outgoing forwarding table for
          // private TA channels.
          peerAlias: ch.partner_scid_alias,
          capacity: ch.capacity,
          localBalance: ch.local_balance,
          localReserve: ch.local_reserve,
        });
      }
    }

    return results;
  }

  /**
   * Circular-rebalances the TA channel by sending a sats-only self-payment:
   * sats exit via the BTC channel and re-enter via the TA channel, topping up
   * the TA channel's sat balance above the reserve requirement.
   */
  private async rebalanceTaChannel(
    id: string,
    peerPubkey: string,
    taChannelScid: string,
    taChannelPeerAlias: string | undefined,
    taChannelCapacity: number,
    btcChannels: Array<BtcChannel>,
    rebalanceSats: number
  ): Promise<void> {
    if (btcChannels.length === 0) {
      throw new Error('No BTC channels available for circular rebalance');
    }

    const btcChannel = [...btcChannels].sort(
      (a, b) => b.local_balance - a.local_balance
    )[0];

    if (btcChannel.local_balance < rebalanceSats) {
      throw new Error(
        `Insufficient BTC local balance for circular rebalance: ` +
          `need ${rebalanceSats} sats, have ${btcChannel.local_balance} sats`
      );
    }

    const [
      [heightResult, heightError],
      [identity, identityError],
      [btcChannelInfo, btcChannelInfoError],
    ] = await Promise.all([
      toWithError(this.nodeService.getHeight(id)),
      toWithError(this.nodeService.getIdentity(id)),
      toWithError(this.nodeService.getChannel(id, btcChannel.id)),
    ]);

    if (btcChannelInfoError) {
      this.logger.warn(
        'rebalanceTaChannel: could not fetch BTC channel info; using fee defaults',
        { error: btcChannelInfoError, channelId: btcChannel.id }
      );
    }

    if (heightError || !heightResult?.current_block_height) {
      throw new Error('Rebalance failed: could not get current block height');
    }

    if (identityError || !identity?.public_key) {
      throw new Error('Rebalance failed: could not get node identity');
    }

    const btcPeerPolicy = btcChannelInfo?.policies?.find(
      (p: { public_key: string }) => p.public_key === peerPubkey
    );
    const btcChannelCltvDelta: number =
      btcPeerPolicy?.cltv_delta ?? DEFAULT_CHANNEL_CLTV_DELTA;

    const [taChannelInfo] = await toWithError(
      this.nodeService.getChannel(id, taChannelScid)
    );
    const taOurPolicy = taChannelInfo?.policies?.find(
      (p: { public_key: string }) => p.public_key === identity.public_key
    );
    const taCltvDelta: number =
      taOurPolicy?.cltv_delta ?? DEFAULT_CHANNEL_CLTV_DELTA;
    // Fee the peer charges on the TA channel (their outgoing leg for hop 2).
    const taPeerPolicy = taChannelInfo?.policies?.find(
      (p: { public_key: string }) => p.public_key === peerPubkey
    );
    const taBaseFee = BigInt(taPeerPolicy?.base_fee_mtokens ?? '1000');
    const taFeeRate = BigInt(taPeerPolicy?.fee_rate ?? 2500);

    const [invoice, invoiceError] = await toWithError(
      this.nodeService.createInvoice(id, {
        tokens: rebalanceSats,
        cltv_delta: DEFAULT_INVOICE_CLTV_DELTA,
      })
    );

    if (invoiceError || !invoice?.request || !invoice.id || !invoice.payment) {
      throw new Error(
        'Rebalance failed: could not create self-payment invoice'
      );
    }

    const currentHeight: number = heightResult.current_block_height;
    const invoiceCltvDelta = DEFAULT_INVOICE_CLTV_DELTA;
    const hop2Timeout = currentHeight + invoiceCltvDelta + CLTV_BLOCK_BUFFER;
    const hopCltvDelta = Math.max(taCltvDelta, btcChannelCltvDelta);
    const hop1Timeout = hop2Timeout + hopCltvDelta;

    const forwardMtokens = BigInt(rebalanceSats) * BigInt(1000);
    // Fee the peer earns forwarding on the TA channel (hop 2, their outgoing leg).
    // Hop 1 (our BTC outgoing) has fee=0 — we don't pay ourselves to send.
    const hop2FeeMtokens =
      taBaseFee + (forwardMtokens * taFeeRate) / BigInt(1_000_000);
    const hop2Fee = Number((hop2FeeMtokens + BigInt(999)) / BigInt(1000));
    const totalMtokens = forwardMtokens + hop2FeeMtokens;

    const rebalanceRoute = {
      fee: hop2Fee,
      fee_mtokens: String(hop2FeeMtokens),
      hops: [
        {
          // Hop 1: us → peer via BTC channel. Fee=0: we are the sender on our
          // own channel and don't charge ourselves a forwarding fee.
          channel: btcChannel.id,
          channel_capacity: btcChannel.capacity,
          fee: 0,
          fee_mtokens: '0',
          forward: rebalanceSats,
          forward_mtokens: String(forwardMtokens),
          public_key: peerPubkey,
          timeout: hop2Timeout,
        },
        {
          // Hop 2: peer → us via TA channel. Fee = peer's TA channel policy:
          // the peer charges this fee for forwarding on their outgoing leg.
          // Use partner_scid_alias (the peer's own local alias) — the real SCID
          // and our own alias_scids give UnknownNextPeer for private TA channels.
          channel: taChannelPeerAlias ?? taChannelScid,
          channel_capacity: taChannelCapacity,
          fee: hop2Fee,
          fee_mtokens: String(hop2FeeMtokens),
          forward: rebalanceSats,
          forward_mtokens: String(forwardMtokens),
          public_key: identity.public_key,
          timeout: hop2Timeout,
        },
      ],
      mtokens: String(totalMtokens),
      payment: invoice.payment,
      timeout: hop1Timeout,
      tokens: Number((totalMtokens + BigInt(999)) / BigInt(1000)),
      total_mtokens: String(forwardMtokens),
    };

    this.logger.info('Executing circular rebalance to top up TA channel', {
      taChannelScid,
      taChannelPeerAlias,
      btcChannelId: btcChannel.id,
      rebalanceSats,
      hop1Timeout,
      hop2Timeout,
      hopCltvDelta,
    });

    let rebalResult: PayViaRoutesResult | undefined;
    try {
      rebalResult = await this.nodeService.payViaRoutes(id, {
        id: invoice.id,
        routes: [rebalanceRoute],
      });
    } catch (err: unknown) {
      const rawErr = err as unknown[];
      this.logger.error('Circular rebalance payment failed', {
        error: Array.isArray(rawErr) ? rawErr[1] : String(err),
        failures: JSON.stringify(Array.isArray(rawErr) ? rawErr[2] : undefined),
        taChannelScid,
      });
      throw new Error('Circular rebalance payment failed');
    }

    this.logger.info('Circular rebalance completed', {
      taChannelScid,
      taChannelPeerAlias,
      is_confirmed: rebalResult?.is_confirmed,
      hops: rebalResult?.hops?.map((h: { channel: string }) => h.channel),
    });

    if (!rebalResult?.is_confirmed) {
      throw new Error('Circular rebalance payment did not confirm');
    }
  }

  private async getBtcChannelsWithPeer(
    id: string,
    peerPubkey: string
  ): Promise<Array<BtcChannel>> {
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

    return channelsResult.channels.filter(isBtcChannel) as Array<BtcChannel>;
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
