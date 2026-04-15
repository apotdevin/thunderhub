import { Inject, Injectable } from '@nestjs/common';
import { authenticatedLndGrpc } from 'lightning';
import { TapClient, TapdRpcApis } from '@lightningpolar/tapd-api';
import EventEmitter from 'events';
import {
  Capability,
  LightningProvider,
  GetChannelsOptions,
  GetForwardsOptions,
  GetPaymentsOptions,
  GetInvoicesOptions,
  CloseChannelOptions,
  OpenChannelOptions,
  PayOptions,
  CreateInvoiceOptions,
  PayViaPaymentDetailsOptions,
  SendToChainAddressOptions,
  CreateChainAddressFormat,
  UpdateRoutingFeesOptions,
  VerifyBackupsOptions,
  GrantAccessOptions,
  BakeMacaroonOptions,
  BakeMacaroonResult,
  DiffieHellmanComputeSecretOptions,
} from '../lightning.types';
import { LndService } from '../lnd/lnd.service';
import { TaprootAssetsProvider } from '../tapd/taproot-assets.types';
import { LitdConnection } from './litd.types';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class LitdService implements LightningProvider, TaprootAssetsProvider {
  constructor(
    private readonly lndService: LndService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  getCapabilities(): Set<Capability> {
    return new Set(Object.values(Capability));
  }

  connect(config: {
    socket: string;
    cert?: string;
    macaroon?: string;
    authToken?: string;
  }): LitdConnection {
    const { lnd } = authenticatedLndGrpc({
      socket: config.socket,
      cert: config.cert,
      macaroon: config.macaroon,
    });

    const tapd = TapClient.create({
      socket: config.socket,
      macaroon: config.macaroon || '',
      cert: config.cert,
    });

    return { lnd, tapd, mode: 'grpc' };
  }

  getTapd(connection: LitdConnection): TapdRpcApis {
    return connection.tapd;
  }

  async verifyConnection(connection: LitdConnection): Promise<void> {
    await this.lndService.verifyConnection(this.getLnd(connection));

    try {
      await connection.tapd.taprootAssets.listAssets({ includeSpent: false });
    } catch (error) {
      this.logger.error('Error connecting to TA node', { error });
      throw new Error(
        'Node does not appear to be a LiTD node. LND connected but Taproot Assets daemon is not reachable.'
      );
    }
  }

  getSubscriptionConnection(connection: LitdConnection) {
    return connection.lnd;
  }

  private getLnd(connection: LitdConnection) {
    return connection.lnd;
  }

  // ── Wallet ──

  async getWalletInfo(connection: LitdConnection) {
    return this.lndService.getWalletInfo(this.getLnd(connection));
  }

  async getIdentity(connection: LitdConnection) {
    return this.lndService.getIdentity(this.getLnd(connection));
  }

  async getWalletVersion(connection: LitdConnection) {
    return this.lndService.getWalletVersion(this.getLnd(connection));
  }

  async getHeight(connection: LitdConnection) {
    return this.lndService.getHeight(this.getLnd(connection));
  }

  // ── Channels ──

  async getChannels(connection: LitdConnection, options?: GetChannelsOptions) {
    return this.lndService.getChannels(this.getLnd(connection), options);
  }

  async getClosedChannels(connection: LitdConnection) {
    return this.lndService.getClosedChannels(this.getLnd(connection));
  }

  async getPendingChannels(connection: LitdConnection) {
    return this.lndService.getPendingChannels(this.getLnd(connection));
  }

  async getChannel(connection: LitdConnection, id: string) {
    return this.lndService.getChannel(this.getLnd(connection), id);
  }

  async openChannel(connection: LitdConnection, options: OpenChannelOptions) {
    return this.lndService.openChannel(this.getLnd(connection), options);
  }

  async closeChannel(connection: LitdConnection, options: CloseChannelOptions) {
    return this.lndService.closeChannel(this.getLnd(connection), options);
  }

  async getChannelBalance(connection: LitdConnection) {
    return this.lndService.getChannelBalance(this.getLnd(connection));
  }

  // ── Chain ──

  async getChainBalance(connection: LitdConnection) {
    return this.lndService.getChainBalance(this.getLnd(connection));
  }

  async getPendingChainBalance(connection: LitdConnection) {
    return this.lndService.getPendingChainBalance(this.getLnd(connection));
  }

  async getChainTransactions(connection: LitdConnection) {
    return this.lndService.getChainTransactions(this.getLnd(connection));
  }

  async getUtxos(connection: LitdConnection) {
    return this.lndService.getUtxos(this.getLnd(connection));
  }

  async createChainAddress(
    connection: LitdConnection,
    is_unused: boolean,
    format: CreateChainAddressFormat
  ) {
    return this.lndService.createChainAddress(
      this.getLnd(connection),
      is_unused,
      format
    );
  }

  async sendToChainAddress(
    connection: LitdConnection,
    options: SendToChainAddressOptions
  ) {
    return this.lndService.sendToChainAddress(this.getLnd(connection), options);
  }

  // ── Payments ──

  async pay(connection: LitdConnection, options: PayOptions) {
    return this.lndService.pay(this.getLnd(connection), options);
  }

  async payViaPaymentDetails(
    connection: LitdConnection,
    options: PayViaPaymentDetailsOptions
  ) {
    return this.lndService.payViaPaymentDetails(
      this.getLnd(connection),
      options
    );
  }

  async decodePaymentRequest(connection: LitdConnection, request: string) {
    return this.lndService.decodePaymentRequest(
      this.getLnd(connection),
      request
    );
  }

  async getPayments(connection: LitdConnection, options: GetPaymentsOptions) {
    return this.lndService.getPayments(this.getLnd(connection), options);
  }

  // ── Invoices ──

  async createInvoice(
    connection: LitdConnection,
    options: CreateInvoiceOptions
  ) {
    return this.lndService.createInvoice(this.getLnd(connection), options);
  }

  async getInvoices(connection: LitdConnection, options: GetInvoicesOptions) {
    return this.lndService.getInvoices(this.getLnd(connection), options);
  }

  subscribeToInvoice(connection: LitdConnection, id: string): EventEmitter {
    return this.lndService.subscribeToInvoice(this.getLnd(connection), id);
  }

  // ── Peers ──

  async getPeers(connection: LitdConnection) {
    return this.lndService.getPeers(this.getLnd(connection));
  }

  async addPeer(
    connection: LitdConnection,
    public_key: string,
    socket: string,
    is_temporary: boolean
  ) {
    return this.lndService.addPeer(
      this.getLnd(connection),
      public_key,
      socket,
      is_temporary
    );
  }

  async removePeer(connection: LitdConnection, public_key: string) {
    return this.lndService.removePeer(this.getLnd(connection), public_key);
  }

  // ── Forwards ──

  async getForwards(connection: LitdConnection, options: GetForwardsOptions) {
    return this.lndService.getForwards(this.getLnd(connection), options);
  }

  // ── Routing ──

  async updateRoutingFees(
    connection: LitdConnection,
    options: UpdateRoutingFeesOptions
  ) {
    return this.lndService.updateRoutingFees(this.getLnd(connection), options);
  }

  // ── Network ──

  async getNode(
    connection: LitdConnection,
    public_key: string,
    is_omitting_channels = true
  ) {
    return this.lndService.getNode(
      this.getLnd(connection),
      public_key,
      is_omitting_channels
    );
  }

  async getNetworkInfo(connection: LitdConnection) {
    return this.lndService.getNetworkInfo(this.getLnd(connection));
  }

  // ── Messages ──

  async signMessage(connection: LitdConnection, message: string) {
    return this.lndService.signMessage(this.getLnd(connection), message);
  }

  async verifyMessage(
    connection: LitdConnection,
    message: string,
    signature: string
  ) {
    return this.lndService.verifyMessage(
      this.getLnd(connection),
      message,
      signature
    );
  }

  // ── Backups ──

  async getBackups(connection: LitdConnection) {
    return this.lndService.getBackups(this.getLnd(connection));
  }

  async verifyBackup(connection: LitdConnection, backup: string) {
    return this.lndService.verifyBackup(this.getLnd(connection), backup);
  }

  async verifyBackups(connection: LitdConnection, args: VerifyBackupsOptions) {
    return this.lndService.verifyBackups(this.getLnd(connection), args);
  }

  async recoverFundsFromChannels(connection: LitdConnection, backup: string) {
    return this.lndService.recoverFundsFromChannels(
      this.getLnd(connection),
      backup
    );
  }

  // ── Access ──

  async grantAccess(
    connection: LitdConnection,
    permissions: GrantAccessOptions
  ) {
    return this.lndService.grantAccess(this.getLnd(connection), permissions);
  }

  async getAccessIds(connection: LitdConnection) {
    return this.lndService.getAccessIds(this.getLnd(connection));
  }

  async bakeMacaroon(
    connection: LitdConnection,
    options: BakeMacaroonOptions
  ): Promise<BakeMacaroonResult> {
    return this.lndService.bakeMacaroon(this.getLnd(connection), options);
  }

  // ── Crypto ──

  async diffieHellmanComputeSecret(
    connection: LitdConnection,
    options: DiffieHellmanComputeSecretOptions
  ) {
    return this.lndService.diffieHellmanComputeSecret(
      this.getLnd(connection),
      options
    );
  }
}
