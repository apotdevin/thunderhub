import {
  TapTransactionType,
  TapOfferSortBy,
  TapOfferSortDir,
} from './magma.types';
import { UserId } from '../../security/security.types';

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

import { MagmaResolver } from './magma.resolver';

describe('MagmaResolver', () => {
  const userId = { id: 'test-user-id' } as UserId;
  const tradeUrl = 'http://trade.example.com/graphql';
  const ambossContext = { ambossAuth: 'token123' };

  const mockFetchService = { graphqlFetchWithProxy: jest.fn() };
  const mockConfigService = { get: jest.fn(), getOrThrow: jest.fn() };
  const mockLogger = { error: jest.fn(), warn: jest.fn(), info: jest.fn() };

  let resolver: MagmaResolver;

  beforeEach(() => {
    jest.clearAllMocks();
    mockConfigService.get.mockReturnValue(tradeUrl);
    resolver = new MagmaResolver(
      {} as never,
      {} as never,
      mockFetchService as never,
      mockConfigService as never,
      mockLogger as never
    );
  });

  describe('getTapOffers', () => {
    it('maps API response to offer list', async () => {
      mockFetchService.graphqlFetchWithProxy.mockResolvedValue({
        data: {
          public: {
            offers: {
              list: [
                {
                  id: 'offer-1',
                  magma_offer_id: 'magma-offer-1',
                  node: { alias: 'alice', pubkey: 'pub1' },
                  rate: { display_amount: '0.001', full_amount: '100000' },
                  available: {
                    display_amount: '500',
                    full_amount: '500000000',
                  },
                },
              ],
              total_count: 1,
            },
          },
        },
        error: undefined,
      });

      const result = await resolver.getTapOffers(userId, {
        assetId: 'asset123',
        transactionType: TapTransactionType.PURCHASE,
        sortBy: TapOfferSortBy.RATE,
        sortDir: TapOfferSortDir.ASC,
      });

      expect(result.totalCount).toBe(1);
      expect(result.list).toHaveLength(1);
      expect(result.list[0]).toEqual({
        id: 'offer-1',
        magmaOfferId: 'magma-offer-1',
        node: { alias: 'alice', pubkey: 'pub1', sockets: [] },
        rate: { displayAmount: '0.001', fullAmount: '100000' },
        available: { displayAmount: '500', fullAmount: '500000000' },
      });
    });

    it('returns empty list when trade URL is not configured', async () => {
      mockConfigService.get.mockReturnValue(undefined);

      const result = await resolver.getTapOffers(userId, {
        assetId: 'asset123',
        transactionType: TapTransactionType.PURCHASE,
      });

      expect(result).toEqual({ list: [], totalCount: 0 });
      expect(mockFetchService.graphqlFetchWithProxy).not.toHaveBeenCalled();
    });

    it('returns empty list and logs error when fetch fails', async () => {
      mockFetchService.graphqlFetchWithProxy.mockResolvedValue({
        data: undefined,
        error: new Error('network error'),
      });

      const result = await resolver.getTapOffers(userId, {
        assetId: 'asset123',
        transactionType: TapTransactionType.SALE,
      });

      expect(result).toEqual({ list: [], totalCount: 0 });
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Error fetching trade offers',
        expect.any(Object)
      );
    });

    it('calls fetch with the trade URL and input variables', async () => {
      mockFetchService.graphqlFetchWithProxy.mockResolvedValue({
        data: {
          public: { offers: { list: [], total_count: 0 } },
        },
        error: undefined,
      });

      await resolver.getTapOffers(userId, {
        assetId: 'asset123',
        transactionType: TapTransactionType.PURCHASE,
      });

      expect(mockFetchService.graphqlFetchWithProxy).toHaveBeenCalledWith(
        tradeUrl,
        expect.anything(),
        expect.objectContaining({
          input: expect.objectContaining({
            asset_id: 'asset123',
            transaction_type: TapTransactionType.PURCHASE,
          }),
        })
      );
    });
  });

  describe('getTapSupportedAssets', () => {
    it('maps API response to supported asset list', async () => {
      mockFetchService.graphqlFetchWithProxy.mockResolvedValue({
        data: {
          public: {
            assets: {
              supported: {
                list: [
                  {
                    id: 'asset-1',
                    symbol: 'USDH',
                    description: 'USD Hyperinflation',
                    precision: 2,
                    taproot_asset_details: {
                      asset_id: 'tapAssetId1',
                      group_key: 'tapGroupKey1',
                    },
                  },
                ],
                total_count: 1,
              },
            },
          },
        },
        error: undefined,
      });

      const result = await resolver.getTapSupportedAssets(
        userId,
        ambossContext as never
      );

      expect(result.totalCount).toBe(1);
      expect(result.list).toHaveLength(1);
      expect(result.list[0]).toEqual({
        id: 'asset-1',
        symbol: 'USDH',
        description: 'USD Hyperinflation',
        precision: 2,
        assetId: 'tapAssetId1',
        groupKey: 'tapGroupKey1',
        prices: null,
      });
    });

    it('returns empty list when trade URL is not configured', async () => {
      mockConfigService.get.mockReturnValue(undefined);

      const result = await resolver.getTapSupportedAssets(
        userId,
        ambossContext as never
      );

      expect(result).toEqual({ list: [], totalCount: 0 });
      expect(mockFetchService.graphqlFetchWithProxy).not.toHaveBeenCalled();
    });

    it('returns empty list and logs error when fetch fails', async () => {
      mockFetchService.graphqlFetchWithProxy.mockResolvedValue({
        data: undefined,
        error: new Error('timeout'),
      });

      const result = await resolver.getTapSupportedAssets(
        userId,
        ambossContext as never
      );

      expect(result).toEqual({ list: [], totalCount: 0 });
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Error fetching supported assets',
        expect.any(Object)
      );
    });

    it('handles assets without taproot_asset_details', async () => {
      mockFetchService.graphqlFetchWithProxy.mockResolvedValue({
        data: {
          public: {
            assets: {
              supported: {
                list: [{ id: 'asset-2', symbol: 'BTC' }],
                total_count: 1,
              },
            },
          },
        },
        error: undefined,
      });

      const result = await resolver.getTapSupportedAssets(
        userId,
        ambossContext as never
      );

      expect(result.list[0]).toEqual({
        id: 'asset-2',
        symbol: 'BTC',
        description: undefined,
        precision: 0,
        assetId: undefined,
        groupKey: undefined,
        prices: null,
      });
    });
  });

  // ── setupTradePartner ──────────────────────────────────────────

  describe('setupTradePartner', () => {
    const swapPubkey = 'ab'.repeat(33);
    const myPubkey = 'cd'.repeat(33);
    const magmaUrl = 'https://magma.test/graphql';

    // assetRate = 1M atomic units per BTC, precision = 0 (1:1 display ↔ atomic)
    // PURCHASE: 100k sats → magmaSize = 100000 * 1000000 / 1e8 = 1000 atomic
    // SALE: 1000 units → magmaSize = 1000 * 1 * 1e8 / 1000000 = 100000 sats
    const assetRate = '1000000';
    const assetPrecision = 0;

    const mockNodeService = {
      getWalletInfo: jest.fn(),
      getNode: jest.fn(),
      addPeer: jest.fn(),
      pay: jest.fn(),
      waitForChannelFromPeer: jest.fn(),
      openChannel: jest.fn(),
    };

    const mockTapdNodeService = {
      fundAssetChannel: jest.fn(),
    };

    let setupResolver: MagmaResolver;

    const magmaOrderResponse = (size = '1000') => ({
      data: {
        market: {
          order: {
            create: {
              id: 'order-1',
              status: 'WAITING',
              size,
              payment: { lightning: { invoice: 'lnbc1invoice' } },
              fees: { buyer: { sats: 500 } },
            },
          },
        },
      },
      error: undefined,
    });

    beforeEach(() => {
      jest.clearAllMocks();

      mockNodeService.getWalletInfo.mockResolvedValue({
        public_key: myPubkey,
      });
      mockNodeService.addPeer.mockResolvedValue(undefined);
      // HODL invoice: pay() never settles; only rejects on immediate failure
      mockNodeService.pay.mockReturnValue(new Promise(() => {}));
      mockNodeService.waitForChannelFromPeer.mockResolvedValue(undefined);
      mockNodeService.openChannel.mockResolvedValue({
        transaction_id: 'btc-txid',
        transaction_vout: 0,
      });

      mockTapdNodeService.fundAssetChannel.mockResolvedValue({
        txid: 'asset-txid',
        outputIndex: 1,
      });

      mockConfigService.getOrThrow.mockImplementation((key: string) => {
        if (key === 'urls.amboss.magma') return magmaUrl;
        return tradeUrl;
      });

      mockFetchService.graphqlFetchWithProxy.mockResolvedValue(
        magmaOrderResponse()
      );

      setupResolver = new MagmaResolver(
        mockTapdNodeService as never,
        mockNodeService as never,
        mockFetchService as never,
        mockConfigService as never,
        mockLogger as never
      );
    });

    const purchaseInput = {
      magmaOfferId: 'offer-1',
      assetId: 'marketplace-asset-1',
      amount: '100000',
      assetRate,
      assetPrecision,
      transactionType: TapTransactionType.PURCHASE,
      swapNodePubkey: swapPubkey,
      swapNodeSockets: ['127.0.0.1:9735'],
    };

    const saleInput = {
      magmaOfferId: 'offer-2',
      assetId: 'marketplace-asset-1',
      amount: '1000',
      assetRate,
      assetPrecision,
      transactionType: TapTransactionType.SALE,
      swapNodePubkey: swapPubkey,
      swapNodeSockets: ['127.0.0.1:9735'],
      tapdAssetId: 'deadbeef'.repeat(8),
    };

    // ── Case 1: no channels — full setup ──

    describe('no existing channels (full setup)', () => {
      it('PURCHASE: buys inbound asset channel via Magma + opens BTC outbound', async () => {
        const result = await setupResolver.setupTradePartner(
          userId,
          ambossContext as never,
          purchaseInput
        );

        // Magma order created with correct size (100k sats → 1000 atomic)
        expect(mockFetchService.graphqlFetchWithProxy).toHaveBeenCalledWith(
          magmaUrl,
          expect.anything(),
          expect.objectContaining({
            input: expect.objectContaining({ size: '1000' }),
          }),
          expect.any(Object)
        );

        // Invoice paid and channel opening detected
        expect(mockNodeService.pay).toHaveBeenCalledWith(userId.id, {
          request: 'lnbc1invoice',
        });
        expect(mockNodeService.waitForChannelFromPeer).toHaveBeenCalledWith(
          userId.id,
          swapPubkey,
          120_000
        );

        // BTC outbound channel opened
        expect(mockNodeService.openChannel).toHaveBeenCalledWith(userId.id, {
          local_tokens: 100000,
          partner_public_key: swapPubkey,
        });

        // Asset channel NOT opened
        expect(mockTapdNodeService.fundAssetChannel).not.toHaveBeenCalled();

        expect(result).toEqual({
          success: true,
          magmaOrderId: 'order-1',
          magmaOrderStatus: 'WAITING',
          magmaOrderAmountAsset: '1000',
          magmaOrderFeeSats: '500',
          outboundChannelTxid: 'btc-txid',
          outboundChannelOutputIndex: 0,
        });
      });

      it('SALE: throws not-implemented error', async () => {
        await expect(
          setupResolver.setupTradePartner(
            userId,
            ambossContext as never,
            saleInput
          )
        ).rejects.toThrow('Selling not implemented yet');
      });

      it('SALE with grouped asset: throws not-implemented error', async () => {
        await expect(
          setupResolver.setupTradePartner(userId, ambossContext as never, {
            ...saleInput,
            tapdAssetId: undefined,
            tapdGroupKey: 'cafebabe'.repeat(8),
          })
        ).rejects.toThrow('Selling not implemented yet');
      });
    });

    // ── Case 2: has outbound, needs inbound only ──

    describe('outbound exists — inbound only (skipOutboundChannel)', () => {
      it('PURCHASE: buys inbound asset channel, skips BTC outbound', async () => {
        const result = await setupResolver.setupTradePartner(
          userId,
          ambossContext as never,
          {
            ...purchaseInput,
            // Client passes atomic amount directly to avoid rounding
            amount: '1000',
            skipOutboundChannel: true,
          }
        );

        // Magma size is the raw amount (no sats conversion)
        expect(mockFetchService.graphqlFetchWithProxy).toHaveBeenCalledWith(
          magmaUrl,
          expect.anything(),
          expect.objectContaining({
            input: expect.objectContaining({ size: '1000' }),
          }),
          expect.any(Object)
        );

        // No outbound channel opened
        expect(mockNodeService.openChannel).not.toHaveBeenCalled();
        expect(mockTapdNodeService.fundAssetChannel).not.toHaveBeenCalled();

        expect(result.outboundChannelTxid).toBeUndefined();
        expect(result.outboundChannelOutputIndex).toBeUndefined();
        expect(result.magmaOrderId).toBe('order-1');
        expect(result.magmaOrderAmountAsset).toBe('1000');
        expect(result.magmaOrderAmountSats).toBeUndefined();
      });

      it('SALE: throws not-implemented error', async () => {
        await expect(
          setupResolver.setupTradePartner(userId, ambossContext as never, {
            ...saleInput,
            skipOutboundChannel: true,
          })
        ).rejects.toThrow('Selling not implemented yet');
      });
    });

    // ── Peer connection ──

    it('connects to peer before creating Magma order', async () => {
      await setupResolver.setupTradePartner(
        userId,
        ambossContext as never,
        purchaseInput
      );

      expect(mockNodeService.addPeer).toHaveBeenCalledWith(
        userId.id,
        swapPubkey,
        '127.0.0.1:9735',
        false
      );
    });

    it('looks up sockets from graph when none provided', async () => {
      mockNodeService.getNode.mockResolvedValue({
        sockets: [{ socket: '10.0.0.1:9735' }],
      });

      await setupResolver.setupTradePartner(userId, ambossContext as never, {
        ...purchaseInput,
        swapNodeSockets: undefined,
      });

      expect(mockNodeService.getNode).toHaveBeenCalledWith(
        userId.id,
        swapPubkey,
        true
      );
      expect(mockNodeService.addPeer).toHaveBeenCalledWith(
        userId.id,
        swapPubkey,
        '10.0.0.1:9735',
        false
      );
    });

    // ── Error cases ──

    it('throws when Magma order creation fails', async () => {
      mockFetchService.graphqlFetchWithProxy.mockResolvedValue({
        data: undefined,
        error: new Error('service unavailable'),
      });

      await expect(
        setupResolver.setupTradePartner(
          userId,
          ambossContext as never,
          purchaseInput
        )
      ).rejects.toThrow('Failed to create Magma channel order');
    });

    it('throws when invoice payment fails immediately', async () => {
      mockNodeService.pay.mockRejectedValue(new Error('insufficient balance'));
      // Channel detection never resolves — pay rejection wins the race
      mockNodeService.waitForChannelFromPeer.mockReturnValue(
        new Promise(() => {})
      );

      await expect(
        setupResolver.setupTradePartner(
          userId,
          ambossContext as never,
          purchaseInput
        )
      ).rejects.toThrow('Failed to pay Magma invoice');
    });

    it('does not open outbound channel when inbound channel never arrives', async () => {
      // waitForChannelFromPeer rejects (timeout) and pay never settles
      mockNodeService.waitForChannelFromPeer.mockRejectedValue(
        new Error('Timed out waiting for channel from peer')
      );

      await expect(
        setupResolver.setupTradePartner(
          userId,
          ambossContext as never,
          purchaseInput
        )
      ).rejects.toThrow('Timed out waiting for channel from peer');

      // Outbound channel must NOT have been opened
      expect(mockNodeService.openChannel).not.toHaveBeenCalled();
      expect(mockTapdNodeService.fundAssetChannel).not.toHaveBeenCalled();
    });

    it('throws when amount is zero', async () => {
      await expect(
        setupResolver.setupTradePartner(userId, ambossContext as never, {
          ...purchaseInput,
          amount: '0',
        })
      ).rejects.toThrow('Amount must be greater than zero');
    });
  });
});
