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
jest.mock('../amboss/amboss-token.service', () => ({
  AmbossTokenService: jest.fn(),
}));
jest.mock('../amboss/amboss.service', () => ({
  AmbossService: jest.fn(),
}));

import {
  MagmaResolver,
  MagmaOrderQueriesResolver,
  MagmaQueriesResolver,
  RailsQueriesResolver,
} from './magma.resolver';

describe('MagmaResolver', () => {
  const userId = { id: 'test-user-id' } as UserId;
  const tradeUrl = 'http://trade.example.com/graphql';

  const mockFetchService = { graphqlFetchWithProxy: jest.fn() };
  const mockLogger = { error: jest.fn(), warn: jest.fn(), info: jest.fn() };
  const mockAmbossTokenService = {
    get: jest.fn().mockResolvedValue('token123'),
    getOrCreate: jest.fn().mockResolvedValue('token123'),
  };
  const mockAmbossService = {
    resolveMagmaUrl: jest.fn(),
    resolveSpaceUrl: jest.fn(),
    resolveAuthUrl: jest.fn(),
    resolveTradeUrl: jest.fn(),
  };
  const mockNodeService = { getWalletInfo: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    mockAmbossTokenService.get.mockResolvedValue('token123');
    mockAmbossTokenService.getOrCreate.mockResolvedValue('token123');
    mockAmbossService.resolveTradeUrl.mockResolvedValue(tradeUrl);
  });

  describe('MagmaQueriesResolver.get_tap_offers', () => {
    let queriesResolver: MagmaQueriesResolver;

    beforeEach(() => {
      queriesResolver = new MagmaQueriesResolver(
        mockFetchService as never,
        mockAmbossService as never,
        mockLogger as never
      );
    });

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
                  min_order: {
                    display_amount: '10',
                    full_amount: '10000000',
                  },
                  max_order: {
                    display_amount: '1000',
                    full_amount: '1000000000',
                  },
                  fees: { base_fee_sats: 1000, fee_rate_ppm: 500 },
                  asset: { id: 'asset123', symbol: 'TST' },
                },
              ],
              total_count: 1,
            },
          },
        },
        error: undefined,
      });

      const result = await queriesResolver.get_tap_offers(userId, {
        ambossAssetId: 'asset123',
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
        minOrder: { displayAmount: '10', fullAmount: '10000000' },
        maxOrder: { displayAmount: '1000', fullAmount: '1000000000' },
        fees: { baseFeeSats: 1000, feeRatePpm: 500 },
        asset: {
          id: 'asset123',
          symbol: 'TST',
          precision: 0,
          assetId: undefined,
          groupKey: undefined,
        },
      });
    });

    it('returns empty list and logs error when fetch fails', async () => {
      mockFetchService.graphqlFetchWithProxy.mockResolvedValue({
        data: undefined,
        error: new Error('network error'),
      });

      const result = await queriesResolver.get_tap_offers(userId, {
        ambossAssetId: 'asset123',
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

      await queriesResolver.get_tap_offers(userId, {
        ambossAssetId: 'asset123',
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

  describe('RailsQueriesResolver.get_tap_supported_assets', () => {
    let railsResolver: RailsQueriesResolver;
    const mockTapFederationService = { syncForAccount: jest.fn() };

    beforeEach(() => {
      railsResolver = new RailsQueriesResolver(
        mockNodeService as never,
        {} as never,
        mockFetchService as never,
        mockTapFederationService as never,
        mockAmbossService as never,
        {} as never,
        mockLogger as never
      );
    });

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

      const result = await railsResolver.get_tap_supported_assets(userId);

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

    it('returns empty list and logs error when fetch fails', async () => {
      mockFetchService.graphqlFetchWithProxy.mockResolvedValue({
        data: undefined,
        error: new Error('timeout'),
      });

      const result = await railsResolver.get_tap_supported_assets(userId);

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

      const result = await railsResolver.get_tap_supported_assets(userId);

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

    // assetRate = 1M atomic units per BTC.
    // PURCHASE: assetAmount 1000 atomic → magmaSize = 1000 atomic (used directly).
    //           satsAmount 100000 → outbound BTC channel size.
    // SALE: assetAmount 1000 atomic → magmaSize = 1000 * 1e8 / 1000000 = 100000 sats.
    const assetRate = '1000000';

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

      mockFetchService.graphqlFetchWithProxy.mockResolvedValue(
        magmaOrderResponse()
      );

      mockAmbossService.resolveMagmaUrl.mockResolvedValue(magmaUrl);
      mockAmbossService.resolveTradeUrl.mockResolvedValue(tradeUrl);
      setupResolver = new MagmaResolver(
        mockTapdNodeService as never,
        mockNodeService as never,
        mockFetchService as never,
        mockAmbossTokenService as never,
        mockAmbossService as never,
        mockLogger as never
      );
    });

    const purchaseInput = {
      magmaOfferId: 'offer-1',
      ambossAssetId: 'marketplace-asset-1',
      assetAmount: '1000',
      satsAmount: '100000',
      assetRate,
      transactionType: TapTransactionType.PURCHASE,
      swapNodePubkey: swapPubkey,
      swapNodeSockets: ['127.0.0.1:9735'],
      tapdAssetId: 'deadbeef'.repeat(8),
    };

    const saleInput = {
      magmaOfferId: 'offer-2',
      ambossAssetId: 'marketplace-asset-1',
      assetAmount: '1000',
      assetRate,
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
          setupResolver.setupTradePartner(userId, saleInput)
        ).rejects.toThrow('Selling not implemented yet');
      });

      it('SALE with grouped asset: throws not-implemented error', async () => {
        await expect(
          setupResolver.setupTradePartner(userId, {
            ...saleInput,
            tapdAssetId: undefined,
            tapdGroupKey: 'cafebabe'.repeat(8),
          })
        ).rejects.toThrow('Selling not implemented yet');
      });
    });

    // ── Case 2: has outbound, needs inbound only ──

    describe('outbound exists — inbound only (no satsAmount)', () => {
      it('PURCHASE: buys inbound asset channel, skips BTC outbound', async () => {
        const result = await setupResolver.setupTradePartner(userId, {
          ...purchaseInput,
          satsAmount: undefined,
        });

        // Magma size is the asset amount from the UI (atomic units, no derivation)
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
          setupResolver.setupTradePartner(userId, {
            ...saleInput,
            satsAmount: undefined,
          })
        ).rejects.toThrow('Selling not implemented yet');
      });
    });

    // ── Peer connection ──

    it('connects to peer before creating Magma order', async () => {
      await setupResolver.setupTradePartner(userId, purchaseInput);

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

      await setupResolver.setupTradePartner(userId, {
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
        setupResolver.setupTradePartner(userId, purchaseInput)
      ).rejects.toThrow('Failed to create Magma channel order');
    });

    it('throws when invoice payment fails immediately', async () => {
      mockNodeService.pay.mockRejectedValue(new Error('insufficient balance'));
      // Channel detection never resolves — pay rejection wins the race
      mockNodeService.waitForChannelFromPeer.mockReturnValue(
        new Promise(() => {})
      );

      await expect(
        setupResolver.setupTradePartner(userId, purchaseInput)
      ).rejects.toThrow('Failed to pay Magma invoice');
    });

    it('does not open outbound channel when inbound channel never arrives', async () => {
      // waitForChannelFromPeer rejects (timeout) and pay never settles
      mockNodeService.waitForChannelFromPeer.mockRejectedValue(
        new Error('Timed out waiting for channel from peer')
      );

      await expect(
        setupResolver.setupTradePartner(userId, purchaseInput)
      ).rejects.toThrow('Timed out waiting for channel from peer');

      // Outbound channel must NOT have been opened
      expect(mockNodeService.openChannel).not.toHaveBeenCalled();
      expect(mockTapdNodeService.fundAssetChannel).not.toHaveBeenCalled();
    });

    it('throws when asset amount is zero', async () => {
      await expect(
        setupResolver.setupTradePartner(userId, {
          ...purchaseInput,
          assetAmount: '0',
        })
      ).rejects.toThrow('Asset amount must be greater than zero');
    });

    it('throws when neither tapdAssetId nor tapdGroupKey is provided', async () => {
      await expect(
        setupResolver.setupTradePartner(userId, {
          ...purchaseInput,
          tapdAssetId: undefined,
          tapdGroupKey: undefined,
        })
      ).rejects.toThrow('Either tapdAssetId or tapdGroupKey must be provided');
    });
  });

  // ── magma.orders.find_many ──────────────────────────────

  describe('MagmaOrderQueriesResolver.find_many', () => {
    const magmaUrl = 'https://magma.test/graphql';
    let ordersResolver: MagmaOrderQueriesResolver;

    const rawOrder = {
      id: 'order-1',
      created_at: '2026-01-01T00:00:00Z',
      status: 'WAITING_FOR_BUYER_PAYMENT',
      payment_status: 'UNPAID',
      source: { pubkey: 'srcpub', alias: 'Alice' },
      destination: { pubkey: 'dstpub', alias: 'Bob' },
      amount: { satoshi: { sats: '100000' } },
      fees: { seller: { sats: 200 }, buyer: { sats: 300 } },
      timeout: '2026-04-21T23:56:42.000Z',
      channel_id: 'chan-1',
    };

    beforeEach(() => {
      mockAmbossService.resolveMagmaUrl.mockResolvedValue(magmaUrl);
      mockNodeService.getWalletInfo.mockResolvedValue({
        public_key: 'dstpub',
      });
      ordersResolver = new MagmaOrderQueriesResolver(
        mockNodeService as never,
        mockFetchService as never,
        mockAmbossTokenService as never,
        mockAmbossService as never,
        mockLogger as never
      );
    });

    it('maps purchases and sales from the API response', async () => {
      mockFetchService.graphqlFetchWithProxy.mockResolvedValue({
        data: {
          user: {
            market: {
              orders: {
                purchases: { total: 1, list: [rawOrder] },
                sales: {
                  total: 1,
                  list: [
                    {
                      ...rawOrder,
                      id: 'order-2',
                      source: { pubkey: 'dstpub', alias: 'Bob' },
                    },
                  ],
                },
              },
            },
          },
        },
        error: undefined,
      });

      const result = await ordersResolver.find_many(userId);

      expect(result).not.toBeNull();
      expect(result!.purchases).toHaveLength(1);
      expect(result!.purchases[0]).toEqual({
        id: 'order-1',
        createdAt: '2026-01-01T00:00:00Z',
        status: 'WAITING_FOR_BUYER_PAYMENT',
        paymentStatus: 'UNPAID',
        source: { pubkey: 'srcpub', alias: 'Alice' },
        destination: { pubkey: 'dstpub', alias: 'Bob' },
        amount: { sats: '100000' },
        fees: { seller: { sats: 200 }, buyer: { sats: 300 } },
        timeout: '2026-04-21T23:56:42.000Z',
        channelId: 'chan-1',
      });
      expect(result!.sales[0].id).toBe('order-2');
      expect(result!.magmaUrl).toBe('https://magma.test');
    });

    it('throws when auth token creation fails', async () => {
      mockAmbossTokenService.getOrCreate.mockRejectedValue(
        new Error('auth failed')
      );

      await expect(ordersResolver.find_many(userId)).rejects.toThrow(
        'auth failed'
      );
      expect(mockFetchService.graphqlFetchWithProxy).not.toHaveBeenCalled();
    });

    it('returns null and logs error when the fetch fails', async () => {
      mockFetchService.graphqlFetchWithProxy.mockResolvedValue({
        data: undefined,
        error: new Error('network error'),
      });

      const result = await ordersResolver.find_many(userId);

      expect(result).toBeNull();
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Error fetching Magma orders',
        expect.any(Object)
      );
    });

    it('returns null when the API response has no orders data', async () => {
      mockFetchService.graphqlFetchWithProxy.mockResolvedValue({
        data: { user: null },
        error: undefined,
      });

      const result = await ordersResolver.find_many(userId);

      expect(result).toBeNull();
    });

    it('handles orders with missing optional fields', async () => {
      const sparse = {
        id: 'order-3',
        created_at: '2026-02-01T00:00:00Z',
        status: 'WAITING_FOR_SELLER_APPROVAL',
        source: {},
        destination: { pubkey: 'dstpub' },
        amount: {},
        fees: {},
      };
      mockFetchService.graphqlFetchWithProxy.mockResolvedValue({
        data: {
          user: {
            market: {
              orders: {
                purchases: { total: 1, list: [sparse] },
                sales: { total: 0, list: [] },
              },
            },
          },
        },
        error: undefined,
      });

      const result = await ordersResolver.find_many(userId);

      expect(result).not.toBeNull();
      expect(result!.purchases[0]).toMatchObject({
        id: 'order-3',
        paymentStatus: undefined,
        channelId: undefined,
        timeout: undefined,
        fees: { seller: undefined, buyer: undefined },
      });
      expect(result!.sales).toHaveLength(0);
    });
  });
});
