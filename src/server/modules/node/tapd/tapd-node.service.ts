import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TapdRpcApis } from '@lightningpolar/tapd-api';
import { AccountsService } from '../../accounts/accounts.service';
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

  getAccount(id: string) {
    return this.accountsService.getAccount(id);
  }

  private getTapd(id: string): TapdRpcApis {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');

    const provider = this.providerRegistry.getProvider(account.type);
    const capabilities = provider.getCapabilities();

    if (!capabilities.has(Capability.TAPROOT_ASSETS)) {
      throw new Error(
        'This node does not support Taproot Assets. Connect via litd to use this feature.'
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

  async listAssets(id: string, includeSpent = false) {
    const tapd = this.getTapd(id);
    return tapd.taprootAssets.listAssets({ includeSpent });
  }

  async listBalances(
    id: string,
    groupBy: 'groupKey' | 'assetId' = 'groupKey',
    filter?: string
  ) {
    const tapd = this.getTapd(id);
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

  async listGroups(id: string) {
    const tapd = this.getTapd(id);
    return tapd.taprootAssets.listGroups();
  }

  async listUtxos(id: string) {
    const tapd = this.getTapd(id);
    return tapd.taprootAssets.listUtxos();
  }

  // ── Addresses ──

  async newAddr(
    id: string,
    opts: {
      assetId?: string;
      groupKey?: string;
      amt: number;
      proofCourierAddr?: string;
    }
  ) {
    const tapd = this.getTapd(id);
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

  async decodeAddr(id: string, addr: string) {
    const tapd = this.getTapd(id);
    return tapd.taprootAssets.decodeAddr({ addr });
  }

  async queryAddrs(id: string) {
    const tapd = this.getTapd(id);
    return tapd.taprootAssets.queryAddrs();
  }

  async addrReceives(id: string) {
    const tapd = this.getTapd(id);
    return tapd.taprootAssets.addrReceives();
  }

  // ── Transfers ──

  async sendAsset(id: string, tapAddrs: string[]) {
    const tapd = this.getTapd(id);
    return tapd.taprootAssets.sendAsset({ tapAddrs });
  }

  async listTransfers(id: string) {
    const tapd = this.getTapd(id);
    return tapd.taprootAssets.listTransfers();
  }

  // ── Burn ──

  async burnAsset(id: string, assetId: string, amountToBurn: number) {
    const tapd = this.getTapd(id);
    return tapd.taprootAssets.burnAsset({
      assetIdStr: assetId,
      amountToBurn: String(amountToBurn),
      confirmationText: 'assets will be destroyed',
    });
  }

  // ── Minting ──

  async mintAsset(
    id: string,
    name: string,
    amount: number,
    assetType: 'NORMAL' | 'COLLECTIBLE',
    groupKey?: string
  ) {
    const tapd = this.getTapd(id);
    return tapd.mint.mintAsset({
      asset: {
        name,
        amount: String(amount),
        assetType,
        newGroupedAsset: !groupKey,
        ...(groupKey
          ? { groupedAsset: true, groupKey: Buffer.from(groupKey, 'hex') }
          : {}),
      },
    });
  }

  async finalizeBatch(id: string) {
    const tapd = this.getTapd(id);
    return tapd.mint.finalizeBatch();
  }

  async cancelBatch(id: string) {
    const tapd = this.getTapd(id);
    return tapd.mint.cancelBatch();
  }

  async listBatches(id: string) {
    const tapd = this.getTapd(id);
    return tapd.mint.listBatches();
  }

  // ── Universe ──

  async universeInfo(id: string) {
    const tapd = this.getTapd(id);
    return tapd.universe.info();
  }

  async universeStats(id: string) {
    const tapd = this.getTapd(id);
    return tapd.universe.universeStats();
  }

  async universeAssetRoots(id: string) {
    const tapd = this.getTapd(id);
    return tapd.universe.assetRoots();
  }

  async universeAssetLeaves(id: string, groupKey: string) {
    const tapd = this.getTapd(id);

    // Try with groupKeyStr (hex string) which avoids Buffer encoding issues.
    // The universe root stores just the x-coordinate (32 bytes).
    // Try with 02 prefix first, then 03 if no results.
    const prefixes = groupKey.length === 64 ? ['02', '03'] : [''];
    for (const prefix of prefixes) {
      const result = await tapd.universe.assetLeaves({
        groupKeyStr: prefix + groupKey,
      });
      if (result.leaves?.length) return result;
    }

    return { leaves: [] };
  }

  async queryAssetStats(id: string) {
    const tapd = this.getTapd(id);
    return tapd.universe.queryAssetStats();
  }

  async listFederationServers(id: string) {
    const tapd = this.getTapd(id);
    return tapd.universe.listFederationServers();
  }

  async addFederationServer(id: string, host: string) {
    const tapd = this.getTapd(id);

    // Add the server
    const result = await tapd.universe.addFederationServer({
      servers: [{ host }],
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

  async deleteFederationServer(id: string, host: string) {
    const tapd = this.getTapd(id);
    return tapd.universe.deleteFederationServer({
      servers: [{ host }],
    });
  }

  async syncUniverse(id: string, host: string) {
    const tapd = this.getTapd(id);
    return tapd.universe.syncUniverse({
      universeHost: host,
    });
  }

  // ── Asset Channels ──

  async fundAssetChannel(
    id: string,
    opts: {
      peerPubkey: string;
      assetAmount: number;
      groupKey?: string;
      assetId?: string;
      feeRateSatPerVbyte?: number;
      pushSat?: number;
    }
  ) {
    const tapd = this.getTapd(id);
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
