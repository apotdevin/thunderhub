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
  getBtcChannelsWithPeer(id: string, peerPubkey: string): Promise<BtcChannel[]>;
  findVirtualScidHint(
    routes: RouteHop[][],
    peerPubkey: string
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
    taChannelCapacity: number,
    btcChannel: BtcChannel,
    rebalanceSats: number,
    currentHeight: number,
    identityPubkey: string
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
      routes: [
        [
          {
            public_key: peerPubkey,
            channel: '800000x1x0',
            cltv_delta: 40,
            base_fee_mtokens: '1000',
            fee_rate: 2500,
          },
        ],
      ],
    });
    mockNodeService.payViaRoutes.mockResolvedValue({ is_confirmed: true });
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

  // ── getBtcChannelsWithPeer ──

  describe('getBtcChannelsWithPeer', () => {
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

      const result = await priv.getBtcChannelsWithPeer(userId, peerPubkey);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('btc-1');
    });

    it('returns empty array and logs warning on getChannels error', async () => {
      mockNodeService.getChannels.mockRejectedValue(new Error('rpc down'));

      const result = await priv.getBtcChannelsWithPeer(userId, peerPubkey);

      expect(result).toEqual([]);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Failed to fetch channels with peer',
        expect.objectContaining({ peerPubkey })
      );
    });

    it('returns empty array when peer has no channels', async () => {
      mockNodeService.getChannels.mockResolvedValue({ channels: [] });

      const result = await priv.getBtcChannelsWithPeer(userId, peerPubkey);

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

  // ── rebalanceTaChannel ──

  describe('rebalanceTaChannel', () => {
    const taChannelScid = '800000x1x0';
    const taChannelCapacity = 1_000_000;
    const btcChannel: BtcChannel = {
      id: 'btc-1',
      capacity: 2_000_000,
      local_balance: 500_000,
      remote_balance: 300_000,
    };
    const rebalanceSats = 1_200;
    const currentHeight = 800_000;

    it('builds correct 2-hop route and calls payViaRoutes', async () => {
      await priv.rebalanceTaChannel(
        userId,
        peerPubkey,
        taChannelScid,
        undefined,
        taChannelCapacity,
        btcChannel,
        rebalanceSats,
        currentHeight,
        myPubkey
      );

      expect(mockNodeService.payViaRoutes).toHaveBeenCalledTimes(1);
      const call = mockNodeService.payViaRoutes.mock.calls[0];
      const routes: Array<{
        hops: Array<{
          channel: string;
          public_key: string;
          fee: number;
          timeout: number;
        }>;
        timeout: number;
      }> = call[1].routes;

      expect(routes).toHaveLength(1);
      const [hop1, hop2] = routes[0].hops;
      expect(hop1.channel).toBe('btc-1');
      expect(hop1.public_key).toBe(peerPubkey);
      expect(hop1.fee).toBeGreaterThan(0);
      expect(hop2.channel).toBe(taChannelScid);
      expect(hop2.public_key).toBe(myPubkey);
      expect(hop2.fee).toBe(0);
      expect(hop1.timeout).toBe(hop2.timeout);
      expect(routes[0].timeout).toBeGreaterThan(hop1.timeout);
    });

    it('uses cltv_delta fallback of 40 when route hint has no cltv_delta', async () => {
      mockNodeService.decodePaymentRequest.mockResolvedValue({
        routes: [
          [
            {
              public_key: peerPubkey,
              channel: taChannelScid,
              base_fee_mtokens: '0',
              fee_rate: 0,
            },
          ],
        ],
      });

      await priv.rebalanceTaChannel(
        userId,
        peerPubkey,
        taChannelScid,
        undefined,
        taChannelCapacity,
        btcChannel,
        rebalanceSats,
        currentHeight,
        myPubkey
      );

      const routes = mockNodeService.payViaRoutes.mock.calls[0][1]
        .routes as Array<{
        hops: Array<{ timeout: number }>;
        timeout: number;
      }>;
      const hop2Timeout = routes[0].hops[0].timeout;
      // hop2Timeout = 800_000 + 24 (DEFAULT_INVOICE_CLTV_DELTA) + 3 = 800_027
      expect(hop2Timeout).toBe(800_027);
      // routes[0].timeout = hop2Timeout + 40 (DEFAULT_CHANNEL_CLTV_DELTA) = 800_067
      expect(routes[0].timeout).toBe(800_067);
    });

    it('uses cltv_delta from the TA channel route hint', async () => {
      mockNodeService.decodePaymentRequest.mockResolvedValue({
        routes: [
          [
            {
              public_key: peerPubkey,
              channel: taChannelScid,
              cltv_delta: 144,
              base_fee_mtokens: '0',
              fee_rate: 0,
            },
          ],
        ],
      });

      await priv.rebalanceTaChannel(
        userId,
        peerPubkey,
        taChannelScid,
        undefined,
        taChannelCapacity,
        btcChannel,
        rebalanceSats,
        currentHeight,
        myPubkey
      );

      const routes = mockNodeService.payViaRoutes.mock.calls[0][1]
        .routes as Array<{
        hops: Array<{ timeout: number }>;
        timeout: number;
      }>;
      const hop2Timeout = routes[0].hops[0].timeout;
      expect(hop2Timeout).toBe(800_027);
      expect(routes[0].timeout).toBe(800_027 + 144);
    });

    it('throws when no TA route hint is found in the invoice', async () => {
      mockNodeService.decodePaymentRequest.mockResolvedValue({ routes: [] });

      await expect(
        priv.rebalanceTaChannel(
          userId,
          peerPubkey,
          taChannelScid,
          undefined,
          taChannelCapacity,
          btcChannel,
          rebalanceSats,
          currentHeight,
          myPubkey
        )
      ).rejects.toThrow('no TA channel route hint');
    });

    it('selects the route hint matching taChannelPartnerScidAlias', async () => {
      const alias = '16000000x0x1';
      mockNodeService.decodePaymentRequest.mockResolvedValue({
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

      await priv.rebalanceTaChannel(
        userId,
        peerPubkey,
        taChannelScid,
        alias,
        taChannelCapacity,
        btcChannel,
        rebalanceSats,
        currentHeight,
        myPubkey
      );

      const routes = mockNodeService.payViaRoutes.mock.calls[0][1]
        .routes as Array<{
        hops: Array<{ channel: string; timeout: number }>;
        timeout: number;
      }>;
      const [, hop2] = routes[0].hops;
      expect(hop2.channel).toBe(alias);
      expect(routes[0].timeout).toBe(800_027 + 144);
    });

    it('throws when createInvoice fails', async () => {
      mockNodeService.createInvoice.mockRejectedValue(new Error('rpc down'));

      await expect(
        priv.rebalanceTaChannel(
          userId,
          peerPubkey,
          taChannelScid,
          undefined,
          taChannelCapacity,
          btcChannel,
          rebalanceSats,
          currentHeight,
          myPubkey
        )
      ).rejects.toThrow('could not create self-payment invoice');
    });

    it('throws when payViaRoutes throws', async () => {
      mockNodeService.payViaRoutes.mockImplementation(() => {
        throw ['503', 'FAILURE_REASON_INSUFFICIENT_BALANCE', { failures: [] }];
      });

      await expect(
        priv.rebalanceTaChannel(
          userId,
          peerPubkey,
          taChannelScid,
          undefined,
          taChannelCapacity,
          btcChannel,
          rebalanceSats,
          currentHeight,
          myPubkey
        )
      ).rejects.toThrow('Circular rebalance payment failed');
    });

    it('throws when payViaRoutes resolves is_confirmed: false', async () => {
      mockNodeService.payViaRoutes.mockResolvedValue({ is_confirmed: false });

      await expect(
        priv.rebalanceTaChannel(
          userId,
          peerPubkey,
          taChannelScid,
          undefined,
          taChannelCapacity,
          btcChannel,
          rebalanceSats,
          currentHeight,
          myPubkey
        )
      ).rejects.toThrow('did not confirm');
    });

    it('resolves without error on success', async () => {
      await expect(
        priv.rebalanceTaChannel(
          userId,
          peerPubkey,
          taChannelScid,
          undefined,
          taChannelCapacity,
          btcChannel,
          rebalanceSats,
          currentHeight,
          myPubkey
        )
      ).resolves.toBeUndefined();
    });

    it('computes zero fees and correct tokens when route hint has zero fees', async () => {
      mockNodeService.decodePaymentRequest.mockResolvedValue({
        routes: [
          [
            {
              public_key: peerPubkey,
              channel: taChannelScid,
              cltv_delta: 40,
              base_fee_mtokens: '0',
              fee_rate: 0,
            },
          ],
        ],
      });

      await priv.rebalanceTaChannel(
        userId,
        peerPubkey,
        taChannelScid,
        undefined,
        taChannelCapacity,
        btcChannel,
        rebalanceSats,
        currentHeight,
        myPubkey
      );

      const routes = mockNodeService.payViaRoutes.mock.calls[0][1]
        .routes as Array<{
        fee: number;
        tokens: number;
      }>;
      expect(routes[0].fee).toBe(0);
      expect(routes[0].tokens).toBe(rebalanceSats);
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
});
