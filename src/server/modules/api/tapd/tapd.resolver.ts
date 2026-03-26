import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { GraphQLError } from 'graphql';
import { ContextType } from '../../../app.module';
import { TapdNodeService } from '../../node/tapd/tapd-node.service';
import { FetchService } from '../../fetch/fetch.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import {
  TapAddress,
  TapAsset,
  TapAssetGenesis,
  TapAssetList,
  TapAssetType,
  TapBalanceGroupBy,
  TapBalances,
  TapFederationServerList,
  TapFinalizeBatchResponse,
  TapMintResponse,
  TapFundChannelResponse,
  TapSyncResult,
  TapTradeOfferList,
  TapUniverseAssetList,
  TapTransferList,
  TapUniverseInfo,
  TapSupportedAssetList,
  TapUniverseStats,
  TapTransactionType,
  TapOfferSortBy,
  TapOfferSortDir,
} from './tapd.types';
import {
  bufToHex,
  buildXCoordToFullKeyMap,
  resolveFullGroupKey,
} from '../../../utils/string';
import { toWithError } from '../../../utils/async';
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
import { getOffersQuery, getSupportedAssetsQuery } from './tapd.gql';

// Internal shapes matching the trade API GraphQL responses

interface TradeApiOffer {
  id: string;
  node?: { alias?: string; pubkey?: string };
  rate?: { display_amount?: string; full_amount?: string };
  available?: { display_amount?: string; full_amount?: string };
}

interface TradeApiSupportedAsset {
  id: string;
  symbol?: string;
  description?: string;
  precision?: number;
  taproot_asset_details?: { asset_id?: string; group_key?: string };
}

const ASSET_TYPE_MAP: Record<string, TapAssetType> = {
  NORMAL: TapAssetType.NORMAL,
  COLLECTIBLE: TapAssetType.COLLECTIBLE,
};

@Resolver(() => TapAssetGenesis)
export class TapAssetGenesisResolver {
  @ResolveField(() => String)
  metaHash(@Parent() genesis: GenesisInfo): string {
    return bufToHex(genesis.metaHash) || '';
  }

  @ResolveField(() => String)
  assetId(@Parent() genesis: GenesisInfo): string {
    return bufToHex(genesis.assetId) || '';
  }

  @ResolveField(() => TapAssetType)
  assetType(@Parent() genesis: GenesisInfo): TapAssetType {
    return ASSET_TYPE_MAP[genesis.assetType] ?? TapAssetType.NORMAL;
  }
}

@Resolver(TapAsset)
export class TapAssetResolver {
  @ResolveField()
  amount(@Parent() asset: Asset): string {
    return asset.amount.toString();
  }

  @ResolveField()
  scriptKey(@Parent() asset: Asset): string {
    return bufToHex(asset.scriptKey);
  }
}

@Resolver()
export class TapdResolver {
  constructor(
    private tapdNodeService: TapdNodeService,
    private fetchService: FetchService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  // ── Assets ──

  @Query(() => TapAssetList)
  async getTapAssets(@CurrentUser() { id }: UserId) {
    const [result, error] = await toWithError(
      this.tapdNodeService.listAssets({ id })
    );
    if (error || !result) {
      this.logger.error('Failed to list assets', { error });
      throw new GraphQLError('Failed to list assets');
    }
    return { assets: result.assets || [] };
  }

  @Query(() => TapBalances)
  async getTapBalances(
    @CurrentUser() { id }: UserId,
    @Args('groupBy', {
      type: () => TapBalanceGroupBy,
      nullable: true,
      defaultValue: TapBalanceGroupBy.GROUP_KEY,
    })
    groupBy?: TapBalanceGroupBy
  ) {
    const mode =
      groupBy === TapBalanceGroupBy.ASSET_ID
        ? ('assetId' as const)
        : ('groupKey' as const);

    const [result, error] = await toWithError(
      this.tapdNodeService.listBalances({ id, groupBy: mode })
    );
    if (error || !result) {
      this.logger.error('Failed to list balances', { error });
      throw new GraphQLError('Failed to list balances');
    }

    if (mode === 'assetId') {
      const balances = Object.entries(result.assetBalances || {}).map(
        ([key, value]: [string, AssetBalance]) => ({
          assetId: key,
          groupKey: bufToHex(value.groupKey),
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
          groupKey: key,
          names: names.length > 0 ? names : null,
          balance: value.balance.toString(),
        };
      }
    );
    return { balances };
  }

  @Query(() => TapTransferList)
  async getTapTransfers(@CurrentUser() { id }: UserId) {
    const [result, error] = await toWithError(
      this.tapdNodeService.listTransfers({ id })
    );
    if (error || !result) {
      this.logger.error('Failed to list transfers', { error });
      throw new GraphQLError('Failed to list transfers');
    }
    const transfers = (result.transfers || []).map((t: AssetTransfer) => ({
      anchorTxHash: bufToHex(t.anchorTxHash) || '',
      anchorTxHeightHint: t.anchorTxHeightHint,
      anchorTxChainFees: t.anchorTxChainFees.toString(),
      transferTimestamp: t.transferTimestamp.toString(),
      label: t.label || null,
      inputs: (t.inputs || []).map((i: TransferInput) => ({
        anchorPoint: i.anchorPoint,
        assetId: bufToHex(i.assetId) || '',
        amount: i.amount.toString(),
      })),
      outputs: (t.outputs || []).map((o: TransferOutput) => ({
        assetId: bufToHex(o.assetId) || '',
        amount: o.amount.toString(),
        scriptKeyIsLocal: o.scriptKeyIsLocal,
        outputType: o.outputType.toString(),
      })),
    }));
    return { transfers };
  }

  // ── Addresses ──

  @Mutation(() => TapAddress)
  async newTapAddress(
    @CurrentUser() { id }: UserId,
    @Args('assetId', { nullable: true }) assetId?: string,
    @Args('groupKey', { nullable: true }) groupKey?: string,
    @Args('amt', { type: () => Int, nullable: true }) amt?: number
  ) {
    if ((!assetId && !groupKey) || (assetId && groupKey)) {
      throw new GraphQLError(
        'Exactly one of assetId or groupKey must be provided'
      );
    }

    const [result, error] = await toWithError(
      this.tapdNodeService.newAddr({
        id,
        assetId: assetId || undefined,
        groupKey: groupKey || undefined,
        amt: amt || 0,
      })
    );
    if (error || !result) {
      this.logger.error('Failed to create tap address', { error });
      throw new GraphQLError('Failed to create tap address');
    }
    return {
      encoded: result.encoded,
      assetId: bufToHex(result.assetId) || '',
      amount: result.amount.toString(),
      scriptKey: bufToHex(result.scriptKey) || '',
      internalKey: bufToHex(result.internalKey) || '',
      taprootOutputKey: bufToHex(result.taprootOutputKey) || '',
    };
  }

  @Query(() => TapAddress)
  async decodeTapAddress(
    @CurrentUser() { id }: UserId,
    @Args('addr') addr: string
  ) {
    const [result, error] = await toWithError(
      this.tapdNodeService.decodeAddr({ id, addr })
    );
    if (error || !result) {
      this.logger.error('Failed to decode tap address', { error });
      throw new GraphQLError('Failed to decode tap address');
    }
    return {
      encoded: result.encoded,
      assetId: bufToHex(result.assetId) || '',
      groupKey: bufToHex(result.groupKey),
      amount: result.amount.toString(),
      assetType: result.assetType.toString(),
      scriptKey: bufToHex(result.scriptKey) || '',
      internalKey: bufToHex(result.internalKey) || '',
      taprootOutputKey: bufToHex(result.taprootOutputKey) || '',
    };
  }

  // ── Transfers ──

  @Mutation(() => Boolean)
  async sendTapAsset(
    @CurrentUser() { id }: UserId,
    @Args('tapAddrs', { type: () => [String] }) tapAddrs: string[]
  ) {
    const [, error] = await toWithError(
      this.tapdNodeService.sendAsset({ id, tapAddrs })
    );
    if (error) {
      this.logger.error('Failed to send asset', { error });
      throw new GraphQLError('Failed to send asset');
    }
    return true;
  }

  // ── Burn ──

  @Mutation(() => Boolean)
  async burnTapAsset(
    @CurrentUser() { id }: UserId,
    @Args('assetId') assetId: string,
    @Args('amount', { type: () => Int }) amount: number
  ) {
    const [, error] = await toWithError(
      this.tapdNodeService.burnAsset({ id, assetId, amountToBurn: amount })
    );
    if (error) {
      this.logger.error('Failed to burn asset', { error });
      throw new GraphQLError('Failed to burn asset');
    }
    return true;
  }

  // ── Minting ──

  @Mutation(() => TapMintResponse)
  async mintTapAsset(
    @CurrentUser() { id }: UserId,
    @Args('name') name: string,
    @Args('amount', { type: () => Int }) amount: number,
    @Args('assetType', {
      type: () => TapAssetType,
      defaultValue: TapAssetType.NORMAL,
    })
    assetType: TapAssetType,
    @Args('grouped', { nullable: true, defaultValue: true }) grouped: boolean,
    @Args('groupKey', { nullable: true }) groupKey?: string
  ) {
    const typeStr =
      assetType === TapAssetType.NORMAL ? 'NORMAL' : 'COLLECTIBLE';
    const [result, error] = await toWithError(
      this.tapdNodeService.mintAsset({
        id,
        name,
        amount,
        assetType: typeStr,
        grouped,
        groupKey,
      })
    );
    if (error || !result) {
      this.logger.error('Failed to mint asset', { error });
      throw new GraphQLError('Failed to mint asset');
    }
    return {
      batchKey: bufToHex(result.pendingBatch.batchKey),
    };
  }

  @Mutation(() => TapFinalizeBatchResponse)
  async finalizeTapBatch(@CurrentUser() { id }: UserId) {
    const [result, error] = await toWithError(
      this.tapdNodeService.finalizeBatch({ id })
    );
    if (error || !result) {
      this.logger.error('Failed to finalize batch', { error });
      throw new GraphQLError('Failed to finalize batch');
    }
    return {
      batchKey: bufToHex(result.batch.batchKey),
    };
  }

  @Mutation(() => Boolean)
  async cancelTapBatch(@CurrentUser() { id }: UserId) {
    const [, error] = await toWithError(
      this.tapdNodeService.cancelBatch({ id })
    );
    if (error) {
      this.logger.error('Failed to cancel batch', { error });
      throw new GraphQLError('Failed to cancel batch');
    }
    return true;
  }

  // ── Universe ──

  @Query(() => TapUniverseAssetList)
  async getTapUniverseAssets(@CurrentUser() { id }: UserId) {
    const [rootsResult, rootsError] = await toWithError(
      this.tapdNodeService.universeAssetRoots({ id })
    );
    if (rootsError || !rootsResult) {
      this.logger.error('Failed to list universe asset roots', {
        error: rootsError,
      });
      throw new GraphQLError('Failed to list universe asset roots');
    }

    const [assetsResult, assetsError] = await toWithError(
      this.tapdNodeService.listAssets({ id })
    );
    if (assetsError || !assetsResult) {
      this.logger.error('Failed to list assets for universe lookup', {
        error: assetsError,
      });
      throw new GraphQLError('Failed to list assets for universe lookup');
    }

    const roots = rootsResult.universeRoots || {};

    const xCoordToFullKey = buildXCoordToFullKeyMap(assetsResult.assets || []);

    const assets: {
      name: string | null;
      assetId: string | null;
      groupKey: string | null;
      proofType: string | null;
      totalSupply: string;
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
        assetId,
        groupKey: fullGroupKey,
        proofType: uid.proofType || null,
        totalSupply: totalSupply.toString(),
      });
    }

    return { assets };
  }

  @Query(() => TapUniverseInfo)
  async getTapUniverseInfo(@CurrentUser() { id }: UserId) {
    const [result, error] = await toWithError(
      this.tapdNodeService.universeInfo({ id })
    );
    if (error || !result) {
      this.logger.error('Failed to get universe info', { error });
      throw new GraphQLError('Failed to get universe info');
    }
    return result;
  }

  @Query(() => TapUniverseStats)
  async getTapUniverseStats(@CurrentUser() { id }: UserId) {
    const [result, error] = await toWithError(
      this.tapdNodeService.universeStats({ id })
    );
    if (error || !result) {
      this.logger.error('Failed to get universe stats', { error });
      throw new GraphQLError('Failed to get universe stats');
    }
    return result;
  }

  @Query(() => TapFederationServerList)
  async getTapFederationServers(@CurrentUser() { id }: UserId) {
    const account = this.tapdNodeService.getAccount(id);
    const [result, error] = await toWithError(
      this.tapdNodeService.listFederationServers({ id })
    );
    if (error || !result) {
      this.logger.error('Failed to list federation servers', { error });
      throw new GraphQLError('Failed to list federation servers');
    }
    return {
      nodeAddress: account.socket || null,
      servers: result.servers || [],
    };
  }

  @Mutation(() => Boolean)
  async addTapFederationServer(
    @CurrentUser() { id }: UserId,
    @Args('host') host: string
  ) {
    const [, error] = await toWithError(
      this.tapdNodeService.addFederationServer({ id, host })
    );
    if (error) {
      this.logger.error('Failed to add federation server', { error });
      throw new GraphQLError('Failed to add federation server');
    }
    return true;
  }

  @Mutation(() => Boolean)
  async removeTapFederationServer(
    @CurrentUser() { id }: UserId,
    @Args('host') host: string
  ) {
    const [, error] = await toWithError(
      this.tapdNodeService.deleteFederationServer({ id, host })
    );
    if (error) {
      this.logger.error('Failed to remove federation server', { error });
      throw new GraphQLError('Failed to remove federation server');
    }
    return true;
  }

  @Mutation(() => TapSyncResult)
  async syncTapUniverse(
    @CurrentUser() { id }: UserId,
    @Args('host') host: string
  ) {
    const [result, error] = await toWithError(
      this.tapdNodeService.syncUniverse({ id, host })
    );
    if (error || !result) {
      this.logger.error('Failed to sync universe', { error });
      throw new GraphQLError('Failed to sync universe');
    }
    const syncedUniverses = (result.syncedUniverses || []).map(
      (u: SyncedUniverse) => bufToHex(u.newAssetRoot?.id?.assetId) || 'unknown'
    );
    return { syncedUniverses };
  }

  // ── Asset Channels ──

  @Mutation(() => TapFundChannelResponse)
  async fundTapAssetChannel(
    @CurrentUser() { id }: UserId,
    @Args('peerPubkey') peerPubkey: string,
    @Args('assetAmount', { type: () => Int }) assetAmount: number,
    @Args('groupKey', { nullable: true }) groupKey?: string,
    @Args('assetId', { nullable: true }) assetId?: string,
    @Args('feeRateSatPerVbyte', { type: () => Int, nullable: true })
    feeRateSatPerVbyte?: number,
    @Args('pushSat', { type: () => Int, nullable: true }) pushSat?: number
  ) {
    if ((!assetId && !groupKey) || (assetId && groupKey)) {
      throw new GraphQLError(
        'Exactly one of assetId or groupKey must be provided'
      );
    }

    const [result, error] = await toWithError(
      this.tapdNodeService.fundAssetChannel({
        id,
        peerPubkey,
        assetAmount,
        groupKey: groupKey || undefined,
        assetId: assetId || undefined,
        feeRateSatPerVbyte: feeRateSatPerVbyte || undefined,
        pushSat: pushSat || undefined,
      })
    );
    if (error || !result) {
      this.logger.error('Failed to fund asset channel', { error });
      throw new GraphQLError('Failed to fund asset channel');
    }
    return {
      txid: result.txid,
      outputIndex: result.outputIndex,
    };
  }

  // ── Trading Offers ──

  @Query(() => TapTradeOfferList)
  async getTapOffers(
    @CurrentUser() _user: UserId,
    @Context() { ambossAuth }: ContextType,
    @Args('assetId') assetId: string,
    @Args('transactionType', { type: () => TapTransactionType })
    transactionType: TapTransactionType,
    @Args('sortBy', { type: () => TapOfferSortBy, nullable: true })
    sortBy?: TapOfferSortBy,
    @Args('sortDir', { type: () => TapOfferSortDir, nullable: true })
    sortDir?: TapOfferSortDir,
    @Args('minAmount', { nullable: true }) minAmount?: string,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number
  ) {
    const tradeUrl = this.configService.get<string>('urls.trade');
    if (!tradeUrl) {
      return { list: [], totalCount: 0 };
    }

    const headers = ambossAuth ? { authorization: `Bearer ${ambossAuth}` } : {};

    const { data, error } = await this.fetchService.graphqlFetchWithProxy<{
      public: {
        offers: {
          list: TradeApiOffer[];
          total_count: number;
        };
      };
    }>(
      tradeUrl,
      getOffersQuery,
      {
        input: {
          asset_id: assetId,
          transaction_type: transactionType,
          ...(sortBy ? { sort_by: sortBy } : {}),
          ...(sortDir ? { sort_dir: sortDir } : {}),
          ...(minAmount ? { min_amount: minAmount } : {}),
          ...(limit || offset
            ? { page: { limit: limit || 20, offset: offset || 0 } }
            : {}),
        },
      },
      headers
    );

    if (error || !data?.public?.offers) {
      if (error) this.logger.error('Error fetching trade offers', { error });
      return { list: [], totalCount: 0 };
    }

    const offers = data.public.offers;

    return {
      list: offers.list.map(o => ({
        id: o.id,
        node: {
          alias: o.node?.alias,
          pubkey: o.node?.pubkey,
        },
        rate: {
          displayAmount: o.rate?.display_amount,
          fullAmount: o.rate?.full_amount,
        },
        available: {
          displayAmount: o.available?.display_amount,
          fullAmount: o.available?.full_amount,
        },
      })),
      totalCount: offers.total_count,
    };
  }

  @Query(() => TapSupportedAssetList)
  async getTapSupportedAssets(
    @CurrentUser() _user: UserId,
    @Context() { ambossAuth }: ContextType
  ) {
    const tradeUrl = this.configService.get<string>('urls.trade');
    if (!tradeUrl) {
      return { list: [], totalCount: 0 };
    }

    const headers = ambossAuth ? { authorization: `Bearer ${ambossAuth}` } : {};

    const { data, error } = await this.fetchService.graphqlFetchWithProxy<{
      public: {
        assets: {
          supported: {
            list: TradeApiSupportedAsset[];
            total_count: number;
          };
        };
      };
    }>(tradeUrl, getSupportedAssetsQuery, undefined, headers);

    if (error || !data?.public?.assets?.supported) {
      if (error)
        this.logger.error('Error fetching supported assets', { error });
      return { list: [], totalCount: 0 };
    }

    const assets = data.public.assets.supported;

    return {
      list: assets.list.map(a => ({
        id: a.id,
        symbol: a.symbol,
        description: a.description,
        precision: a.precision,
        assetId: a.taproot_asset_details?.asset_id,
        groupKey: a.taproot_asset_details?.group_key,
      })),
      totalCount: assets.total_count,
    };
  }
}
