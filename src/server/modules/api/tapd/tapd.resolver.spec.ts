import { GraphQLError } from 'graphql';
import { TapAssetType, TapBalanceGroupBy } from './tapd.types';

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
  addAssetInvoice: jest.fn(),
  fundAssetChannel: jest.fn(),
  getAccount: jest.fn(),
});

type MockService = ReturnType<typeof mockService>;

const mockLogger = { error: jest.fn(), warn: jest.fn(), info: jest.fn() };

describe('TapdResolver', () => {
  let resolver: TapdResolver;
  let service: MockService;
  const userId = { id: 'test-user-id' } as any;

  beforeEach(() => {
    service = mockService();
    mockLogger.error.mockClear();
    resolver = new TapdResolver(service as never, mockLogger as never);
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

  describe('addTapAssetInvoice', () => {
    it('throws when neither assetId nor groupKey is provided', async () => {
      await expect(
        resolver.addTapAssetInvoice(userId, { assetAmount: '100' })
      ).rejects.toThrow(GraphQLError);
    });

    it('throws when assetAmount is zero', async () => {
      await expect(
        resolver.addTapAssetInvoice(userId, {
          assetAmount: '0',
          assetId: 'asset1',
        })
      ).rejects.toThrow('assetAmount must be a positive number');
    });

    it('throws when assetAmount is negative', async () => {
      await expect(
        resolver.addTapAssetInvoice(userId, {
          assetAmount: '-5',
          assetId: 'asset1',
        })
      ).rejects.toThrow('assetAmount must be a positive number');
    });

    it('throws when assetAmount is not a valid number', async () => {
      await expect(
        resolver.addTapAssetInvoice(userId, {
          assetAmount: 'abc',
          assetId: 'asset1',
        })
      ).rejects.toThrow('assetAmount must be a positive number');
    });

    it('returns invoice response with assetId', async () => {
      service.addAssetInvoice.mockResolvedValue({
        invoiceResult: {
          paymentRequest: 'lntap1...',
          rHash: Buffer.from('aabb', 'hex'),
          addIndex: '42',
          paymentAddr: Buffer.from('ccdd', 'hex'),
        },
        acceptedBuyQuote: {
          assetSpec: {
            id: Buffer.from('ee', 'hex'),
            groupPubKey: null,
          },
          assetMaxAmount: '100',
        },
      });

      const result = await resolver.addTapAssetInvoice(userId, {
        assetAmount: '100',
        assetId: 'asset1',
      });

      expect(result.paymentRequest).toBe('lntap1...');
      expect(result.rHash).toBe('aabb');
      expect(result.addIndex).toBe('42');
      expect(result.paymentAddr).toBe('ccdd');
      expect(result.assetId).toBe('ee');
      expect(result.assetAmount).toBe('100');
    });

    it('returns invoice response with groupKey', async () => {
      service.addAssetInvoice.mockResolvedValue({
        invoiceResult: {
          paymentRequest: 'lntap1...',
          rHash: Buffer.from('1122', 'hex'),
          addIndex: '1',
          paymentAddr: Buffer.from('3344', 'hex'),
        },
        acceptedBuyQuote: {
          assetSpec: {
            id: null,
            groupPubKey: Buffer.from('ff', 'hex'),
          },
          assetMaxAmount: '200',
        },
      });

      const result = await resolver.addTapAssetInvoice(userId, {
        assetAmount: '200',
        groupKey: 'group1',
      });

      expect(result.groupKey).toBe('ff');
      expect(result.assetAmount).toBe('200');
      expect(service.addAssetInvoice).toHaveBeenCalledWith({
        id: userId.id,
        assetId: undefined,
        groupKey: 'group1',
        assetAmount: 200,
        peerPubkey: undefined,
        memo: undefined,
        expiry: undefined,
      });
    });

    it('falls back to empty strings when invoice fields are missing', async () => {
      service.addAssetInvoice.mockResolvedValue({
        invoiceResult: null,
        acceptedBuyQuote: null,
      });

      const result = await resolver.addTapAssetInvoice(userId, {
        assetAmount: '50',
        assetId: 'asset1',
      });

      expect(result.paymentRequest).toBe('');
      expect(result.rHash).toBe('');
      expect(result.addIndex).toBe('0');
      expect(result.paymentAddr).toBe('');
      expect(result.assetAmount).toBe('50');
    });

    it('throws GraphQLError when the service call fails', async () => {
      service.addAssetInvoice.mockRejectedValue(new Error('rpc failed'));
      await expect(
        resolver.addTapAssetInvoice(userId, {
          assetAmount: '100',
          assetId: 'asset1',
        })
      ).rejects.toThrow(GraphQLError);
    });

    it('passes optional peerPubkey, memo, and expiry', async () => {
      service.addAssetInvoice.mockResolvedValue({
        invoiceResult: {
          paymentRequest: 'lntap1...',
          rHash: Buffer.from('aa', 'hex'),
          addIndex: '1',
          paymentAddr: Buffer.from('bb', 'hex'),
        },
        acceptedBuyQuote: { assetSpec: {}, assetMaxAmount: '100' },
      });

      await resolver.addTapAssetInvoice(userId, {
        assetAmount: '100',
        assetId: 'asset1',
        peerPubkey: 'peer1',
        memo: 'test memo',
        expiry: 3600,
      });

      expect(service.addAssetInvoice).toHaveBeenCalledWith({
        id: userId.id,
        assetId: 'asset1',
        groupKey: undefined,
        assetAmount: 100,
        peerPubkey: 'peer1',
        memo: 'test memo',
        expiry: 3600,
      });
    });
  });

  describe('fundTapAssetChannel', () => {
    it('throws when both assetId and groupKey are provided', async () => {
      await expect(
        resolver.fundTapAssetChannel(userId, {
          peerPubkey: 'pubkey',
          assetAmount: '100',
          groupKey: 'group1',
          assetId: 'asset1',
        })
      ).rejects.toThrow(GraphQLError);
    });

    it('throws when neither assetId nor groupKey is provided', async () => {
      await expect(
        resolver.fundTapAssetChannel(userId, {
          peerPubkey: 'pubkey',
          assetAmount: '100',
        })
      ).rejects.toThrow(GraphQLError);
    });

    it('throws when assetAmount is not a valid number', async () => {
      await expect(
        resolver.fundTapAssetChannel(userId, {
          peerPubkey: 'pubkey',
          assetAmount: 'abc',
          groupKey: 'group1',
        })
      ).rejects.toThrow('assetAmount must be a positive number');
    });

    it('funds a channel with groupKey', async () => {
      service.fundAssetChannel.mockResolvedValue({
        txid: 'txid123',
        outputIndex: 0,
      });

      const result = await resolver.fundTapAssetChannel(userId, {
        peerPubkey: 'pubkey',
        assetAmount: '100',
        groupKey: 'group1',
      });

      expect(result).toEqual({ txid: 'txid123', outputIndex: 0 });
    });
  });

  describe('mintTapAsset', () => {
    const baseInput = {
      name: 'TestCoin',
      amount: '1000',
      assetType: TapAssetType.NORMAL,
      grouped: true,
      precision: 0,
    };

    it('returns batchKey as hex', async () => {
      service.mintAsset.mockResolvedValue({
        pendingBatch: { batchKey: Buffer.from('aabb', 'hex') },
      });

      const result = await resolver.mintTapAsset(userId, baseInput);

      expect(result.batchKey).toBe('aabb');
    });

    it('forwards precision as decimalDisplay to the service', async () => {
      service.mintAsset.mockResolvedValue({
        pendingBatch: { batchKey: Buffer.from('aabb', 'hex') },
      });

      await resolver.mintTapAsset(userId, { ...baseInput, precision: 2 });

      expect(service.mintAsset).toHaveBeenCalledWith(
        expect.objectContaining({ decimalDisplay: 2 })
      );
    });

    it('rejects precision above 18', async () => {
      await expect(
        resolver.mintTapAsset(userId, { ...baseInput, precision: 19 })
      ).rejects.toThrow(GraphQLError);
      expect(service.mintAsset).not.toHaveBeenCalled();
    });

    it('rejects negative precision', async () => {
      await expect(
        resolver.mintTapAsset(userId, { ...baseInput, precision: -1 })
      ).rejects.toThrow(GraphQLError);
      expect(service.mintAsset).not.toHaveBeenCalled();
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
      const result = await resolver.burnTapAsset(userId, 'assetId', '10');
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
