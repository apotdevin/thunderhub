import { GraphQLError } from 'graphql';
import {
  TapAssetType,
  TapBalanceGroupBy,
  TapTransactionType,
  TapOfferSortBy,
  TapOfferSortDir,
} from './tapd.types';

// Mock the entire dependency chain to avoid transitive import resolution
jest.mock('../../node/tapd/tapd-node.service', () => ({
  TapdNodeService: jest.fn(),
}));
jest.mock('../../security/security.decorators', () => ({
  CurrentUser: () => () => undefined,
}));
jest.mock('../../security/security.types', () => ({}));

// Now safe to import the resolvers
import {
  TapdResolver,
  TapAssetGenesisResolver,
  TapAssetResolver,
} from './tapd.resolver';

const mockService = () => ({
  listAssets: jest.fn(),
  listBalances: jest.fn(),
  listTransfers: jest.fn(),
  newAddr: jest.fn(),
  decodeAddr: jest.fn(),
  sendAsset: jest.fn(),
  burnAsset: jest.fn(),
  mintAsset: jest.fn(),
  finalizeBatch: jest.fn(),
  cancelBatch: jest.fn(),
  universeAssetRoots: jest.fn(),
  universeInfo: jest.fn(),
  universeStats: jest.fn(),
  listFederationServers: jest.fn(),
  addFederationServer: jest.fn(),
  deleteFederationServer: jest.fn(),
  syncUniverse: jest.fn(),
  fundAssetChannel: jest.fn(),
  getAccount: jest.fn(),
});

type MockService = ReturnType<typeof mockService>;

const mockLogger = { error: jest.fn(), warn: jest.fn(), info: jest.fn() };

describe('TapdResolver', () => {
  let resolver: TapdResolver;
  let service: MockService;
  const userId = { id: 'test-user-id' };

  beforeEach(() => {
    service = mockService();
    mockLogger.error.mockClear();
    resolver = new TapdResolver(
      service as never,
      {} as never,
      {} as never,
      mockLogger as never
    );
  });

  describe('getTapAssets', () => {
    it('returns raw assets from the service', async () => {
      const rawAsset = {
        assetGenesis: {
          genesisPoint: 'txid:0',
          name: 'TestCoin',
          metaHash: Buffer.from('ab', 'hex'),
          assetId: Buffer.from('cd', 'hex'),
          assetType: 'NORMAL',
          outputIndex: 0,
        },
        amount: '1000',
        lockTime: 0,
        relativeLockTime: 0,
        scriptVersion: 0,
        scriptKey: Buffer.from('ef', 'hex'),
        isSpent: false,
        isBurn: false,
      };
      service.listAssets.mockResolvedValue({ assets: [rawAsset] });

      const result = await resolver.getTapAssets(userId);

      expect(result.assets).toHaveLength(1);
      expect(result.assets[0]).toBe(rawAsset);
    });

    it('throws GraphQLError when the service call fails', async () => {
      service.listAssets.mockRejectedValue(new Error('connection failed'));
      await expect(resolver.getTapAssets(userId)).rejects.toThrow(GraphQLError);
    });
  });

  describe('getTapBalances', () => {
    it('returns balances grouped by assetId', async () => {
      service.listBalances.mockResolvedValue({
        assetBalances: {
          abc123: {
            groupKey: Buffer.from('aa', 'hex'),
            assetGenesis: { name: 'TestCoin' },
            balance: '500',
          },
        },
      });

      const result = await resolver.getTapBalances(
        userId,
        TapBalanceGroupBy.ASSET_ID
      );

      expect(result.balances).toHaveLength(1);
      expect(result.balances[0]).toEqual({
        assetId: 'abc123',
        groupKey: 'aa',
        names: ['TestCoin'],
        balance: '500',
      });
    });

    it('returns balances grouped by groupKey with resolved names', async () => {
      const groupKeyHex = '02' + 'ab'.repeat(32);

      service.listBalances
        .mockResolvedValueOnce({
          assetGroupBalances: {
            [groupKeyHex]: {
              groupKey: Buffer.alloc(0),
              balance: '1000',
            },
          },
        })
        .mockResolvedValueOnce({
          assetBalances: {
            asset1: {
              groupKey: Buffer.from(groupKeyHex, 'hex'),
              assetGenesis: { name: 'TestCoin' },
              balance: '1000',
            },
          },
        });

      const result = await resolver.getTapBalances(
        userId,
        TapBalanceGroupBy.GROUP_KEY
      );

      expect(result.balances).toHaveLength(1);
      expect(result.balances[0]).toEqual({
        groupKey: groupKeyHex,
        names: ['TestCoin'],
        balance: '1000',
      });
    });

    it('collects multiple names for a grouped asset with different mints', async () => {
      const groupKeyHex = '02' + 'cd'.repeat(32);

      service.listBalances
        .mockResolvedValueOnce({
          assetGroupBalances: {
            [groupKeyHex]: {
              groupKey: Buffer.alloc(0),
              balance: '3000',
            },
          },
        })
        .mockResolvedValueOnce({
          assetBalances: {
            mint1: {
              groupKey: Buffer.from(groupKeyHex, 'hex'),
              assetGenesis: { name: 'AlphaToken' },
              balance: '1000',
            },
            mint2: {
              groupKey: Buffer.from(groupKeyHex, 'hex'),
              assetGenesis: { name: 'BetaToken' },
              balance: '2000',
            },
          },
        });

      const result = await resolver.getTapBalances(
        userId,
        TapBalanceGroupBy.GROUP_KEY
      );

      expect(result.balances).toHaveLength(1);
      expect(result.balances[0].groupKey).toBe(groupKeyHex);
      expect(result.balances[0].balance).toBe('3000');
      expect(result.balances[0].names).toHaveLength(2);
      expect(result.balances[0].names).toContain('AlphaToken');
      expect(result.balances[0].names).toContain('BetaToken');
    });

    it('deduplicates identical names across mints', async () => {
      const groupKeyHex = '02' + 'ef'.repeat(32);

      service.listBalances
        .mockResolvedValueOnce({
          assetGroupBalances: {
            [groupKeyHex]: {
              groupKey: Buffer.alloc(0),
              balance: '2000',
            },
          },
        })
        .mockResolvedValueOnce({
          assetBalances: {
            mint1: {
              groupKey: Buffer.from(groupKeyHex, 'hex'),
              assetGenesis: { name: 'SameName' },
              balance: '1000',
            },
            mint2: {
              groupKey: Buffer.from(groupKeyHex, 'hex'),
              assetGenesis: { name: 'SameName' },
              balance: '1000',
            },
          },
        });

      const result = await resolver.getTapBalances(
        userId,
        TapBalanceGroupBy.GROUP_KEY
      );

      expect(result.balances).toHaveLength(1);
      expect(result.balances[0].names).toEqual(['SameName']);
    });

    it('returns null name when assetId lookup fails', async () => {
      service.listBalances
        .mockResolvedValueOnce({
          assetGroupBalances: {
            groupkey1: { groupKey: Buffer.alloc(0), balance: '500' },
          },
        })
        .mockRejectedValueOnce(new Error('lookup failed'));

      const result = await resolver.getTapBalances(
        userId,
        TapBalanceGroupBy.GROUP_KEY
      );

      expect(result.balances).toHaveLength(1);
      expect(result.balances[0]).toEqual({
        groupKey: 'groupkey1',
        names: null,
        balance: '500',
      });
    });
  });

  describe('getTapTransfers', () => {
    it('serializes transfers with nested inputs and outputs', async () => {
      service.listTransfers.mockResolvedValue({
        transfers: [
          {
            anchorTxHash: Buffer.from('deadbeef', 'hex'),
            anchorTxHeightHint: 100,
            anchorTxChainFees: '250',
            transferTimestamp: '1700000000',
            label: 'test',
            inputs: [
              {
                anchorPoint: 'txid:0',
                assetId: Buffer.from('aa', 'hex'),
                amount: '100',
              },
            ],
            outputs: [
              {
                assetId: Buffer.from('bb', 'hex'),
                amount: '50',
                scriptKeyIsLocal: true,
                outputType: 'SIMPLE',
              },
            ],
          },
        ],
      });

      const result = await resolver.getTapTransfers(userId);

      expect(result.transfers).toHaveLength(1);
      expect(result.transfers[0].anchorTxHash).toBe('deadbeef');
      expect(result.transfers[0].inputs[0].assetId).toBe('aa');
      expect(result.transfers[0].outputs[0].assetId).toBe('bb');
    });

    it('falls back to empty string when bufToHex returns undefined', async () => {
      service.listTransfers.mockResolvedValue({
        transfers: [
          {
            anchorTxHash: null,
            anchorTxHeightHint: 0,
            anchorTxChainFees: '0',
            transferTimestamp: '0',
            label: '',
            inputs: [],
            outputs: [
              {
                assetId: null,
                amount: '0',
                scriptKeyIsLocal: false,
                outputType: 'SIMPLE',
              },
            ],
          },
        ],
      });

      const result = await resolver.getTapTransfers(userId);
      expect(result.transfers[0].anchorTxHash).toBe('');
      expect(result.transfers[0].outputs[0].assetId).toBe('');
    });
  });

  describe('newTapAddress', () => {
    it('throws when both assetId and groupKey are provided', async () => {
      await expect(
        resolver.newTapAddress(userId, 'asset1', 'group1', 100)
      ).rejects.toThrow(GraphQLError);
    });

    it('throws when neither assetId nor groupKey is provided', async () => {
      await expect(
        resolver.newTapAddress(userId, undefined, undefined, 100)
      ).rejects.toThrow(GraphQLError);
    });

    it('creates an address with assetId', async () => {
      service.newAddr.mockResolvedValue({
        encoded: 'tap1...',
        assetId: Buffer.from('aa', 'hex'),
        amount: '100',
        scriptKey: Buffer.from('bb', 'hex'),
        internalKey: Buffer.from('cc', 'hex'),
        taprootOutputKey: Buffer.from('dd', 'hex'),
      });

      const result = await resolver.newTapAddress(
        userId,
        'asset1',
        undefined,
        100
      );

      expect(result.encoded).toBe('tap1...');
      expect(result.assetId).toBe('aa');
    });

    it('creates an address with groupKey', async () => {
      service.newAddr.mockResolvedValue({
        encoded: 'tap1group...',
        assetId: Buffer.from('aa', 'hex'),
        amount: '200',
        scriptKey: Buffer.from('bb', 'hex'),
        internalKey: Buffer.from('cc', 'hex'),
        taprootOutputKey: Buffer.from('dd', 'hex'),
      });

      const result = await resolver.newTapAddress(
        userId,
        undefined,
        'group1',
        200
      );

      expect(result.encoded).toBe('tap1group...');
      expect(result.amount).toBe('200');
      expect(service.newAddr).toHaveBeenCalledWith({
        id: userId.id,
        groupKey: 'group1',
        assetId: undefined,
        amt: 200,
      });
    });
  });

  describe('fundTapAssetChannel', () => {
    it('throws when both assetId and groupKey are provided', async () => {
      await expect(
        resolver.fundTapAssetChannel(userId, 'pubkey', 100, 'group1', 'asset1')
      ).rejects.toThrow(GraphQLError);
    });

    it('throws when neither assetId nor groupKey is provided', async () => {
      await expect(
        resolver.fundTapAssetChannel(userId, 'pubkey', 100)
      ).rejects.toThrow(GraphQLError);
    });

    it('funds a channel with groupKey', async () => {
      service.fundAssetChannel.mockResolvedValue({
        txid: 'txid123',
        outputIndex: 0,
      });

      const result = await resolver.fundTapAssetChannel(
        userId,
        'pubkey',
        100,
        'group1'
      );

      expect(result).toEqual({ txid: 'txid123', outputIndex: 0 });
    });
  });

  describe('mintTapAsset', () => {
    it('returns batchKey as hex', async () => {
      service.mintAsset.mockResolvedValue({
        pendingBatch: { batchKey: Buffer.from('aabb', 'hex') },
      });

      const result = await resolver.mintTapAsset(
        userId,
        'TestCoin',
        1000,
        TapAssetType.NORMAL,
        true
      );

      expect(result.batchKey).toBe('aabb');
    });
  });

  describe('finalizeTapBatch', () => {
    it('returns batchKey as hex', async () => {
      service.finalizeBatch.mockResolvedValue({
        batch: { batchKey: Buffer.from('ccdd', 'hex') },
      });

      const result = await resolver.finalizeTapBatch(userId);
      expect(result.batchKey).toBe('ccdd');
    });
  });

  describe('cancelTapBatch', () => {
    it('returns true on success', async () => {
      service.cancelBatch.mockResolvedValue({});
      const result = await resolver.cancelTapBatch(userId);
      expect(result).toBe(true);
    });
  });

  describe('sendTapAsset', () => {
    it('returns true on success', async () => {
      service.sendAsset.mockResolvedValue({});
      const result = await resolver.sendTapAsset(userId, ['tap1...']);
      expect(result).toBe(true);
    });
  });

  describe('burnTapAsset', () => {
    it('returns true on success', async () => {
      service.burnAsset.mockResolvedValue({});
      const result = await resolver.burnTapAsset(userId, 'assetId', 10);
      expect(result).toBe(true);
    });
  });

  describe('getTapUniverseAssets', () => {
    it('uses BigInt for totalSupply to avoid precision loss', async () => {
      const assetId =
        'abc123abc123abc123abc123abc123abc123abc123abc123abc123abc123abc1';
      service.universeAssetRoots.mockResolvedValue({
        universeRoots: {
          [assetId]: {
            id: { proofType: 'PROOF_TYPE_ISSUANCE' },
            assetName: 'BigAsset',
            amountsByAssetId: {
              id1: '9007199254740993',
            },
          },
        },
      });
      service.listAssets.mockResolvedValue({ assets: [] });

      const result = await resolver.getTapUniverseAssets(userId);

      expect(result.assets[0].totalSupply).toBe('9007199254740993');
    });
  });

  describe('syncTapUniverse', () => {
    it('returns synced universe identifiers', async () => {
      service.syncUniverse.mockResolvedValue({
        syncedUniverses: [
          {
            newAssetRoot: {
              id: { assetId: Buffer.from('aabb', 'hex') },
            },
          },
        ],
      });

      const result = await resolver.syncTapUniverse(userId, 'host:10029');
      expect(result.syncedUniverses).toEqual(['aabb']);
    });

    it('falls back to unknown when assetId is missing', async () => {
      service.syncUniverse.mockResolvedValue({
        syncedUniverses: [{ newAssetRoot: null }],
      });

      const result = await resolver.syncTapUniverse(userId, 'host:10029');
      expect(result.syncedUniverses).toEqual(['unknown']);
    });
  });

  describe('getTapFederationServers', () => {
    it('includes node address from account', async () => {
      service.getAccount.mockReturnValue({ socket: 'host:10029' });
      service.listFederationServers.mockResolvedValue({
        servers: [{ host: 'server1', id: 1 }],
      });

      const result = await resolver.getTapFederationServers(userId);

      expect(result.nodeAddress).toBe('host:10029');
      expect(result.servers).toHaveLength(1);
    });
  });
});

describe('TapdResolver trading queries', () => {
  const userId = { id: 'test-user-id' };
  const tradeUrl = 'http://trade.example.com/graphql';
  const ambossContext = { ambossAuth: 'token123' };

  const mockFetchService = { graphqlFetchWithProxy: jest.fn() };
  const mockConfigService = { get: jest.fn() };
  const mockLogger = { error: jest.fn(), warn: jest.fn(), info: jest.fn() };

  let resolver: TapdResolver;

  beforeEach(() => {
    jest.clearAllMocks();
    mockConfigService.get.mockReturnValue(tradeUrl);
    resolver = new TapdResolver(
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
        'asset123',
        TapTransactionType.PURCHASE,
        TapOfferSortBy.RATE,
        TapOfferSortDir.ASC
      );

      expect(result.totalCount).toBe(1);
      expect(result.list).toHaveLength(1);
      expect(result.list[0]).toEqual({
        id: 'offer-1',
        node: { alias: 'alice', pubkey: 'pub1' },
        rate: { displayAmount: '0.001', fullAmount: '100000' },
        available: { displayAmount: '500', fullAmount: '500000000' },
      });
    });

    it('returns empty list when trade URL is not configured', async () => {
      mockConfigService.get.mockReturnValue(undefined);

      const result = await resolver.getTapOffers(
        userId,
        ambossContext as never,
        'asset123',
        TapTransactionType.PURCHASE
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
        'asset123',
        TapTransactionType.SALE
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

      await resolver.getTapOffers(
        userId,
        ambossContext as never,
        'asset123',
        TapTransactionType.PURCHASE
      );

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
        precision: undefined,
        assetId: undefined,
        groupKey: undefined,
      });
    });
  });
});

describe('TapAssetGenesisResolver', () => {
  const genesisResolver = new TapAssetGenesisResolver();

  it('converts metaHash buffer to hex', () => {
    const genesis = { metaHash: Buffer.from('ab', 'hex') } as never;
    expect(genesisResolver.metaHash(genesis)).toBe('ab');
  });

  it('converts assetId buffer to hex', () => {
    const genesis = { assetId: Buffer.from('cd', 'hex') } as never;
    expect(genesisResolver.assetId(genesis)).toBe('cd');
  });

  it('maps assetType string to enum', () => {
    const genesis = { assetType: 'COLLECTIBLE' } as never;
    expect(genesisResolver.assetType(genesis)).toBe(TapAssetType.COLLECTIBLE);
  });

  it('defaults unknown assetType to NORMAL', () => {
    const genesis = { assetType: 'UNKNOWN' } as never;
    expect(genesisResolver.assetType(genesis)).toBe(TapAssetType.NORMAL);
  });
});

describe('TapAssetResolver', () => {
  const assetResolver = new TapAssetResolver();

  it('converts amount to string', () => {
    const asset = { amount: '1000' } as never;
    expect(assetResolver.amount(asset)).toBe('1000');
  });

  it('converts scriptKey buffer to hex', () => {
    const asset = { scriptKey: Buffer.from('ef', 'hex') } as never;
    expect(assetResolver.scriptKey(asset)).toBe('ef');
  });
});
