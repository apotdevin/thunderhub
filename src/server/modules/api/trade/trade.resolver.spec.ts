jest.mock('../../node/tapd/tapd-node.service', () => ({
  TapdNodeService: jest.fn(),
}));
jest.mock('../../node/node.service', () => ({
  NodeService: jest.fn(),
}));
jest.mock('../../security/security.decorators', () => ({
  CurrentUser: () => () => undefined,
}));
jest.mock('../../security/security.types', () => ({}));

import { TradeResolver } from './trade.resolver';
import { BtcChannel, TaChannel } from './trade.types';

type RouteHop = {
  public_key: string;
  channel?: string;
  cltv_delta?: number;
};

// Combined private-method accessor to avoid repeating the cast per suite.
interface PrivateMethods {
  buildBtcReturnHint(
    id: string,
    peerPubkey: string,
    btcChannels: BtcChannel[]
  ): Promise<unknown>;
  getBtcChannels(id: string): Promise<BtcChannel[]>;
  findVirtualScidHint(
    routes: RouteHop[][],
    peerPubkey: string,
    expectedChannel?: string
  ): { channel: string; cltv_delta?: number } | undefined;
  deriveSatsFromRate(
    assetAmount: string,
    rate: { coefficient: string; scale: number },
    minTransportableMsat: string
  ): number;
  findTaChannelsForAsset(
    id: string,
    peerPubkey: string,
    assetId: string | undefined,
    groupKey: string | undefined
  ): Promise<
    Array<{
      scid: string;
      partnerScidAlias: string | undefined;
      capacity: number;
      localBalance: number;
      localReserve: number;
    }>
  >;
  rebalanceTaChannel(
    id: string,
    peerPubkey: string,
    taChannelScid: string,
    taChannelPartnerScidAlias: string | undefined,
    rebalanceSats: number
  ): Promise<void>;
}

describe('TradeResolver', () => {
  const userId = 'test-user-id';
  const peerPubkey = 'ab'.repeat(33);
  const myPubkey = 'cd'.repeat(33);

  const mockNodeService = {
    getChannels: jest.fn(),
    getChannel: jest.fn(),
    getIdentity: jest.fn(),
    getHeight: jest.fn(),
    createInvoice: jest.fn(),
    decodePaymentRequest: jest.fn(),
    payViaRoutes: jest.fn(),
    pay: jest.fn(),
    getRouteToDestination: jest.fn(),
  };
  const mockTapdNodeService = {
    getAssetChannelBalances: jest.fn(),
  };
  const mockLogger = { error: jest.fn(), warn: jest.fn(), info: jest.fn() };

  let resolver: TradeResolver;
  let priv: PrivateMethods;

  beforeEach(() => {
    jest.clearAllMocks();
    mockNodeService.getIdentity.mockResolvedValue({ public_key: myPubkey });
    // Default: no gossiped policy available — exercises the fallback path
    mockNodeService.getChannel.mockRejectedValue(
      new Error('channel not in graph')
    );
    mockNodeService.getHeight.mockResolvedValue({
      current_block_height: 800_000,
    });
    mockNodeService.createInvoice.mockResolvedValue({
      id: 'aa'.repeat(32),
      payment: 'bb'.repeat(32),
      request: 'lnbc...',
      secret: 'cc'.repeat(32),
    });
    // Default decoded invoice: a single TA-channel route hint via the peer
    // with the default channel cltv_delta and a typical forwarding fee.
    // Tests that need different cltv/fees override this per-test.
    mockNodeService.decodePaymentRequest.mockResolvedValue({
      cltv_delta: 40,
      mtokens: '1200000',
      // The route hint channel is the peer's SCID alias for the TA channel
      // (what LND embeds in invoices for private channels), not our canonical
      // SCID.
      routes: [
        [
          {
            public_key: peerPubkey,
            channel: '16000000x0x1',
            cltv_delta: 40,
            base_fee_mtokens: '1000',
            fee_rate: 2500,
          },
        ],
      ],
    });
    mockNodeService.payViaRoutes.mockResolvedValue({ is_confirmed: true });
    // Default: optimistic pay() fails so multi-hop tests exercise the explicit
    // pathfinding fallback. Tests for the optimistic-success path override this.
    mockNodeService.pay.mockRejectedValue(new Error('no route via pay()'));
    mockNodeService.getRouteToDestination.mockResolvedValue({
      route: undefined,
    });
    mockTapdNodeService.getAssetChannelBalances.mockResolvedValue([]);
    resolver = new TradeResolver(
      mockTapdNodeService as never,
      mockNodeService as never,
      mockLogger as never
    );
    priv = resolver as unknown as PrivateMethods;
  });

  // ── Regression guard against upstream channelTypes mapping ──
  // getBtcChannelsWithPeer filters BTC channels by truthy `type`, which relies
  // on the `lightning` package leaving SIMPLE_TAPROOT_OVERLAY unmapped (undefined)
  // while mapping real BTC commitment types (ANCHORS, SIMPLE_TAPROOT, …) to
  // non-empty strings. If upstream ever adds an entry for SIMPLE_TAPROOT_OVERLAY,
  // the filter will start treating TA channels as BTC and the self-pay loop
  // will regress. Fail fast here so a dependency bump surfaces the issue.

  describe('lightning channelTypes constants (upstream regression guard)', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const constants = require('lightning/lnd_responses/constants.json') as {
      channelTypes: Record<string, string>;
    };

    it('does not map SIMPLE_TAPROOT_OVERLAY (TA channels must stay untyped)', () => {
      expect(constants.channelTypes.SIMPLE_TAPROOT_OVERLAY).toBeUndefined();
    });

    it('maps real BTC commitment types to non-empty strings', () => {
      expect(constants.channelTypes.ANCHORS).toBeTruthy();
      expect(constants.channelTypes.SIMPLE_TAPROOT).toBeTruthy();
      expect(constants.channelTypes.STATIC_REMOTE_KEY).toBeTruthy();
    });
  });

  // ── buildBtcReturnHint ──

  describe('buildBtcReturnHint', () => {
    const btcChannel = (
      id: string,
      remote: number
    ): BtcChannel & { type: string } => ({
      id,
      type: 'anchor',
      capacity: 2_000_000,
      local_balance: 1_000_000,
      remote_balance: remote,
    });

    it('picks the BTC channel with the largest remote_balance', async () => {
      const channels = [
        btcChannel('btc-medium', 200_000),
        btcChannel('btc-small', 50_000),
        btcChannel('btc-largest', 900_000),
        btcChannel('btc-large', 500_000),
      ];

      const hint = await priv.buildBtcReturnHint(userId, peerPubkey, channels);

      expect((hint as Array<{ channel?: string }>)[1].channel).toBe(
        'btc-largest'
      );
      expect(mockNodeService.getChannel).toHaveBeenCalledWith(
        userId,
        'btc-largest'
      );
    });

    it("uses the peer's gossiped policy when available", async () => {
      mockNodeService.getChannel.mockResolvedValue({
        id: 'btc-1',
        policies: [
          {
            public_key: myPubkey,
            base_fee_mtokens: '0',
            fee_rate: 1,
            cltv_delta: 144,
          },
          {
            public_key: peerPubkey,
            base_fee_mtokens: '500',
            fee_rate: 750,
            cltv_delta: 80,
          },
        ],
      });

      const hint = await priv.buildBtcReturnHint(userId, peerPubkey, [
        btcChannel('btc-1', 500_000),
      ]);

      expect(hint).toEqual([
        { public_key: peerPubkey },
        {
          public_key: myPubkey,
          channel: 'btc-1',
          base_fee_mtokens: '500',
          fee_rate: 750,
          cltv_delta: 80,
        },
      ]);
    });

    it('falls back to conservative defaults when peer policy is missing from gossip', async () => {
      mockNodeService.getChannel.mockResolvedValue({
        id: 'btc-1',
        policies: [
          {
            public_key: myPubkey,
            base_fee_mtokens: '0',
            fee_rate: 1,
            cltv_delta: 144,
          },
        ],
      });

      const hint = await priv.buildBtcReturnHint(userId, peerPubkey, [
        btcChannel('btc-1', 500_000),
      ]);

      expect(hint).toEqual([
        { public_key: peerPubkey },
        {
          public_key: myPubkey,
          channel: 'btc-1',
          base_fee_mtokens: '1000',
          fee_rate: 2500,
          cltv_delta: 40,
        },
      ]);
    });

    it('returns undefined when given an empty channels array', async () => {
      await expect(
        priv.buildBtcReturnHint(userId, peerPubkey, [])
      ).resolves.toBeUndefined();
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'No BTC channel with peer; omitting return hint',
        expect.any(Object)
      );
    });

    it('returns undefined when getIdentity fails', async () => {
      mockNodeService.getIdentity.mockRejectedValue(new Error('no identity'));

      await expect(
        priv.buildBtcReturnHint(userId, peerPubkey, [
          btcChannel('btc-1', 100_000),
        ])
      ).resolves.toBeUndefined();
    });
  });

  // ── getBtcChannels ──

  describe('getBtcChannels', () => {
    it('filters out TA channels (type undefined)', async () => {
      mockNodeService.getChannels.mockResolvedValue({
        channels: [
          {
            id: 'ta-1',
            type: undefined,
            capacity: 1_000_000,
            local_balance: 500_000,
            remote_balance: 500_000,
          },
          {
            id: 'btc-1',
            type: 'anchor',
            capacity: 2_000_000,
            local_balance: 1_000_000,
            remote_balance: 1_000_000,
          },
        ],
      });

      const result = await priv.getBtcChannels(userId);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('btc-1');
    });

    it('returns empty array and logs warning on getChannels error', async () => {
      mockNodeService.getChannels.mockRejectedValue(new Error('rpc down'));

      const result = await priv.getBtcChannels(userId);

      expect(result).toEqual([]);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Failed to fetch channels',
        expect.any(Object)
      );
    });

    it('returns empty array when there are no channels', async () => {
      mockNodeService.getChannels.mockResolvedValue({ channels: [] });

      const result = await priv.getBtcChannels(userId);

      expect(result).toEqual([]);
    });
  });

  // ── findVirtualScidHint ──

  describe('findVirtualScidHint', () => {
    it('finds hint on the peer entry itself', () => {
      const routes = [
        [{ public_key: peerPubkey, channel: '123x1x0', cltv_delta: 144 }],
      ];

      expect(priv.findVirtualScidHint(routes, peerPubkey)).toEqual({
        channel: '123x1x0',
        cltv_delta: 144,
      });
    });

    it('finds hint on the next entry (destination) when peer entry has no channel', () => {
      const destPubkey = 'ee'.repeat(33);
      const routes = [
        [
          { public_key: peerPubkey },
          { public_key: destPubkey, channel: '456x2x1', cltv_delta: 80 },
        ],
      ];

      expect(priv.findVirtualScidHint(routes, peerPubkey)).toEqual({
        channel: '456x2x1',
        cltv_delta: 80,
      });
    });

    it('returns undefined when peer pubkey is not in any route', () => {
      const otherPubkey = 'ff'.repeat(33);
      const routes = [
        [{ public_key: otherPubkey, channel: '789x3x0', cltv_delta: 40 }],
      ];

      expect(priv.findVirtualScidHint(routes, peerPubkey)).toBeUndefined();
    });

    it('returns undefined for empty routes', () => {
      expect(priv.findVirtualScidHint([], peerPubkey)).toBeUndefined();
    });

    it('searches across multiple routes and returns the first match', () => {
      const otherPubkey = 'ff'.repeat(33);
      const routes = [
        [{ public_key: otherPubkey, channel: '111x1x0' }],
        [{ public_key: peerPubkey, channel: '222x2x0', cltv_delta: 100 }],
      ];

      expect(priv.findVirtualScidHint(routes, peerPubkey)).toEqual({
        channel: '222x2x0',
        cltv_delta: 100,
      });
    });
  });

  // ── findTaChannelForAsset ──

  describe('findTaChannelForAsset', () => {
    const assetId = 'ff'.repeat(32);
    const groupKey = 'ee'.repeat(33);

    const makeTaChannel = (overrides: Partial<TaChannel> = {}): TaChannel => ({
      id: 'ta-scid-1',
      capacity: 1_000_000,
      local_balance: 300_000,
      local_reserve: 1_062,
      remote_balance: 700_000,
      transaction_id: 'aabb'.repeat(16),
      transaction_vout: 0,
      ...overrides,
    });

    it('returns the matching TA channel by assetId via channelPoint join', async () => {
      const taChannel = makeTaChannel();
      mockNodeService.getChannels.mockResolvedValue({
        channels: [
          {
            id: 'btc-1',
            type: 'anchor',
            capacity: 2_000_000,
            local_balance: 1_000_000,
            remote_balance: 1_000_000,
          },
          { ...taChannel, type: undefined },
        ],
      });
      mockTapdNodeService.getAssetChannelBalances.mockResolvedValue([
        {
          channelPoint: `${taChannel.transaction_id}:${taChannel.transaction_vout}`,
          assetId,
          groupKey: '',
        },
      ]);

      const result = await priv.findTaChannelsForAsset(
        userId,
        peerPubkey,
        assetId,
        undefined
      );

      expect(result).toEqual([
        {
          scid: taChannel.id,
          partnerScidAlias: undefined,
          capacity: taChannel.capacity,
          localBalance: taChannel.local_balance,
          localReserve: taChannel.local_reserve,
        },
      ]);
    });

    it('returns empty array when assetId does not match any TA channel', async () => {
      const taChannel = makeTaChannel();
      mockNodeService.getChannels.mockResolvedValue({
        channels: [{ ...taChannel, type: undefined }],
      });
      mockTapdNodeService.getAssetChannelBalances.mockResolvedValue([
        {
          channelPoint: `${taChannel.transaction_id}:${taChannel.transaction_vout}`,
          assetId: 'cc'.repeat(32),
          groupKey: '',
        },
      ]);

      const result = await priv.findTaChannelsForAsset(
        userId,
        peerPubkey,
        assetId,
        undefined
      );

      expect(result).toEqual([]);
    });

    it('matches by groupKey when assetId is undefined', async () => {
      const taChannel = makeTaChannel();
      mockNodeService.getChannels.mockResolvedValue({
        channels: [{ ...taChannel, type: undefined }],
      });
      mockTapdNodeService.getAssetChannelBalances.mockResolvedValue([
        {
          channelPoint: `${taChannel.transaction_id}:${taChannel.transaction_vout}`,
          assetId: 'dd'.repeat(32),
          groupKey,
        },
      ]);

      const result = await priv.findTaChannelsForAsset(
        userId,
        peerPubkey,
        undefined,
        groupKey
      );

      expect(result[0]?.scid).toBe(taChannel.id);
    });

    it('returns empty array and logs warning when getChannels fails', async () => {
      mockNodeService.getChannels.mockRejectedValue(new Error('rpc down'));

      const result = await priv.findTaChannelsForAsset(
        userId,
        peerPubkey,
        assetId,
        undefined
      );

      expect(result).toEqual([]);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Failed to fetch TA channel info with peer',
        expect.any(Object)
      );
    });

    it('returns empty array and logs warning when getAssetChannelBalances fails', async () => {
      const taChannel = makeTaChannel();
      mockNodeService.getChannels.mockResolvedValue({
        channels: [{ ...taChannel, type: undefined }],
      });
      mockTapdNodeService.getAssetChannelBalances.mockRejectedValue(
        new Error('tapd down')
      );

      const result = await priv.findTaChannelsForAsset(
        userId,
        peerPubkey,
        assetId,
        undefined
      );

      expect(result).toEqual([]);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Failed to fetch asset channel balances with peer',
        expect.any(Object)
      );
    });

    it('matches by groupKey when both assetId and groupKey are provided (groupKey wins)', async () => {
      const taChannel = makeTaChannel();
      mockNodeService.getChannels.mockResolvedValue({
        channels: [{ ...taChannel, type: undefined }],
      });
      mockTapdNodeService.getAssetChannelBalances.mockResolvedValue([
        {
          channelPoint: `${taChannel.transaction_id}:${taChannel.transaction_vout}`,
          assetId: 'dd'.repeat(32), // different assetId — should be ignored
          groupKey,
        },
      ]);

      const result = await priv.findTaChannelsForAsset(
        userId,
        peerPubkey,
        assetId,
        groupKey
      );

      expect(result[0]?.scid).toBe(taChannel.id);
    });

    it('returns empty array immediately when neither assetId nor groupKey is provided', async () => {
      const result = await priv.findTaChannelsForAsset(
        userId,
        peerPubkey,
        undefined,
        undefined
      );

      expect(result).toEqual([]);
      expect(mockNodeService.getChannels).not.toHaveBeenCalled();
    });

    it('returns empty array when all channels are BTC type (no TA channels)', async () => {
      mockNodeService.getChannels.mockResolvedValue({
        channels: [
          {
            id: 'btc-1',
            type: 'anchor',
            capacity: 2_000_000,
            local_balance: 1_000_000,
            remote_balance: 1_000_000,
          },
        ],
      });

      const result = await priv.findTaChannelsForAsset(
        userId,
        peerPubkey,
        assetId,
        undefined
      );

      expect(result).toEqual([]);
    });
  });

  // ── deriveSatsFromRate ──

  describe('deriveSatsFromRate', () => {
    it('computes sats from rate and asset amount', () => {
      // rate = 50000 * 10^(-2) = 500 assets per BTC
      // 100 assets at 500/BTC = 0.2 BTC = 20_000_000 sats
      const sats = priv.deriveSatsFromRate(
        '100',
        { coefficient: '50000', scale: 2 },
        '0'
      );

      expect(sats).toBe(20_000_000);
    });

    it('ceils to the next sat', () => {
      // rate = 3 * 10^0 = 3 assets per BTC
      // 1 asset at 3/BTC = 0.333... BTC = 33_333_334 sats (ceil)
      const sats = priv.deriveSatsFromRate(
        '1',
        { coefficient: '3', scale: 0 },
        '0'
      );

      expect(sats).toBe(33_333_334);
    });

    it('respects minTransportableMsat floor', () => {
      const sats = priv.deriveSatsFromRate(
        '1',
        { coefficient: '100000000', scale: 0 },
        '10000000'
      );

      expect(sats).toBeGreaterThanOrEqual(10_000);
    });
  });

  // ── rebalanceTaChannel ──

  describe('rebalanceTaChannel', () => {
    const taChannelScid = '800000x1x0';
    const taChannelPartnerScidAlias = '16000000x0x1';
    const rebalanceSats = 1_200;
    const currentHeight = 800_000;

    // A synthetic 2-hop route from us → middle → peer that
    // getRouteToDestination returns. The peer is the last hop; my code rewrites
    // its fee and appends the TA hop.
    const baseRoute = {
      route: {
        fee: 4,
        fee_mtokens: '4000',
        hops: [
          {
            channel: 'btc-out-1',
            channel_capacity: 5_000_000,
            fee: 2,
            fee_mtokens: '2000',
            forward: 1_202,
            forward_mtokens: '1202000',
            public_key: 'mid'.repeat(22),
            timeout: 800_073,
          },
          {
            channel: 'btc-mid-peer',
            channel_capacity: 5_000_000,
            fee: 2,
            fee_mtokens: '2000',
            forward: 1_200,
            forward_mtokens: '1200000',
            public_key: peerPubkey,
            timeout: 800_067,
          },
        ],
        mtokens: '1204000',
        safe_fee: 4,
        safe_tokens: 1_204,
        timeout: 800_073,
        tokens: 1_204,
      },
    };

    it('builds a multi-hop circular route and submits via payViaRoutes', async () => {
      mockNodeService.getRouteToDestination.mockResolvedValue(baseRoute);

      await priv.rebalanceTaChannel(
        userId,
        peerPubkey,
        taChannelScid,
        taChannelPartnerScidAlias,
        rebalanceSats
      );

      // Pathfinding request includes peer's TA fee in tokens, plus headroom
      // for the TA hop's CLTV delta.
      const pathArgs = mockNodeService.getRouteToDestination.mock.calls[0][1];
      expect(pathArgs.destination).toBe(peerPubkey);
      // forwardMtokens = 1_200_000; peerFee mtokens = 1000 + (1_200_000 *
      // 2500 / 1_000_000) = 4000 → ceil to 4 sats. tokens = 1200 + 4 = 1204.
      expect(pathArgs.tokens).toBe(1_204);
      // invoiceCltvDelta(40) + taCltvDelta(40) + CLTV_BLOCK_BUFFER(3) = 83
      expect(pathArgs.cltv_delta).toBe(83);

      expect(mockNodeService.payViaRoutes).toHaveBeenCalledTimes(1);
      const submitted = mockNodeService.payViaRoutes.mock.calls[0][1] as {
        id: string;
        routes: Array<{
          payment: string;
          total_mtokens: string;
          fee: number;
          fee_mtokens: string;
          tokens: number;
          mtokens: string;
          hops: Array<{
            channel: string;
            public_key: string;
            fee: number;
            fee_mtokens: string;
            forward: number;
            forward_mtokens: string;
            timeout: number;
          }>;
        }>;
      };

      const route = submitted.routes[0];
      expect(submitted.id).toBe('aa'.repeat(32));
      expect(route.payment).toBe('bb'.repeat(32)); // invoice.payment
      expect(route.total_mtokens).toBe('1200000'); // decoded.mtokens
      expect(route.tokens).toBe(1_204); // baseRoute.tokens
      expect(route.mtokens).toBe('1204000'); // baseRoute.mtokens

      // 2 LND hops + 1 appended TA hop
      expect(route.hops).toHaveLength(3);

      // Peer hop: previously the destination (fee=0), now an intermediate
      // forwarder that takes peerFee for forwarding over the TA channel.
      // forward is overridden to rebalanceSats — the amount peer forwards to
      // us, NOT what they receive — so their earned fee = incoming - outgoing.
      // timeout is overridden to finalHopTimeout: hop.timeout encodes the
      // OUTGOING locktime, and the peer's outgoing locktime must equal the
      // TA hop's incoming locktime, otherwise the peer rejects the HTLC with
      // IncorrectCltvExpiry.
      const peerHop = route.hops[1];
      expect(peerHop.public_key).toBe(peerPubkey);
      expect(peerHop.fee).toBe(4);
      expect(peerHop.fee_mtokens).toBe('4000');
      expect(peerHop.forward).toBe(rebalanceSats);
      expect(peerHop.forward_mtokens).toBe('1200000');
      expect(peerHop.timeout).toBe(currentHeight + 40 + 3);

      // Appended TA hop: peer → us via the TA channel. Channel is the
      // peer's SCID alias (what they recognize), fee=0, timeout uses block
      // height + invoice CLTV.
      const taHop = route.hops[2];
      expect(taHop.channel).toBe(taChannelPartnerScidAlias);
      expect(taHop.public_key).toBe(myPubkey);
      expect(taHop.fee).toBe(0);
      expect(taHop.fee_mtokens).toBe('0');
      expect(taHop.forward).toBe(rebalanceSats);
      expect(taHop.forward_mtokens).toBe('1200000');
      // currentHeight + invoiceCltvDelta(40) + CLTV_BLOCK_BUFFER(3)
      expect(taHop.timeout).toBe(currentHeight + 40 + 3);

      // Route fee total grows by peerFeeMtokens; mtokens (amount entering
      // route) is unchanged.
      expect(route.fee_mtokens).toBe('8000'); // 4000 (base) + 4000 (peer)
      expect(route.fee).toBe(8);
    });

    it('throws when TA channel has no partner SCID alias', async () => {
      await expect(
        priv.rebalanceTaChannel(
          userId,
          peerPubkey,
          taChannelScid,
          undefined,
          rebalanceSats
        )
      ).rejects.toThrow('TA channel has no partner SCID alias');
    });

    it('throws when no TA route hint is found in the invoice', async () => {
      mockNodeService.decodePaymentRequest.mockResolvedValue({
        cltv_delta: 40,
        mtokens: '1200000',
        routes: [],
      });

      await expect(
        priv.rebalanceTaChannel(
          userId,
          peerPubkey,
          taChannelScid,
          taChannelPartnerScidAlias,
          rebalanceSats
        )
      ).rejects.toThrow('no TA channel route hint');
    });

    it('throws when pathfinding returns no route to peer', async () => {
      mockNodeService.getRouteToDestination.mockResolvedValue({
        route: undefined,
      });

      await expect(
        priv.rebalanceTaChannel(
          userId,
          peerPubkey,
          taChannelScid,
          taChannelPartnerScidAlias,
          rebalanceSats
        )
      ).rejects.toThrow('no route to peer');
    });

    it('throws when createInvoice fails', async () => {
      mockNodeService.createInvoice.mockRejectedValue(new Error('rpc down'));

      await expect(
        priv.rebalanceTaChannel(
          userId,
          peerPubkey,
          taChannelScid,
          taChannelPartnerScidAlias,
          rebalanceSats
        )
      ).rejects.toThrow('could not create self-payment invoice');
    });

    it('throws when payViaRoutes throws', async () => {
      mockNodeService.getRouteToDestination.mockResolvedValue(baseRoute);
      mockNodeService.payViaRoutes.mockImplementation(() => {
        throw ['503', 'FAILURE_REASON_INSUFFICIENT_BALANCE', { failures: [] }];
      });

      await expect(
        priv.rebalanceTaChannel(
          userId,
          peerPubkey,
          taChannelScid,
          taChannelPartnerScidAlias,
          rebalanceSats
        )
      ).rejects.toThrow('Circular rebalance payment failed');
    });

    it('throws when payViaRoutes resolves is_confirmed: false', async () => {
      mockNodeService.getRouteToDestination.mockResolvedValue(baseRoute);
      mockNodeService.payViaRoutes.mockResolvedValue({ is_confirmed: false });

      await expect(
        priv.rebalanceTaChannel(
          userId,
          peerPubkey,
          taChannelScid,
          taChannelPartnerScidAlias,
          rebalanceSats
        )
      ).rejects.toThrow('did not confirm');
    });

    it('uses partner SCID alias to disambiguate route hints', async () => {
      const alias = '16000000x0x1';
      mockNodeService.decodePaymentRequest.mockResolvedValue({
        cltv_delta: 40,
        mtokens: '1200000',
        routes: [
          [
            {
              public_key: peerPubkey,
              channel: 'btc-private-1',
              cltv_delta: 80,
              base_fee_mtokens: '0',
              fee_rate: 0,
            },
          ],
          [
            {
              public_key: peerPubkey,
              channel: alias,
              cltv_delta: 144,
              base_fee_mtokens: '0',
              fee_rate: 0,
            },
          ],
        ],
      });
      mockNodeService.getRouteToDestination.mockResolvedValue(baseRoute);

      await priv.rebalanceTaChannel(
        userId,
        peerPubkey,
        taChannelScid,
        alias,
        rebalanceSats
      );

      // Pathfinding requested with the alias-matched hint's cltv_delta(144),
      // not the other hint's cltv_delta(80).
      const pathArgs = mockNodeService.getRouteToDestination.mock.calls[0][1];
      expect(pathArgs.cltv_delta).toBe(40 + 144 + 3);

      // The appended TA hop uses the partner SCID alias (the peer's local
      // identifier for the channel).
      const submitted = mockNodeService.payViaRoutes.mock.calls[0][1] as {
        routes: Array<{ hops: Array<{ channel: string }> }>;
      };
      const taHop = submitted.routes[0].hops[2];
      expect(taHop.channel).toBe(alias);
    });

    it('resolves without error on success', async () => {
      mockNodeService.getRouteToDestination.mockResolvedValue(baseRoute);

      await expect(
        priv.rebalanceTaChannel(
          userId,
          peerPubkey,
          taChannelScid,
          taChannelPartnerScidAlias,
          rebalanceSats
        )
      ).resolves.toBeUndefined();
    });
  });
});
