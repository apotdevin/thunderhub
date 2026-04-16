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
  TaprootAssetsMutationsResolver,
  TaprootAssetsQueriesResolver,
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

describe('TaprootAssetsQueriesResolver', () => {
  let resolver: TaprootAssetsQueriesResolver;
  let service: MockService;
  const userId = { id: 'test-user-id' } as any;

  beforeEach(() => {
    service = mockService();
    mockLogger.error.mockClear();
    resolver = new TaprootAssetsQueriesResolver(
      service as never,
      mockLogger as never
    );
  });

  describe('get_assets', () => {
    it('returns assets mapped to snake_case', async () => {
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

      const result = await resolver.get_assets(userId);

      expect(result.assets).toHaveLength(1);
      expect(result.assets[0]).toEqual({
        asset_genesis: {
          genesis_point: 'txid:0',
          name: 'TestCoin',
          meta_hash: 'ab',
          asset_id: 'cd',
          asset_type: TapAssetType.NORMAL,
          output_index: 0,
        },
        amount: '1000',
        lock_time: 0,
        relative_lock_time: 0,
        script_version: 0,
        script_key: 'ef',
        is_spent: false,
        is_burn: false,
      });
    });

    it('throws GraphQLError when the service call fails', async () => {
      service.listAssets.mockRejectedValue(new Error('connection failed'));
      await expect(resolver.get_assets(userId)).rejects.toThrow(GraphQLError);
    });
  });

  describe('get_balances', () => {
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

      const result = await resolver.get_balances(
        userId,
        TapBalanceGroupBy.ASSET_ID
      );

      expect(result.balances).toHaveLength(1);
      expect(result.balances[0]).toEqual({
        asset_id: 'abc123',
        group_key: 'aa',
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

      const result = await resolver.get_balances(
        userId,
        TapBalanceGroupBy.GROUP_KEY
      );

      expect(result.balances).toHaveLength(1);
      expect(result.balances[0]).toEqual({
        group_key: groupKeyHex,
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

      const result = await resolver.get_balances(
        userId,
        TapBalanceGroupBy.GROUP_KEY
      );

      expect(result.balances).toHaveLength(1);
      expect(result.balances[0].group_key).toBe(groupKeyHex);
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

      const result = await resolver.get_balances(
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

      const result = await resolver.get_balances(
        userId,
        TapBalanceGroupBy.GROUP_KEY
      );

      expect(result.balances).toHaveLength(1);
      expect(result.balances[0]).toEqual({
        group_key: 'groupkey1',
        names: null,
        balance: '500',
      });
    });
  });

  describe('get_transfers', () => {
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

      const result = await resolver.get_transfers(userId);

      expect(result.transfers).toHaveLength(1);
      expect(result.transfers[0].anchor_tx_hash).toBe('deadbeef');
      expect(result.transfers[0].inputs[0].asset_id).toBe('aa');
      expect(result.transfers[0].outputs[0].asset_id).toBe('bb');
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

      const result = await resolver.get_transfers(userId);
      expect(result.transfers[0].anchor_tx_hash).toBe('');
      expect(result.transfers[0].outputs[0].asset_id).toBe('');
    });
  });

  describe('get_universe_assets', () => {
    it('uses BigInt for total_supply to avoid precision loss', async () => {
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

      const result = await resolver.get_universe_assets(userId);

      expect(result.assets[0].total_supply).toBe('9007199254740993');
    });
  });

  describe('get_federation_servers', () => {
    it('includes node address from account', async () => {
      service.getAccount.mockReturnValue({ socket: 'host:10029' });
      service.listFederationServers.mockResolvedValue({
        servers: [{ host: 'server1', id: 1 }],
      });

      const result = await resolver.get_federation_servers(userId);

      expect(result.node_address).toBe('host:10029');
      expect(result.servers).toHaveLength(1);
    });
  });
});

describe('TaprootAssetsMutationsResolver', () => {
  let resolver: TaprootAssetsMutationsResolver;
  let service: MockService;
  const userId = { id: 'test-user-id' } as any;

  beforeEach(() => {
    service = mockService();
    mockLogger.error.mockClear();
    resolver = new TaprootAssetsMutationsResolver(
      service as never,
      mockLogger as never
    );
  });

  describe('new_address', () => {
    it('throws when both asset_id and group_key are provided', async () => {
      await expect(
        resolver.new_address(userId, 'asset1', 'group1', 100)
      ).rejects.toThrow(GraphQLError);
    });

    it('throws when neither asset_id nor group_key is provided', async () => {
      await expect(
        resolver.new_address(userId, undefined, undefined, 100)
      ).rejects.toThrow(GraphQLError);
    });

    it('creates an address with asset_id', async () => {
      service.newAddr.mockResolvedValue({
        encoded: 'tap1...',
        assetId: Buffer.from('aa', 'hex'),
        amount: '100',
        scriptKey: Buffer.from('bb', 'hex'),
        internalKey: Buffer.from('cc', 'hex'),
        taprootOutputKey: Buffer.from('dd', 'hex'),
      });

      const result = await resolver.new_address(
        userId,
        'asset1',
        undefined,
        100
      );

      expect(result.encoded).toBe('tap1...');
      expect(result.asset_id).toBe('aa');
    });

    it('creates an address with group_key', async () => {
      service.newAddr.mockResolvedValue({
        encoded: 'tap1group...',
        assetId: Buffer.from('aa', 'hex'),
        amount: '200',
        scriptKey: Buffer.from('bb', 'hex'),
        internalKey: Buffer.from('cc', 'hex'),
        taprootOutputKey: Buffer.from('dd', 'hex'),
      });

      const result = await resolver.new_address(
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

  describe('add_asset_invoice', () => {
    it('throws when neither asset_id nor group_key is provided', async () => {
      await expect(
        resolver.add_asset_invoice(userId, { asset_amount: '100' })
      ).rejects.toThrow(GraphQLError);
    });

    it('throws when asset_amount is zero', async () => {
      await expect(
        resolver.add_asset_invoice(userId, {
          asset_amount: '0',
          asset_id: 'asset1',
        })
      ).rejects.toThrow('asset_amount must be a positive number');
    });

    it('throws when asset_amount is negative', async () => {
      await expect(
        resolver.add_asset_invoice(userId, {
          asset_amount: '-5',
          asset_id: 'asset1',
        })
      ).rejects.toThrow('asset_amount must be a positive number');
    });

    it('throws when asset_amount is not a valid number', async () => {
      await expect(
        resolver.add_asset_invoice(userId, {
          asset_amount: 'abc',
          asset_id: 'asset1',
        })
      ).rejects.toThrow('asset_amount must be a positive number');
    });

    it('returns invoice response with asset_id', async () => {
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

      const result = await resolver.add_asset_invoice(userId, {
        asset_amount: '100',
        asset_id: 'asset1',
      });

      expect(result.payment_request).toBe('lntap1...');
      expect(result.r_hash).toBe('aabb');
      expect(result.add_index).toBe('42');
      expect(result.payment_addr).toBe('ccdd');
      expect(result.asset_id).toBe('ee');
      expect(result.asset_amount).toBe('100');
    });

    it('returns invoice response with group_key', async () => {
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

      const result = await resolver.add_asset_invoice(userId, {
        asset_amount: '200',
        group_key: 'group1',
      });

      expect(result.group_key).toBe('ff');
      expect(result.asset_amount).toBe('200');
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

      const result = await resolver.add_asset_invoice(userId, {
        asset_amount: '50',
        asset_id: 'asset1',
      });

      expect(result.payment_request).toBe('');
      expect(result.r_hash).toBe('');
      expect(result.add_index).toBe('0');
      expect(result.payment_addr).toBe('');
      expect(result.asset_amount).toBe('50');
    });

    it('throws GraphQLError when the service call fails', async () => {
      service.addAssetInvoice.mockRejectedValue(new Error('rpc failed'));
      await expect(
        resolver.add_asset_invoice(userId, {
          asset_amount: '100',
          asset_id: 'asset1',
        })
      ).rejects.toThrow(GraphQLError);
    });

    it('passes optional peer_pubkey, memo, and expiry', async () => {
      service.addAssetInvoice.mockResolvedValue({
        invoiceResult: {
          paymentRequest: 'lntap1...',
          rHash: Buffer.from('aa', 'hex'),
          addIndex: '1',
          paymentAddr: Buffer.from('bb', 'hex'),
        },
        acceptedBuyQuote: { assetSpec: {}, assetMaxAmount: '100' },
      });

      await resolver.add_asset_invoice(userId, {
        asset_amount: '100',
        asset_id: 'asset1',
        peer_pubkey: 'peer1',
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

  describe('fund_asset_channel', () => {
    it('throws when both asset_id and group_key are provided', async () => {
      await expect(
        resolver.fund_asset_channel(userId, {
          peer_pubkey: 'pubkey',
          asset_amount: '100',
          group_key: 'group1',
          asset_id: 'asset1',
        })
      ).rejects.toThrow(GraphQLError);
    });

    it('throws when neither asset_id nor group_key is provided', async () => {
      await expect(
        resolver.fund_asset_channel(userId, {
          peer_pubkey: 'pubkey',
          asset_amount: '100',
        })
      ).rejects.toThrow(GraphQLError);
    });

    it('throws when asset_amount is not a valid number', async () => {
      await expect(
        resolver.fund_asset_channel(userId, {
          peer_pubkey: 'pubkey',
          asset_amount: 'abc',
          group_key: 'group1',
        })
      ).rejects.toThrow('asset_amount must be a positive number');
    });

    it('funds a channel with group_key', async () => {
      service.fundAssetChannel.mockResolvedValue({
        txid: 'txid123',
        outputIndex: 0,
      });

      const result = await resolver.fund_asset_channel(userId, {
        peer_pubkey: 'pubkey',
        asset_amount: '100',
        group_key: 'group1',
      });

      expect(result).toEqual({ txid: 'txid123', output_index: 0 });
    });
  });

  describe('mint_asset', () => {
    const baseInput = {
      name: 'TestCoin',
      amount: '1000',
      asset_type: TapAssetType.NORMAL,
      grouped: true,
      precision: 0,
    };

    it('returns batch_key as hex', async () => {
      service.mintAsset.mockResolvedValue({
        pendingBatch: { batchKey: Buffer.from('aabb', 'hex') },
      });

      const result = await resolver.mint_asset(userId, baseInput);

      expect(result.batch_key).toBe('aabb');
    });

    it('forwards precision as decimalDisplay to the service', async () => {
      service.mintAsset.mockResolvedValue({
        pendingBatch: { batchKey: Buffer.from('aabb', 'hex') },
      });

      await resolver.mint_asset(userId, { ...baseInput, precision: 2 });

      expect(service.mintAsset).toHaveBeenCalledWith(
        expect.objectContaining({ decimalDisplay: 2 })
      );
    });

    it('rejects precision above 18', async () => {
      await expect(
        resolver.mint_asset(userId, { ...baseInput, precision: 19 })
      ).rejects.toThrow(GraphQLError);
      expect(service.mintAsset).not.toHaveBeenCalled();
    });

    it('rejects negative precision', async () => {
      await expect(
        resolver.mint_asset(userId, { ...baseInput, precision: -1 })
      ).rejects.toThrow(GraphQLError);
      expect(service.mintAsset).not.toHaveBeenCalled();
    });
  });

  describe('finalize_batch', () => {
    it('returns batch_key as hex', async () => {
      service.finalizeBatch.mockResolvedValue({
        batch: { batchKey: Buffer.from('ccdd', 'hex') },
      });

      const result = await resolver.finalize_batch(userId);
      expect(result.batch_key).toBe('ccdd');
    });
  });

  describe('cancel_batch', () => {
    it('returns true on success', async () => {
      service.cancelBatch.mockResolvedValue({});
      const result = await resolver.cancel_batch(userId);
      expect(result).toBe(true);
    });
  });

  describe('send_asset', () => {
    it('returns true on success', async () => {
      service.sendAsset.mockResolvedValue({});
      const result = await resolver.send_asset(userId, ['tap1...']);
      expect(result).toBe(true);
    });
  });

  describe('burn_asset', () => {
    it('returns true on success', async () => {
      service.burnAsset.mockResolvedValue({});
      const result = await resolver.burn_asset(userId, 'assetId', '10');
      expect(result).toBe(true);
    });
  });

  describe('sync_universe', () => {
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

      const result = await resolver.sync_universe(userId, 'host:10029');
      expect(result.synced_universes).toEqual(['aabb']);
    });

    it('falls back to unknown when assetId is missing', async () => {
      service.syncUniverse.mockResolvedValue({
        syncedUniverses: [{ newAssetRoot: null }],
      });

      const result = await resolver.sync_universe(userId, 'host:10029');
      expect(result.synced_universes).toEqual(['unknown']);
    });
  });
});
