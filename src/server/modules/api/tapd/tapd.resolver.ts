import { Args, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { GraphQLError } from 'graphql';
import { v5 as uuidv5 } from 'uuid';
import { TapdNodeService } from '../../node/tapd/tapd-node.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import {
  TapAddress,
  TapAssetList,
  TapAssetType,
  TapBalanceGroupBy,
  TapBalances,
  TapAssetInvoiceInput,
  TapAssetInvoiceResponse,
  TapFederationServerList,
  TapFinalizeBatchResponse,
  TapMintAssetInput,
  TapMintResponse,
  TapFundChannelInput,
  TapFundChannelResponse,
  TapAssetChannelBalance,
  TapSyncResult,
  TapUniverseAssetList,
  TapTransferList,
  TapUniverseInfo,
  TapUniverseStats,
  TapDaemonInfo,
  TaprootAssetsMutations,
  TaprootAssetsQueries,
} from './tapd.types';
import {
  bufToHex,
  buildXCoordToFullKeyMap,
  resolveFullGroupKey,
} from '../../../utils/string';
import { toWithError } from '../../../utils/async';
import { grpcErrorMessage } from '../../../utils/grpcError';
import {
  Asset,
  AssetBalance,
  AssetGroupBalance,
  AssetTransfer,
  GenesisInfo,
  TransferInput,
  TransferOutput,
  SyncedUniverse,
} from '@lightningpolar/tapd-api';

const ASSET_TYPE_MAP: Record<string, TapAssetType> = {
  NORMAL: TapAssetType.NORMAL,
  COLLECTIBLE: TapAssetType.COLLECTIBLE,
};

const mapAssetGenesis = (genesis: GenesisInfo | undefined | null) => {
  if (!genesis) return null;
  return {
    genesis_point: genesis.genesisPoint || '',
    name: genesis.name || '',
    meta_hash: bufToHex(genesis.metaHash) || '',
    asset_id: bufToHex(genesis.assetId) || '',
    asset_type: ASSET_TYPE_MAP[genesis.assetType] ?? TapAssetType.NORMAL,
    output_index: genesis.outputIndex ?? 0,
  };
};

const mapAsset = (asset: Asset) => ({
  asset_genesis: mapAssetGenesis(asset.assetGenesis),
  amount: asset.amount.toString(),
  lock_time: asset.lockTime ?? 0,
  relative_lock_time: asset.relativeLockTime ?? 0,
  script_version: asset.scriptVersion ?? 0,
  script_key: bufToHex(asset.scriptKey) || '',
  is_spent: asset.isSpent ?? false,
  is_burn: asset.isBurn ?? false,
});

// ─── Root resolvers ─────────────────────────────────────────────

@Resolver()
export class TaprootAssetsQueryRoot {
  @Query(() => TaprootAssetsQueries)
  async taproot_assets() {
    return {};
  }
}

@Resolver()
export class TaprootAssetsMutationRoot {
  @Mutation(() => TaprootAssetsMutations)
  async taproot_assets() {
    return {};
  }
}

// ─── Query fields ───────────────────────────────────────────────

@Resolver(() => TaprootAssetsQueries)
export class TaprootAssetsQueriesResolver {
  constructor(
    private tapdNodeService: TapdNodeService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @ResolveField(() => String)
  id(): string {
    return uuidv5(TaprootAssetsQueriesResolver.name, uuidv5.URL);
  }

  @ResolveField(() => TapDaemonInfo)
  async get_info(@CurrentUser() { id }: UserId) {
    const [result, error] = await toWithError(
      this.tapdNodeService.getInfo({ id })
    );
    if (error || !result) {
      this.logger.error('Failed to get tapd info', { error });
      throw new GraphQLError(
        grpcErrorMessage('Failed to get tapd info', error)
      );
    }
    return {
      version: result.version || '',
      lnd_version: result.lndVersion || '',
      network: result.network || '',
      lnd_identity_pubkey: result.lndIdentityPubkey || '',
      node_alias: result.nodeAlias || '',
      block_height: result.blockHeight ?? 0,
      block_hash: result.blockHash || '',
      sync_to_chain: result.syncToChain ?? false,
    };
  }

  @ResolveField(() => TapAssetList)
  async get_assets(@CurrentUser() { id }: UserId) {
    const [result, error] = await toWithError(
      this.tapdNodeService.listAssets({ id })
    );
    if (error || !result) {
      this.logger.error('Failed to list assets', { error });
      throw new GraphQLError(grpcErrorMessage('Failed to list assets', error));
    }
    return { assets: (result.assets || []).map(mapAsset) };
  }

  @ResolveField(() => TapBalances)
  async get_balances(
    @CurrentUser() { id }: UserId,
    @Args('group_by', {
      type: () => TapBalanceGroupBy,
      nullable: true,
      defaultValue: TapBalanceGroupBy.GROUP_KEY,
    })
    group_by?: TapBalanceGroupBy
  ) {
    const mode =
      group_by === TapBalanceGroupBy.ASSET_ID
        ? ('assetId' as const)
        : ('groupKey' as const);

    const [result, error] = await toWithError(
      this.tapdNodeService.listBalances({ id, groupBy: mode })
    );
    if (error || !result) {
      this.logger.error('Failed to list balances', { error });
      throw new GraphQLError(
        grpcErrorMessage('Failed to list balances', error)
      );
    }

    if (mode === 'assetId') {
      const balances = Object.entries(result.assetBalances || {}).map(
        ([key, value]: [string, AssetBalance]) => ({
          asset_id: key,
          group_key: bufToHex(value.groupKey),
          names: [value.assetGenesis.name],
          balance: value.balance.toString(),
        })
      );
      return { balances };
    }

    // groupKey mode: resolve names via a parallel assetId lookup
    const [assetResult] = await toWithError(
      this.tapdNodeService.listBalances({ id, groupBy: 'assetId' })
    );
    const namesByGroupKey = new Map<string, Set<string>>();
    for (const value of Object.values(
      assetResult?.assetBalances || {}
    ) as AssetBalance[]) {
      const gk = bufToHex(value.groupKey);
      if (gk && value.assetGenesis?.name) {
        const existing = namesByGroupKey.get(gk);
        if (existing) {
          existing.add(value.assetGenesis.name);
        } else {
          namesByGroupKey.set(gk, new Set([value.assetGenesis.name]));
        }
      }
    }

    const balances = Object.entries(result.assetGroupBalances || {}).map(
      ([key, value]: [string, AssetGroupBalance]) => {
        const names = [...(namesByGroupKey.get(key) || [])];
        return {
          group_key: key,
          names: names.length > 0 ? names : null,
          balance: value.balance.toString(),
        };
      }
    );
    return { balances };
  }

  @ResolveField(() => TapTransferList)
  async get_transfers(@CurrentUser() { id }: UserId) {
    const [result, error] = await toWithError(
      this.tapdNodeService.listTransfers({ id })
    );
    if (error || !result) {
      this.logger.error('Failed to list transfers', { error });
      throw new GraphQLError(
        grpcErrorMessage('Failed to list transfers', error)
      );
    }
    const transfers = (result.transfers || []).map((t: AssetTransfer) => ({
      anchor_tx_hash: bufToHex(t.anchorTxHash) || '',
      anchor_tx_height_hint: t.anchorTxHeightHint,
      anchor_tx_chain_fees: t.anchorTxChainFees.toString(),
      transfer_timestamp: t.transferTimestamp.toString(),
      label: t.label || '',
      inputs: (t.inputs || []).map((i: TransferInput) => ({
        anchor_point: i.anchorPoint,
        asset_id: bufToHex(i.assetId) || '',
        amount: i.amount.toString(),
      })),
      outputs: (t.outputs || []).map((o: TransferOutput) => ({
        asset_id: bufToHex(o.assetId) || '',
        amount: o.amount.toString(),
        script_key_is_local: o.scriptKeyIsLocal,
        output_type: o.outputType.toString(),
      })),
    }));
    return { transfers };
  }

  @ResolveField(() => TapAddress)
  async decode_address(
    @CurrentUser() { id }: UserId,
    @Args('addr') addr: string
  ) {
    const [result, error] = await toWithError(
      this.tapdNodeService.decodeAddr({ id, addr })
    );
    if (error || !result) {
      this.logger.error('Failed to decode tap address', { error });
      throw new GraphQLError(
        grpcErrorMessage('Failed to decode tap address', error)
      );
    }
    return {
      encoded: result.encoded,
      asset_id: bufToHex(result.assetId) || '',
      group_key: bufToHex(result.groupKey) || null,
      amount: result.amount.toString(),
      asset_type: result.assetType.toString(),
      script_key: bufToHex(result.scriptKey) || '',
      internal_key: bufToHex(result.internalKey) || '',
      taproot_output_key: bufToHex(result.taprootOutputKey) || '',
    };
  }

  @ResolveField(() => TapUniverseAssetList)
  async get_universe_assets(@CurrentUser() { id }: UserId) {
    const [rootsResult, rootsError] = await toWithError(
      this.tapdNodeService.universeAssetRoots({ id })
    );
    if (rootsError || !rootsResult) {
      this.logger.error('Failed to list universe asset roots', {
        error: rootsError,
      });
      throw new GraphQLError(
        grpcErrorMessage('Failed to list universe asset roots', rootsError)
      );
    }

    const [assetsResult, assetsError] = await toWithError(
      this.tapdNodeService.listAssets({ id })
    );
    if (assetsError || !assetsResult) {
      this.logger.error('Failed to list assets for universe lookup', {
        error: assetsError,
      });
      throw new GraphQLError(
        grpcErrorMessage(
          'Failed to list assets for universe lookup',
          assetsError
        )
      );
    }

    const roots = rootsResult.universeRoots || {};

    const xCoordToFullKey = buildXCoordToFullKeyMap(assetsResult.assets || []);

    const assets: {
      name: string | null;
      asset_id: string | null;
      group_key: string | null;
      proof_type: string;
      total_supply: string;
    }[] = [];
    const seen = new Set<string>();

    for (const [key, root] of Object.entries(roots)) {
      const uid = root.id;
      const rawGroupKey = bufToHex(uid.groupKey);
      const keyHex = key.replace(/^(issuance|transfer)-/, '');

      const totalSupply = Object.values(root.amountsByAssetId || {}).reduce(
        (sum: bigint, amt: string) => sum + BigInt(amt || 0),
        BigInt(0)
      );

      const fullGroupKey = resolveFullGroupKey(rawGroupKey, xCoordToFullKey);

      const assetId = keyHex && keyHex.length === 64 ? keyHex : null;

      const dedupeKey = fullGroupKey || rawGroupKey || assetId || '';
      if (!dedupeKey || seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      assets.push({
        name: root.assetName || null,
        asset_id: assetId,
        group_key: fullGroupKey,
        proof_type: uid.proofType || '',
        total_supply: totalSupply.toString(),
      });
    }

    return { assets };
  }

  @ResolveField(() => TapUniverseInfo)
  async get_universe_info(@CurrentUser() { id }: UserId) {
    const [result, error] = await toWithError(
      this.tapdNodeService.universeInfo({ id })
    );
    if (error || !result) {
      this.logger.error('Failed to get universe info', { error });
      throw new GraphQLError(
        grpcErrorMessage('Failed to get universe info', error)
      );
    }
    return { runtime_id: result.runtimeId };
  }

  @ResolveField(() => TapUniverseStats)
  async get_universe_stats(@CurrentUser() { id }: UserId) {
    const [result, error] = await toWithError(
      this.tapdNodeService.universeStats({ id })
    );
    if (error || !result) {
      this.logger.error('Failed to get universe stats', { error });
      throw new GraphQLError(
        grpcErrorMessage('Failed to get universe stats', error)
      );
    }
    return {
      num_total_assets: Number(result.numTotalAssets ?? 0),
      num_total_syncs: Number(result.numTotalSyncs ?? 0),
      num_total_proofs: Number(result.numTotalProofs ?? 0),
      num_total_groups: Number(result.numTotalGroups ?? 0),
    };
  }

  @ResolveField(() => TapFederationServerList)
  async get_federation_servers(@CurrentUser() { id }: UserId) {
    const account = this.tapdNodeService.getAccount(id);
    const [result, error] = await toWithError(
      this.tapdNodeService.listFederationServers({ id })
    );
    if (error || !result) {
      this.logger.error('Failed to list federation servers', { error });
      throw new GraphQLError(
        grpcErrorMessage('Failed to list federation servers', error)
      );
    }
    return {
      node_address: account.socket || null,
      servers: result.servers || [],
    };
  }

  @ResolveField(() => [TapAssetChannelBalance])
  async get_asset_channel_balances(
    @CurrentUser() { id }: UserId,
    @Args('peer_pubkey', { nullable: true }) peer_pubkey?: string
  ) {
    const [result, error] = await toWithError(
      this.tapdNodeService.getAssetChannelBalances({
        id,
        peerPubkey: peer_pubkey,
      })
    );
    if (error || !result) {
      this.logger.error('Failed to get asset channel balances', { error });
      throw new GraphQLError(
        grpcErrorMessage('Failed to get asset channel balances', error)
      );
    }
    return result.map(b => ({
      channel_point: b.channelPoint,
      partner_public_key: b.partnerPublicKey,
      asset_id: b.assetId,
      group_key: b.groupKey || null,
      local_balance: b.localBalance,
      remote_balance: b.remoteBalance,
      capacity: b.capacity,
    }));
  }
}

// ─── Mutation fields ────────────────────────────────────────────

@Resolver(() => TaprootAssetsMutations)
export class TaprootAssetsMutationsResolver {
  constructor(
    private tapdNodeService: TapdNodeService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @ResolveField(() => TapAddress)
  async new_address(
    @CurrentUser() { id }: UserId,
    @Args('asset_id', { nullable: true }) asset_id?: string,
    @Args('group_key', { nullable: true }) group_key?: string,
    @Args('amt', { nullable: true }) amt?: string,
    @Args('proof_courier_addr', { nullable: true })
    proof_courier_addr?: string
  ) {
    if ((!asset_id && !group_key) || (asset_id && group_key)) {
      throw new GraphQLError(
        'Exactly one of asset_id or group_key must be provided'
      );
    }

    const [result, error] = await toWithError(
      this.tapdNodeService.newAddr({
        id,
        assetId: asset_id || undefined,
        groupKey: group_key || undefined,
        amt: amt || '0',
        proofCourierAddr: proof_courier_addr || undefined,
      })
    );
    if (error || !result) {
      this.logger.error('Failed to create tap address', { error });
      throw new GraphQLError(
        grpcErrorMessage('Failed to create tap address', error)
      );
    }
    return {
      encoded: result.encoded,
      asset_id: bufToHex(result.assetId) || '',
      group_key: bufToHex(result.groupKey) || null,
      amount: result.amount.toString(),
      asset_type: result.assetType?.toString() || '',
      script_key: bufToHex(result.scriptKey) || '',
      internal_key: bufToHex(result.internalKey) || '',
      taproot_output_key: bufToHex(result.taprootOutputKey) || '',
    };
  }

  @ResolveField(() => Boolean)
  async send_asset(
    @CurrentUser() { id }: UserId,
    @Args('tap_addrs', { type: () => [String] }) tap_addrs: string[]
  ) {
    const [, error] = await toWithError(
      this.tapdNodeService.sendAsset({ id, tapAddrs: tap_addrs })
    );
    if (error) {
      this.logger.error('Failed to send asset', { error });
      throw new GraphQLError(grpcErrorMessage('Failed to send asset', error));
    }
    return true;
  }

  @ResolveField(() => Boolean)
  async burn_asset(
    @CurrentUser() { id }: UserId,
    @Args('asset_id') asset_id: string,
    @Args('amount') amount: string
  ) {
    const [, error] = await toWithError(
      this.tapdNodeService.burnAsset({
        id,
        assetId: asset_id,
        amountToBurn: amount,
      })
    );
    if (error) {
      this.logger.error('Failed to burn asset', { error });
      throw new GraphQLError(grpcErrorMessage('Failed to burn asset', error));
    }
    return true;
  }

  @ResolveField(() => TapMintResponse)
  async mint_asset(
    @CurrentUser() { id }: UserId,
    @Args('input') input: TapMintAssetInput
  ) {
    const { name, amount, asset_type, grouped, group_key, precision } = input;

    if (!Number.isInteger(precision) || precision < 0 || precision > 18) {
      throw new GraphQLError('precision must be an integer between 0 and 18');
    }

    const typeStr =
      asset_type === TapAssetType.NORMAL ? 'NORMAL' : 'COLLECTIBLE';
    const [result, error] = await toWithError(
      this.tapdNodeService.mintAsset({
        id,
        name,
        amount,
        assetType: typeStr,
        grouped,
        groupKey: group_key,
        decimalDisplay: precision,
      })
    );
    if (error || !result) {
      this.logger.error('Failed to mint asset', { error });
      throw new GraphQLError(grpcErrorMessage('Failed to mint asset', error));
    }
    return {
      batch_key: bufToHex(result.pendingBatch.batchKey),
    };
  }

  @ResolveField(() => TapFinalizeBatchResponse)
  async finalize_batch(@CurrentUser() { id }: UserId) {
    const [result, error] = await toWithError(
      this.tapdNodeService.finalizeBatch({ id })
    );
    if (error || !result) {
      this.logger.error('Failed to finalize batch', { error });
      throw new GraphQLError(
        grpcErrorMessage('Failed to finalize batch', error)
      );
    }
    return {
      batch_key: bufToHex(result.batch.batchKey),
    };
  }

  @ResolveField(() => Boolean)
  async cancel_batch(@CurrentUser() { id }: UserId) {
    const [, error] = await toWithError(
      this.tapdNodeService.cancelBatch({ id })
    );
    if (error) {
      this.logger.error('Failed to cancel batch', { error });
      throw new GraphQLError(grpcErrorMessage('Failed to cancel batch', error));
    }
    return true;
  }

  @ResolveField(() => Boolean)
  async add_federation_server(
    @CurrentUser() { id }: UserId,
    @Args('host') host: string
  ) {
    const [, error] = await toWithError(
      this.tapdNodeService.addFederationServer({ id, host })
    );
    if (error) {
      this.logger.error('Failed to add federation server', { error });
      throw new GraphQLError(
        grpcErrorMessage('Failed to add federation server', error)
      );
    }
    return true;
  }

  @ResolveField(() => Boolean)
  async remove_federation_server(
    @CurrentUser() { id }: UserId,
    @Args('host') host: string
  ) {
    const [, error] = await toWithError(
      this.tapdNodeService.deleteFederationServer({ id, host })
    );
    if (error) {
      this.logger.error('Failed to remove federation server', { error });
      throw new GraphQLError(
        grpcErrorMessage('Failed to remove federation server', error)
      );
    }
    return true;
  }

  @ResolveField(() => TapSyncResult)
  async sync_universe(
    @CurrentUser() { id }: UserId,
    @Args('host') host: string
  ) {
    const [result, error] = await toWithError(
      this.tapdNodeService.syncUniverse({ id, host })
    );
    if (error || !result) {
      this.logger.error('Failed to sync universe', { error });
      throw new GraphQLError(
        grpcErrorMessage('Failed to sync universe', error)
      );
    }
    const synced_universes = (result.syncedUniverses || []).map(
      (u: SyncedUniverse) => bufToHex(u.newAssetRoot?.id?.assetId) || 'unknown'
    );
    return { synced_universes };
  }

  @ResolveField(() => TapAssetInvoiceResponse)
  async add_asset_invoice(
    @CurrentUser() { id }: UserId,
    @Args('input') input: TapAssetInvoiceInput
  ) {
    const { asset_amount, asset_id, group_key, peer_pubkey, memo, expiry } =
      input;

    if (!asset_id && !group_key) {
      throw new GraphQLError(
        'At least one of asset_id or group_key must be provided'
      );
    }

    if (
      !asset_amount ||
      isNaN(Number(asset_amount)) ||
      Number(asset_amount) <= 0
    ) {
      throw new GraphQLError('asset_amount must be a positive numeric string');
    }

    const [result, error] = await toWithError(
      this.tapdNodeService.addAssetInvoice({
        id,
        assetId: asset_id || undefined,
        groupKey: group_key || undefined,
        assetAmount: asset_amount,
        peerPubkey: peer_pubkey || undefined,
        memo: memo || undefined,
        expiry: expiry || undefined,
      })
    );
    if (error || !result) {
      this.logger.error('Failed to create asset invoice', { error });
      throw new GraphQLError(
        grpcErrorMessage('Failed to create asset invoice', error)
      );
    }

    const invoiceResult = result.invoiceResult;
    const quote = result.acceptedBuyQuote;

    return {
      payment_request: invoiceResult?.paymentRequest || '',
      r_hash: invoiceResult?.rHash
        ? Buffer.from(invoiceResult.rHash).toString('hex')
        : '',
      add_index: invoiceResult?.addIndex || '0',
      payment_addr: invoiceResult?.paymentAddr
        ? Buffer.from(invoiceResult.paymentAddr).toString('hex')
        : '',
      asset_id: bufToHex(quote?.assetSpec?.id),
      group_key: bufToHex(quote?.assetSpec?.groupPubKey),
      asset_amount: quote?.assetMaxAmount || asset_amount,
    };
  }

  @ResolveField(() => TapFundChannelResponse)
  async fund_asset_channel(
    @CurrentUser() { id }: UserId,
    @Args('input') input: TapFundChannelInput
  ) {
    const {
      peer_pubkey,
      asset_amount,
      group_key,
      asset_id,
      fee_rate_sat_per_vbyte,
      push_sat,
    } = input;

    if ((!asset_id && !group_key) || (asset_id && group_key)) {
      throw new GraphQLError(
        'Exactly one of asset_id or group_key must be provided'
      );
    }

    if (
      !asset_amount ||
      isNaN(Number(asset_amount)) ||
      Number(asset_amount) <= 0
    ) {
      throw new GraphQLError('asset_amount must be a positive numeric string');
    }

    const [result, error] = await toWithError(
      this.tapdNodeService.fundAssetChannel({
        id,
        peerPubkey: peer_pubkey,
        assetAmount: asset_amount,
        groupKey: group_key || undefined,
        assetId: asset_id || undefined,
        feeRateSatPerVbyte: fee_rate_sat_per_vbyte || undefined,
        pushSat: push_sat || undefined,
      })
    );
    if (error || !result) {
      this.logger.error('Failed to fund asset channel', { error });
      throw new GraphQLError(
        grpcErrorMessage('Failed to fund asset channel', error)
      );
    }
    return {
      txid: result.txid,
      output_index: result.outputIndex,
    };
  }
}
