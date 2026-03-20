import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TapdNodeService } from '../../node/tapd/tapd-node.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import {
  TapAddress,
  TapAssetList,
  TapAssetType,
  TapBalances,
  TapAssetInvoiceResponse,
  TapFederationServerList,
  TapFinalizeBatchResponse,
  TapMintResponse,
  TapFundChannelResponse,
  TapSyncResult,
  TapUniverseAssetList,
  TapTransferList,
  TapUniverseInfo,
  TapUniverseStats,
} from './tapd.types';

const ASSET_TYPE_MAP: Record<string, number> = {
  NORMAL: 0,
  COLLECTIBLE: 1,
};

const bufToHex = (val: any): string | undefined => {
  if (!val) return undefined;
  if (Buffer.isBuffer(val)) return val.toString('hex');
  if (val instanceof Uint8Array) return Buffer.from(val).toString('hex');
  if (typeof val === 'string') return val;
  if (val?.type === 'Buffer' && Array.isArray(val?.data)) {
    return Buffer.from(val.data).toString('hex');
  }
  return undefined;
};

const serializeAsset = (asset: any) => ({
  assetGenesis: asset.assetGenesis
    ? {
        genesisPoint: asset.assetGenesis.genesisPoint,
        name: asset.assetGenesis.name,
        metaHash: bufToHex(asset.assetGenesis.metaHash),
        assetId: bufToHex(asset.assetGenesis.assetId),
        assetType:
          ASSET_TYPE_MAP[asset.assetGenesis.assetType] ??
          asset.assetGenesis.assetType,
        outputIndex: asset.assetGenesis.outputIndex,
      }
    : null,
  amount: asset.amount?.toString(),
  lockTime: asset.lockTime,
  relativeLockTime: asset.relativeLockTime,
  scriptVersion: asset.scriptVersion,
  scriptKey: bufToHex(asset.scriptKey),
  isSpent: asset.isSpent,
  isBurn: asset.isBurn,
});

@Resolver()
export class TapdResolver {
  constructor(private tapdNodeService: TapdNodeService) {}

  // ── Assets ──

  @Query(() => TapAssetList)
  async getTapAssets(@CurrentUser() { id }: UserId) {
    const result = await this.tapdNodeService.listAssets({ id });
    const assets = (result.assets || []).map(serializeAsset);
    return { assets };
  }

  @Query(() => TapBalances)
  async getTapBalances(
    @CurrentUser() { id }: UserId,
    @Args('groupBy', { nullable: true, defaultValue: 'groupKey' })
    groupBy?: string,
    @Args('filter', { nullable: true }) filter?: string
  ) {
    const mode =
      groupBy === 'assetId' ? ('assetId' as const) : ('groupKey' as const);
    const result = await this.tapdNodeService.listBalances({
      id,
      groupBy: mode,
      filter,
    });

    if (mode === 'assetId') {
      const balances = Object.entries(result.assetBalances || {}).map(
        ([key, value]: [string, any]) => ({
          assetId: key,
          groupKey: bufToHex(value?.groupKey),
          name: value?.assetGenesis?.name,
          balance: value?.balance?.toString(),
        })
      );
      return { balances };
    }

    // For groupKey mode, also fetch by assetId to get names and asset IDs
    const assetResult = await this.tapdNodeService.listBalances({
      id,
      groupBy: 'assetId',
    });
    const assetMap = new Map<string, { assetId: string; name: string }>();
    for (const [assetId, value] of Object.entries(
      assetResult.assetBalances || {}
    )) {
      const gk = bufToHex((value as any)?.groupKey);
      if (gk) {
        assetMap.set(gk, {
          assetId,
          name: (value as any)?.assetGenesis?.name || '',
        });
      }
    }

    const balances = Object.entries(result.assetGroupBalances || {}).map(
      ([key, value]: [string, any]) => {
        const assetInfo = assetMap.get(key);
        return {
          assetId: assetInfo?.assetId,
          groupKey: key,
          name: assetInfo?.name,
          balance: value?.balance?.toString(),
        };
      }
    );

    return { balances };
  }

  @Query(() => TapTransferList)
  async getTapTransfers(@CurrentUser() { id }: UserId) {
    const result = await this.tapdNodeService.listTransfers({ id });
    const transfers = (result.transfers || []).map((t: any) => ({
      anchorTxHash: bufToHex(t.anchorTxHash) || t.anchorTxHash,
      anchorTxHeightHint: t.anchorTxHeightHint,
      anchorTxChainFees: t.anchorTxChainFees?.toString(),
      transferTimestamp: t.transferTimestamp?.toString(),
      label: t.label || null,
      inputs: (t.inputs || []).map((i: any) => ({
        anchorPoint: i.anchorPoint,
        assetId: bufToHex(i.assetId),
        amount: i.amount?.toString(),
      })),
      outputs: (t.outputs || []).map((o: any) => ({
        assetId: bufToHex(o.assetId),
        amount: o.amount?.toString(),
        scriptKeyIsLocal: o.scriptKeyIsLocal,
        outputType: o.outputType?.toString(),
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
    @Args('amt', { type: () => Int }) amt?: number
  ) {
    const result = await this.tapdNodeService.newAddr({
      id,
      assetId: assetId || undefined,
      groupKey: groupKey || undefined,
      amt: amt || 0,
    });
    return {
      encoded: result.encoded,
      assetId: bufToHex(result.assetId),
      amount: result.amount?.toString(),
      scriptKey: bufToHex(result.scriptKey),
      internalKey: bufToHex(result.internalKey),
      taprootOutputKey: bufToHex(result.taprootOutputKey),
    };
  }

  @Query(() => TapAddress)
  async decodeTapAddress(
    @CurrentUser() { id }: UserId,
    @Args('addr') addr: string
  ) {
    const result = await this.tapdNodeService.decodeAddr({ id, addr });
    return {
      encoded: result.encoded,
      assetId: bufToHex(result.assetId),
      groupKey: bufToHex(result.groupKey),
      amount: result.amount?.toString(),
      assetType: result.assetType?.toString(),
      scriptKey: bufToHex(result.scriptKey),
      internalKey: bufToHex(result.internalKey),
      taprootOutputKey: bufToHex(result.taprootOutputKey),
    };
  }

  // ── Transfers ──

  @Mutation(() => Boolean)
  async sendTapAsset(
    @CurrentUser() { id }: UserId,
    @Args('tapAddrs', { type: () => [String] }) tapAddrs: string[]
  ) {
    await this.tapdNodeService.sendAsset({ id, tapAddrs });
    return true;
  }

  // ── Burn ──

  @Mutation(() => Boolean)
  async burnTapAsset(
    @CurrentUser() { id }: UserId,
    @Args('assetId') assetId: string,
    @Args('amount', { type: () => Int }) amount: number
  ) {
    await this.tapdNodeService.burnAsset({
      id,
      assetId,
      amountToBurn: amount,
    });
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
    @Args('groupKey', { nullable: true }) groupKey?: string
  ) {
    const typeStr =
      assetType === TapAssetType.NORMAL ? 'NORMAL' : 'COLLECTIBLE';
    const result = await this.tapdNodeService.mintAsset({
      id,
      name,
      amount,
      assetType: typeStr,
      groupKey,
    });
    return {
      batchKey: result.pendingBatch?.batchKey
        ? Buffer.from(result.pendingBatch.batchKey).toString('hex')
        : undefined,
    };
  }

  @Mutation(() => TapFinalizeBatchResponse)
  async finalizeTapBatch(@CurrentUser() { id }: UserId) {
    const result = await this.tapdNodeService.finalizeBatch({ id });
    return {
      batchKey: result.batch?.batchKey
        ? Buffer.from(result.batch.batchKey).toString('hex')
        : undefined,
    };
  }

  @Mutation(() => Boolean)
  async cancelTapBatch(@CurrentUser() { id }: UserId) {
    await this.tapdNodeService.cancelBatch({ id });
    return true;
  }

  // ── Universe ──

  @Query(() => TapUniverseAssetList)
  async getTapUniverseAssets(@CurrentUser() { id }: UserId) {
    const [rootsResult, assetsResult] = await Promise.all([
      this.tapdNodeService.universeAssetRoots({ id }),
      this.tapdNodeService.listAssets({ id }),
    ]);

    const roots = rootsResult.universeRoots || {};

    // Build a map from x-coordinate (32 bytes) to full group key (33 bytes)
    // using the owned assets which have the full tweakedGroupKey
    const xCoordToFullKey = new Map<string, string>();
    const assetIdToGroupKey = new Map<string, string>();
    for (const asset of assetsResult.assets || []) {
      const fullKey = bufToHex((asset as any).assetGroup?.tweakedGroupKey);
      if (fullKey && fullKey.length === 66) {
        // x-coordinate is the key without the 02/03 prefix
        xCoordToFullKey.set(fullKey.slice(2), fullKey);
      }
      const aid = bufToHex((asset as any).assetGenesis?.assetId);
      if (aid && fullKey) {
        assetIdToGroupKey.set(aid, fullKey);
      }
    }

    const assets: any[] = [];
    const seen = new Set<string>();

    for (const [key, root] of Object.entries(roots) as [string, any][]) {
      const uid = root.id || {};
      const rawGroupKey = bufToHex(uid.groupKey);
      const keyHex = key.replace(/^(issuance|transfer)-/, '');

      const totalSupply = Object.values(root.amountsByAssetId || {}).reduce(
        (sum: number, amt: any) => sum + Number(amt || 0),
        0
      );

      // Resolve full group key from x-coordinate
      const fullGroupKey = rawGroupKey
        ? xCoordToFullKey.get(rawGroupKey) || null
        : null;

      const assetId = keyHex && keyHex.length === 64 ? keyHex : null;

      const dedupeKey = fullGroupKey || rawGroupKey || assetId || '';
      if (!dedupeKey || seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      assets.push({
        name: root.assetName || null,
        assetId,
        groupKey: fullGroupKey,
        proofType: uid.proofType || null,
        totalSupply: String(totalSupply),
      });
    }

    return { assets };
  }

  @Query(() => TapUniverseInfo)
  async getTapUniverseInfo(@CurrentUser() { id }: UserId) {
    return this.tapdNodeService.universeInfo({ id });
  }

  @Query(() => TapUniverseStats)
  async getTapUniverseStats(@CurrentUser() { id }: UserId) {
    return this.tapdNodeService.universeStats({ id });
  }

  @Query(() => TapFederationServerList)
  async getTapFederationServers(@CurrentUser() { id }: UserId) {
    const account = this.tapdNodeService.getAccount(id);
    const result = await this.tapdNodeService.listFederationServers({
      id,
    });
    return {
      nodeAddress: account?.socket || null,
      servers: result.servers || [],
    };
  }

  @Mutation(() => Boolean)
  async addTapFederationServer(
    @CurrentUser() { id }: UserId,
    @Args('host') host: string
  ) {
    await this.tapdNodeService.addFederationServer({ id, host });
    return true;
  }

  @Mutation(() => Boolean)
  async removeTapFederationServer(
    @CurrentUser() { id }: UserId,
    @Args('host') host: string
  ) {
    await this.tapdNodeService.deleteFederationServer({ id, host });
    return true;
  }

  @Mutation(() => TapSyncResult)
  async syncTapUniverse(
    @CurrentUser() { id }: UserId,
    @Args('host') host: string
  ) {
    const result = await this.tapdNodeService.syncUniverse({ id, host });
    const syncedUniverses = (result.syncedUniverses || []).map(
      (u: any) => u.id?.assetIdStr || bufToHex(u.id?.assetId) || 'unknown'
    );
    return { syncedUniverses };
  }

  // ── Asset Invoices ──

  @Mutation(() => TapAssetInvoiceResponse)
  async addTapAssetInvoice(
    @CurrentUser() { id }: UserId,
    @Args('assetAmount', { type: () => Int }) assetAmount: number,
    @Args('assetId', { nullable: true }) assetId?: string,
    @Args('groupKey', { nullable: true }) groupKey?: string,
    @Args('peerPubkey', { nullable: true }) peerPubkey?: string,
    @Args('memo', { nullable: true }) memo?: string,
    @Args('expiry', { type: () => Int, nullable: true }) expiry?: number
  ) {
    const result = await this.tapdNodeService.addAssetInvoice({
      id,
      assetId: assetId || undefined,
      groupKey: groupKey || undefined,
      assetAmount,
      peerPubkey: peerPubkey || undefined,
      memo: memo || undefined,
      expiry: expiry || undefined,
    });

    const invoiceResult = result.invoiceResult;
    const quote = result.acceptedBuyQuote;

    return {
      paymentRequest: invoiceResult?.paymentRequest || '',
      rHash: invoiceResult?.rHash
        ? Buffer.from(invoiceResult.rHash).toString('hex')
        : '',
      addIndex: invoiceResult?.addIndex || '0',
      paymentAddr: invoiceResult?.paymentAddr
        ? Buffer.from(invoiceResult.paymentAddr).toString('hex')
        : '',
      assetId: bufToHex(quote?.assetSpec?.id),
      groupKey: bufToHex(quote?.assetSpec?.groupPubKey),
      assetAmount: quote?.assetMaxAmount || String(assetAmount),
    };
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
    const result = await this.tapdNodeService.fundAssetChannel({
      id,
      peerPubkey,
      assetAmount,
      groupKey: groupKey || undefined,
      assetId: assetId || undefined,
      feeRateSatPerVbyte: feeRateSatPerVbyte || undefined,
      pushSat: pushSat || undefined,
    });
    return {
      txid: result.txid,
      outputIndex: result.outputIndex,
    };
  }
}
