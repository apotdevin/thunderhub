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

type BtcChannel = {
  id: string;
  capacity: number;
  local_balance: number;
  remote_balance: number;
};

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
}

describe('TradeResolver', () => {
  const userId = 'test-user-id';
  const peerPubkey = 'ab'.repeat(33);
  const myPubkey = 'cd'.repeat(33);

  const mockNodeService = {
    getChannels: jest.fn(),
    getChannel: jest.fn(),
    getIdentity: jest.fn(),
  };
  const mockTapdNodeService = {};
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
