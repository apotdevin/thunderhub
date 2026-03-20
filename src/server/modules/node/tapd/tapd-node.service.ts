import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TapdRpcApis } from '@lightningpolar/tapd-api';
import {
  Addr,
  AddrReceivesResponse,
  AssetLeafResponse,
  AssetRootResponse,
  BurnAssetResponse,
  CancelBatchResponse,
  DeleteFederationServerResponse,
  FinalizeBatchResponse,
  FundChannelResponse,
  InfoResponse,
  ListAssetResponse,
  ListBalancesResponse,
  ListBatchResponse,
  ListFederationServersResponse,
  ListGroupsResponse,
  ListTransfersResponse,
  ListUtxosResponse,
  MintAssetResponse,
  QueryAddrResponse,
  SendAssetResponse,
  StatsResponse,
  SyncResponse,
  UniverseAssetStats,
  AddFederationServerResponse,
} from '@lightningpolar/tapd-api';
import { AccountsService } from '../../accounts/accounts.service';
import { EnrichedAccount } from '../../accounts/accounts.types';
import { ProviderRegistryService } from '../provider-registry.service';
import { Capability } from '../lightning.types';
import { isTaprootAssetsProvider } from './taproot-assets.types';

@Injectable()
export class TapdNodeService {
  constructor(
    private accountsService: AccountsService,
    private providerRegistry: ProviderRegistryService,
    private configService: ConfigService
  ) {}

  getAccount(id: string): EnrichedAccount {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');

    return account;
  }

  private getTapd(id: string): TapdRpcApis {
    const account = this.getAccount(id);

    const provider = this.providerRegistry.getProvider(account.type);
    const capabilities = provider.getCapabilities();

    if (!capabilities.has(Capability.TAPROOT_ASSETS)) {
      throw new Error(
        "This node does not support Taproot Assets or it's not enabled"
      );
    }

    if (!isTaprootAssetsProvider(provider)) {
      throw new Error('Provider does not implement Taproot Assets');
    }

    const tapd = provider.getTapd(account.connection);
    if (!tapd) {
      throw new Error(
        'Taproot Assets client not available for this connection'
      );
    }

    return tapd;
  }

  // ── Assets ──

  async listAssets(opts: {
    id: string;
    includeSpent?: boolean;
  }): Promise<ListAssetResponse> {
    const tapd = this.getTapd(opts.id);
    return tapd.taprootAssets.listAssets({
      includeSpent: opts.includeSpent ?? false,
    });
  }

  async listBalances(opts: {
    id: string;
    groupBy?: 'groupKey' | 'assetId';
    filter?: string;
  }): Promise<ListBalancesResponse> {
    const tapd = this.getTapd(opts.id);
    const { groupBy = 'groupKey', filter } = opts;

    if (groupBy === 'assetId') {
      return tapd.taprootAssets.listBalances({
        assetId: true,
        ...(filter ? { assetFilter: Buffer.from(filter, 'hex') } : {}),
      });
    }
    return tapd.taprootAssets.listBalances({
      groupKey: true,
      ...(filter ? { groupKeyFilter: Buffer.from(filter, 'hex') } : {}),
    });
  }

  async listGroups(opts: { id: string }): Promise<ListGroupsResponse> {
    const tapd = this.getTapd(opts.id);
    return tapd.taprootAssets.listGroups();
  }

  async listUtxos(opts: { id: string }): Promise<ListUtxosResponse> {
    const tapd = this.getTapd(opts.id);
    return tapd.taprootAssets.listUtxos();
  }

  // ── Addresses ──

  async newAddr(opts: {
    id: string;
    assetId?: string;
    groupKey?: string;
    amt: number;
    proofCourierAddr?: string;
  }): Promise<Addr> {
    const tapd = this.getTapd(opts.id);
    const isProduction = this.configService.get('isProduction');
    const defaultCourier =
      'authmailbox+universerpc://universe.lightning.finance:10029';

    return tapd.taprootAssets.newAddr({
      ...(opts.groupKey
        ? { groupKey: Buffer.from(opts.groupKey, 'hex') }
        : { assetId: Buffer.from(opts.assetId || '', 'hex') }),
      amt: String(opts.amt),
      addressVersion: 'ADDR_VERSION_V2',
      ...(isProduction
        ? { proofCourierAddr: opts.proofCourierAddr || defaultCourier }
        : {}),
    });
  }

  async decodeAddr(opts: { id: string; addr: string }): Promise<Addr> {
    const tapd = this.getTapd(opts.id);
    return tapd.taprootAssets.decodeAddr({ addr: opts.addr });
  }

  async queryAddrs(opts: { id: string }): Promise<QueryAddrResponse> {
    const tapd = this.getTapd(opts.id);
    return tapd.taprootAssets.queryAddrs();
  }

  async addrReceives(opts: { id: string }): Promise<AddrReceivesResponse> {
    const tapd = this.getTapd(opts.id);
    return tapd.taprootAssets.addrReceives();
  }

  // ── Transfers ──

  async sendAsset(opts: {
    id: string;
    tapAddrs: string[];
  }): Promise<SendAssetResponse> {
    const tapd = this.getTapd(opts.id);
    return tapd.taprootAssets.sendAsset({ tapAddrs: opts.tapAddrs });
  }

  async listTransfers(opts: { id: string }): Promise<ListTransfersResponse> {
    const tapd = this.getTapd(opts.id);
    return tapd.taprootAssets.listTransfers();
  }

  // ── Burn ──

  async burnAsset(opts: {
    id: string;
    assetId: string;
    amountToBurn: number;
  }): Promise<BurnAssetResponse> {
    const tapd = this.getTapd(opts.id);
    return tapd.taprootAssets.burnAsset({
      assetIdStr: opts.assetId,
      amountToBurn: String(opts.amountToBurn),
      confirmationText: 'assets will be destroyed',
    });
  }

  // ── Minting ──

  async mintAsset(opts: {
    id: string;
    name: string;
    amount: number;
    assetType: 'NORMAL' | 'COLLECTIBLE';
    groupKey?: string;
  }): Promise<MintAssetResponse> {
    const tapd = this.getTapd(opts.id);
    return tapd.mint.mintAsset({
      asset: {
        name: opts.name,
        amount: String(opts.amount),
        assetType: opts.assetType,
        newGroupedAsset: !opts.groupKey,
        ...(opts.groupKey
          ? {
              groupedAsset: true,
              groupKey: Buffer.from(opts.groupKey, 'hex'),
            }
          : {}),
      },
    });
  }

  async finalizeBatch(opts: { id: string }): Promise<FinalizeBatchResponse> {
    const tapd = this.getTapd(opts.id);
    return tapd.mint.finalizeBatch();
  }

  async cancelBatch(opts: { id: string }): Promise<CancelBatchResponse> {
    const tapd = this.getTapd(opts.id);
    return tapd.mint.cancelBatch();
  }

  async listBatches(opts: { id: string }): Promise<ListBatchResponse> {
    const tapd = this.getTapd(opts.id);
    return tapd.mint.listBatches();
  }

  // ── Universe ──

  async universeInfo(opts: { id: string }): Promise<InfoResponse> {
    const tapd = this.getTapd(opts.id);
    return tapd.universe.info();
  }

  async universeStats(opts: { id: string }): Promise<StatsResponse> {
    const tapd = this.getTapd(opts.id);
    return tapd.universe.universeStats();
  }

  async universeAssetRoots(opts: { id: string }): Promise<AssetRootResponse> {
    const tapd = this.getTapd(opts.id);
    return tapd.universe.assetRoots();
  }

  async universeAssetLeaves(opts: {
    id: string;
    groupKey: string;
  }): Promise<AssetLeafResponse> {
    const tapd = this.getTapd(opts.id);

    // Try with groupKeyStr (hex string) which avoids Buffer encoding issues.
    // The universe root stores just the x-coordinate (32 bytes).
    // Try with 02 prefix first, then 03 if no results.
    const prefixes = opts.groupKey.length === 64 ? ['02', '03'] : [''];
    for (const prefix of prefixes) {
      const result = await tapd.universe.assetLeaves({
        groupKeyStr: prefix + opts.groupKey,
      });
      if (result.leaves?.length) return result;
    }

    return { leaves: [] };
  }

  async queryAssetStats(opts: { id: string }): Promise<UniverseAssetStats> {
    const tapd = this.getTapd(opts.id);
    return tapd.universe.queryAssetStats();
  }

  async listFederationServers(opts: {
    id: string;
  }): Promise<ListFederationServersResponse> {
    const tapd = this.getTapd(opts.id);
    return tapd.universe.listFederationServers();
  }

  async addFederationServer(opts: {
    id: string;
    host: string;
  }): Promise<AddFederationServerResponse> {
    const tapd = this.getTapd(opts.id);

    const result = await tapd.universe.addFederationServer({
      servers: [{ host: opts.host }],
    });

    // Enable sync insert for both issuance and transfer proofs
    await tapd.universe.setFederationSyncConfig({
      globalSyncConfigs: [
        {
          proofType: 'PROOF_TYPE_ISSUANCE',
          allowSyncInsert: true,
          allowSyncExport: true,
        },
        {
          proofType: 'PROOF_TYPE_TRANSFER',
          allowSyncInsert: true,
          allowSyncExport: true,
        },
      ],
    });

    return result;
  }

  async deleteFederationServer(opts: {
    id: string;
    host: string;
  }): Promise<DeleteFederationServerResponse> {
    const tapd = this.getTapd(opts.id);
    return tapd.universe.deleteFederationServer({
      servers: [{ host: opts.host }],
    });
  }

  async syncUniverse(opts: {
    id: string;
    host: string;
  }): Promise<SyncResponse> {
    const tapd = this.getTapd(opts.id);
    return tapd.universe.syncUniverse({
      universeHost: opts.host,
    });
  }

  // ── Asset Channels ──

  async fundAssetChannel(opts: {
    id: string;
    peerPubkey: string;
    assetAmount: number;
    groupKey?: string;
    assetId?: string;
    feeRateSatPerVbyte?: number;
    pushSat?: number;
  }): Promise<FundChannelResponse> {
    const tapd = this.getTapd(opts.id);
    return tapd.channels.fundChannel({
      peerPubkey: Buffer.from(opts.peerPubkey, 'hex'),
      assetAmount: String(opts.assetAmount),
      ...(opts.groupKey
        ? { groupKey: Buffer.from(opts.groupKey, 'hex') }
        : { assetId: Buffer.from(opts.assetId || '', 'hex') }),
      ...(opts.feeRateSatPerVbyte
        ? { feeRateSatPerVbyte: opts.feeRateSatPerVbyte }
        : {}),
      ...(opts.pushSat ? { pushSat: String(opts.pushSat) } : {}),
    });
  }
}
