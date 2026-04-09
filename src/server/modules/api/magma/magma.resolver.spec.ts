import {
  TapTransactionType,
  TapOfferSortBy,
  TapOfferSortDir,
} from './magma.types';

jest.mock('../../node/tapd/tapd-node.service', () => ({
  TapdNodeService: jest.fn(),
}));
jest.mock('../../node/node.service', () => ({
  NodeService: jest.fn(),
}));
jest.mock('../amboss/amboss.service', () => ({
  AmbossService: jest.fn(),
  ONE_MONTH_SECONDS: 2592000,
}));
jest.mock('../../security/security.decorators', () => ({
  CurrentUser: () => () => undefined,
}));
jest.mock('../../security/security.types', () => ({}));

import { MagmaResolver } from './magma.resolver';

describe('MagmaResolver', () => {
  const userId = { id: 'test-user-id' } as any;
  const tradeUrl = 'http://trade.example.com/graphql';
  const ambossContext = { ambossAuth: 'token123' };

  const mockFetchService = { graphqlFetchWithProxy: jest.fn() };
  const mockConfigService = { get: jest.fn() };
  const mockLogger = { error: jest.fn(), warn: jest.fn(), info: jest.fn() };

  let resolver: MagmaResolver;

  beforeEach(() => {
    jest.clearAllMocks();
    mockConfigService.get.mockReturnValue(tradeUrl);
    resolver = new MagmaResolver(
      {} as never,
      {} as never,
      mockFetchService as never,
      {} as never,
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

      const result = await resolver.getTapOffers(
        userId,
        ambossContext as never,
        {
          assetId: 'asset123',
          transactionType: TapTransactionType.PURCHASE,
          sortBy: TapOfferSortBy.RATE,
          sortDir: TapOfferSortDir.ASC,
        }
      );

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

      const result = await resolver.getTapOffers(
        userId,
        ambossContext as never,
        {
          assetId: 'asset123',
          transactionType: TapTransactionType.PURCHASE,
        }
      );

      expect(result).toEqual({ list: [], totalCount: 0 });
      expect(mockFetchService.graphqlFetchWithProxy).not.toHaveBeenCalled();
    });

    it('returns empty list and logs error when fetch fails', async () => {
      mockFetchService.graphqlFetchWithProxy.mockResolvedValue({
        data: undefined,
        error: new Error('network error'),
      });

      const result = await resolver.getTapOffers(
        userId,
        ambossContext as never,
        {
          assetId: 'asset123',
          transactionType: TapTransactionType.SALE,
        }
      );

      expect(result).toEqual({ list: [], totalCount: 0 });
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Error fetching trade offers',
        expect.any(Object)
      );
    });

    it('passes authorization header when ambossAuth is present', async () => {
      mockFetchService.graphqlFetchWithProxy.mockResolvedValue({
        data: {
          public: { offers: { list: [], total_count: 0 } },
        },
        error: undefined,
      });

      await resolver.getTapOffers(userId, ambossContext as never, {
        assetId: 'asset123',
        transactionType: TapTransactionType.PURCHASE,
      });

      expect(mockFetchService.graphqlFetchWithProxy).toHaveBeenCalledWith(
        tradeUrl,
        expect.anything(),
        expect.any(Object),
        { authorization: 'Bearer token123' }
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
});
