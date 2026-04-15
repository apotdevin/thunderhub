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

// Access private method for direct unit testing of return-hint construction.
type BuildBtcReturnHint = (id: string, peerPubkey: string) => Promise<unknown>;

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
  });

  // ── Regression guard against upstream channelTypes mapping ──
  // buildBtcReturnHint filters BTC channels by truthy `type`, which relies on
  // the `lightning` package leaving SIMPLE_TAPROOT_OVERLAY unmapped (undefined)
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
    const buildHint = () => {
      const privateResolver = resolver as unknown as {
        buildBtcReturnHint: BuildBtcReturnHint;
      };
      return privateResolver.buildBtcReturnHint.call(
        resolver,
        userId,
        peerPubkey
      );
    };

    it('skips TA channels (type undefined) when selecting the BTC return channel', async () => {
      mockNodeService.getChannels.mockResolvedValue({
        channels: [
          // Taproot Asset channel has the largest remote_balance but must be skipped
          {
            id: 'ta-channel',
            type: undefined,
            remote_balance: 10_000_000,
          },
          { id: 'btc-channel', type: 'anchor', remote_balance: 500_000 },
        ],
      });

      const hint = await buildHint();

      expect(Array.isArray(hint)).toBe(true);
      expect((hint as Array<{ channel?: string }>)[1].channel).toBe(
        'btc-channel'
      );
    });

    it('picks the BTC channel with the largest remote_balance', async () => {
      // Input order scrambled so `.find()`-style selection on the original array
      // would pick the wrong channel — forces reliance on the sort.
      mockNodeService.getChannels.mockResolvedValue({
        channels: [
          { id: 'btc-medium', type: 'anchor', remote_balance: 200_000 },
          { id: 'btc-small', type: 'anchor', remote_balance: 50_000 },
          { id: 'btc-largest', type: 'anchor', remote_balance: 900_000 },
          { id: 'btc-large', type: 'anchor', remote_balance: 500_000 },
        ],
      });

      const hint = await buildHint();

      expect((hint as Array<{ channel?: string }>)[1].channel).toBe(
        'btc-largest'
      );
      expect(mockNodeService.getChannel).toHaveBeenCalledWith(
        userId,
        'btc-largest'
      );
    });

    it("uses the peer's gossiped policy when available", async () => {
      mockNodeService.getChannels.mockResolvedValue({
        channels: [{ id: 'btc-1', type: 'anchor', remote_balance: 500_000 }],
      });
      mockNodeService.getChannel.mockResolvedValue({
        id: 'btc-1',
        policies: [
          // Our side of the channel — must be ignored
          {
            public_key: myPubkey,
            base_fee_mtokens: '0',
            fee_rate: 1,
            cltv_delta: 144,
          },
          // Peer side — drives the hint
          {
            public_key: peerPubkey,
            base_fee_mtokens: '500',
            fee_rate: 750,
            cltv_delta: 80,
          },
        ],
      });

      const hint = await buildHint();

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
      mockNodeService.getChannels.mockResolvedValue({
        channels: [{ id: 'btc-1', type: 'anchor', remote_balance: 500_000 }],
      });
      mockNodeService.getChannel.mockResolvedValue({
        id: 'btc-1',
        // Only our policy gossiped — peer hasn't announced one yet
        policies: [
          {
            public_key: myPubkey,
            base_fee_mtokens: '0',
            fee_rate: 1,
            cltv_delta: 144,
          },
        ],
      });

      const hint = await buildHint();

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

    it('returns undefined when the peer has only TA channels', async () => {
      mockNodeService.getChannels.mockResolvedValue({
        channels: [
          { id: 'ta-1', type: undefined, remote_balance: 10_000_000 },
          { id: 'ta-2', type: undefined, remote_balance: 20_000_000 },
        ],
      });

      await expect(buildHint()).resolves.toBeUndefined();
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'No BTC channel with peer; omitting return hint',
        expect.any(Object)
      );
    });

    it('returns undefined when getChannels fails', async () => {
      mockNodeService.getChannels.mockRejectedValue(new Error('rpc down'));

      await expect(buildHint()).resolves.toBeUndefined();
      // Must not have attempted identity lookup after channel fetch failure.
      expect(mockNodeService.getIdentity).not.toHaveBeenCalled();
    });

    it('returns undefined when getIdentity fails', async () => {
      mockNodeService.getChannels.mockResolvedValue({
        channels: [{ id: 'btc-1', type: 'anchor', remote_balance: 100_000 }],
      });
      mockNodeService.getIdentity.mockRejectedValue(new Error('no identity'));

      await expect(buildHint()).resolves.toBeUndefined();
    });
  });
});
