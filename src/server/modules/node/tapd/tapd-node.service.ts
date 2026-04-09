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
import { AddInvoiceResponse as TapAddInvoiceResponse } from '@lightningpolar/tapd-api/dist/types/tapchannelrpc/AddInvoiceResponse';
import { Payment as LnrpcPayment } from '@lightningpolar/tapd-api/dist/types/lnrpc/Payment';
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
  }): Promise<ListBalancesResponse> {
    const account = this.getAccount(opts.id);
    const provider = this.providerRegistry.getProvider(account.type);
    if (!provider.getCapabilities().has(Capability.TAPROOT_ASSETS)) {
      return {
        assetBalances: {},
        assetGroupBalances: {},
        unconfirmedTransfers: '',
      };
    }

    const tapd = this.getTapd(opts.id);
    const { groupBy = 'groupKey' } = opts;

    if (groupBy === 'assetId') {
      return tapd.taprootAssets.listBalances({ assetId: true });
    }
    return tapd.taprootAssets.listBalances({ groupKey: true });
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
    grouped?: boolean;
    groupKey?: string;
  }): Promise<MintAssetResponse> {
    const tapd = this.getTapd(opts.id);
    const grouped = opts.grouped ?? true;

    return tapd.mint.mintAsset({
      asset: {
        name: opts.name,
        amount: String(opts.amount),
        assetType: opts.assetType,
        ...(opts.groupKey
          ? {
              groupedAsset: true,
              groupKey: Buffer.from(opts.groupKey, 'hex'),
            }
          : grouped
            ? { newGroupedAsset: true }
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

  // ── Asset Invoices ──

  async addAssetInvoice(opts: {
    id: string;
    assetId?: string;
    groupKey?: string;
    assetAmount: number;
    peerPubkey?: string;
    memo?: string;
    expiry?: number;
  }): Promise<TapAddInvoiceResponse> {
    const tapd = this.getTapd(opts.id);
    return tapd.channels.addInvoice({
      ...(opts.groupKey
        ? { groupKey: Buffer.from(opts.groupKey, 'hex') }
        : { assetId: Buffer.from(opts.assetId || '', 'hex') }),
      assetAmount: String(opts.assetAmount),
      ...(opts.peerPubkey
        ? {
            peerPubkey: Buffer.from(opts.peerPubkey, 'hex'),
            priceOracleMetadata: JSON.stringify({
              swapNodePubkey: opts.peerPubkey,
            }),
          }
        : {}),
      invoiceRequest: {
        ...(opts.memo ? { memo: opts.memo } : {}),
        ...(opts.expiry ? { expiry: String(opts.expiry) } : {}),
      },
    });
  }

  // ── Asset Channels ──

  async getAssetChannelBalances(opts: {
    id: string;
    peerPubkey?: string;
  }): Promise<
    {
      channelPoint: string;
      partnerPublicKey: string;
      assetId: string;
      groupKey: string;
      localBalance: string;
      remoteBalance: string;
      capacity: string;
    }[]
  > {
    const account = this.getAccount(opts.id);
    const provider = this.providerRegistry.getProvider(account.type);
    const capabilities = provider.getCapabilities();

    if (!capabilities.has(Capability.TAPROOT_ASSETS)) {
      return [];
    }

    const connection = account.connection;
    const lnd = connection.lnd ?? connection;

    return new Promise((resolve, reject) => {
      lnd.default.listChannels(
        {
          peer: opts.peerPubkey
            ? Buffer.from(opts.peerPubkey, 'hex')
            : undefined,
        },
        (
          err: Error | null,
          res: {
            channels: {
              channel_point: string;
              remote_pubkey: string;
              custom_channel_data: Buffer;
            }[];
          }
        ) => {
          if (err) return reject(err);

          const results: {
            channelPoint: string;
            partnerPublicKey: string;
            assetId: string;
            groupKey: string;
            localBalance: string;
            remoteBalance: string;
            capacity: string;
          }[] = [];

          for (const ch of res.channels || []) {
            if (!ch.custom_channel_data?.length) continue;

            try {
              const data = JSON.parse(ch.custom_channel_data.toString('utf8'));
              const fundingAsset = data.funding_assets?.[0];
              const assetId = fundingAsset?.asset_genesis?.asset_id || '';
              if (!assetId) continue;

              const groupKey =
                fundingAsset?.asset_group?.tweaked_group_key || '';

              results.push({
                channelPoint: ch.channel_point,
                partnerPublicKey: ch.remote_pubkey,
                assetId,
                groupKey,
                localBalance: String(data.local_balance ?? 0),
                remoteBalance: String(data.remote_balance ?? 0),
                capacity: String(data.capacity ?? 0),
              });
            } catch {
              // Not JSON or invalid — skip
            }
          }

          resolve(results);
        }
      );
    });
  }

  async getSellQuote(opts: {
    id: string;
    assetId?: string;
    groupKey?: string;
    paymentMaxAmtMsat: string;
    peerPubkey: string;
  }): Promise<{
    rfqId: Buffer;
    assetAmount: string;
    bidAssetRate: { coefficient: string; scale: number } | null;
    scid: string;
    minTransportableMsat: string;
  }> {
    const tapd = this.getTapd(opts.id);

    const result = await tapd.rfq.addAssetSellOrder({
      assetSpecifier: opts.groupKey
        ? { groupKeyStr: opts.groupKey }
        : { assetIdStr: opts.assetId || '' },
      paymentMaxAmt: opts.paymentMaxAmtMsat,
      peerPubKey: Buffer.from(opts.peerPubkey, 'hex'),
      timeoutSeconds: 30,
      priceOracleMetadata: JSON.stringify({
        swapNodePubkey: opts.peerPubkey,
      }),
    });

    if (result.response === 'invalidQuote' || result.invalidQuote) {
      throw new Error(
        `Invalid sell quote: ${JSON.stringify(result.invalidQuote)}`
      );
    }
    if (result.response === 'rejectedQuote' || result.rejectedQuote) {
      throw new Error(
        `Sell quote rejected: ${JSON.stringify(result.rejectedQuote)}`
      );
    }

    const quote = result.acceptedQuote;
    if (!quote) {
      throw new Error('No accepted sell quote returned');
    }

    return {
      rfqId: Buffer.from(quote.id),
      assetAmount: quote.assetAmount,
      bidAssetRate: quote.bidAssetRate,
      scid: quote.scid,
      minTransportableMsat: quote.minTransportableMsat,
    };
  }

  async sendAssetPayment(opts: {
    id: string;
    assetId?: string;
    groupKey?: string;
    assetAmount?: string;
    paymentRequest: string;
    peerPubkey?: string;
  }): Promise<LnrpcPayment> {
    const tapd = this.getTapd(opts.id);

    const stream = tapd.channels.sendPayment({
      ...(opts.groupKey
        ? { groupKey: Buffer.from(opts.groupKey, 'hex') }
        : { assetId: Buffer.from(opts.assetId || '', 'hex') }),
      ...(opts.assetAmount ? { assetAmount: opts.assetAmount } : {}),
      ...(opts.peerPubkey
        ? { peerPubkey: Buffer.from(opts.peerPubkey, 'hex') }
        : {}),
      allowOverpay: true,
      priceOracleMetadata: JSON.stringify({
        swapNodePubkey: opts.peerPubkey,
      }),
      paymentRequest: {
        paymentRequest: opts.paymentRequest,
        allowSelfPayment: true,
        feeLimitSat: '10',
        timeoutSeconds: 60,
      },
    });

    return new Promise<LnrpcPayment>((resolve, reject) => {
      let finalPayment: LnrpcPayment | null = null;

      stream.on(
        'data',
        (response: {
          result?: string;
          paymentResult?: LnrpcPayment | null;
        }) => {
          if (response.result === 'paymentResult' && response.paymentResult) {
            finalPayment = response.paymentResult;
          }
        }
      );

      stream.on('end', () => {
        if (finalPayment) {
          if (finalPayment.status === 'SUCCEEDED') {
            resolve(finalPayment);
          } else {
            reject(
              new Error(
                `Asset payment failed with status: ${finalPayment.status}`
              )
            );
          }
        } else {
          reject(new Error('Asset payment stream ended without a result'));
        }
      });

      stream.on('error', (err: Error) => {
        reject(err);
      });
    });
  }

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
