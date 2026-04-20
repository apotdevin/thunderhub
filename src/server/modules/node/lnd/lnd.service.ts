import { Injectable } from '@nestjs/common';
import {
  diffieHellmanComputeSecret,
  getWalletInfo,
  getClosedChannels,
  getPendingChannels,
  getHeight,
  getNode,
  getChannels,
  getChainBalance,
  getPendingChainBalance,
  getChannelBalance,
  getWalletVersion,
  verifyBackup,
  verifyBackups,
  recoverFundsFromChannels,
  getBackups,
  verifyMessage,
  signMessage,
  grantAccess,
  getAccessIds,
  getNetworkInfo,
  getPeers,
  addPeer,
  getChainTransactions,
  getUtxos,
  createChainAddress,
  sendToChainAddress,
  decodePaymentRequest,
  pay,
  payViaPaymentDetails,
  payViaRoutes,
  createInvoice,
  getChannel,
  closeChannel,
  openChannel,
  updateRoutingFees,
  getForwards,
  getPayments,
  getInvoices,
  subscribeToInvoice,
  removePeer,
  getIdentity,
  authenticatedLndGrpc,
  AuthenticatedLnd,
} from 'lightning';
import { to } from './lnd.helpers';
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
  PayViaRoutesOptions,
  SendToChainAddressOptions,
  CreateChainAddressFormat,
  UpdateRoutingFeesOptions,
  VerifyBackupsOptions,
  GrantAccessOptions,
  BakeMacaroonOptions,
  BakeMacaroonResult,
  DiffieHellmanComputeSecretOptions,
} from '../lightning.types';

@Injectable()
export class LndService implements LightningProvider {
  getCapabilities(): Set<Capability> {
    const caps = new Set(Object.values(Capability));
    caps.delete(Capability.TAPROOT_ASSETS);
    return caps;
  }

  connect(config: {
    socket: string;
    cert?: string;
    macaroon?: string;
  }): AuthenticatedLnd {
    const { lnd } = authenticatedLndGrpc({
      socket: config.socket,
      cert: config.cert,
      macaroon: config.macaroon,
    });
    return lnd;
  }

  async verifyConnection(lnd: AuthenticatedLnd): Promise<void> {
    await to(getWalletInfo({ lnd }));
  }

  getSubscriptionConnection(connection: AuthenticatedLnd): AuthenticatedLnd {
    return connection;
  }

  async getWalletInfo(lnd: AuthenticatedLnd) {
    return to(getWalletInfo({ lnd }));
  }

  async getIdentity(lnd: AuthenticatedLnd) {
    return to(getIdentity({ lnd }));
  }

  async getWalletVersion(lnd: AuthenticatedLnd) {
    return to(getWalletVersion({ lnd }));
  }

  async getHeight(lnd: AuthenticatedLnd) {
    return to(getHeight({ lnd }));
  }

  async getClosedChannels(lnd: AuthenticatedLnd) {
    return to(getClosedChannels({ lnd }));
  }

  async getPendingChannels(lnd: AuthenticatedLnd) {
    return to(getPendingChannels({ lnd }));
  }

  async getChannels(lnd: AuthenticatedLnd, options?: GetChannelsOptions) {
    return to(getChannels({ lnd, ...options }));
  }

  async getChannelBalance(lnd: AuthenticatedLnd) {
    return to(getChannelBalance({ lnd }));
  }

  async getChainBalance(lnd: AuthenticatedLnd) {
    return to(getChainBalance({ lnd }));
  }

  async getPendingChainBalance(lnd: AuthenticatedLnd) {
    return to(getPendingChainBalance({ lnd }));
  }

  async getNode(
    lnd: AuthenticatedLnd,
    public_key: string,
    is_omitting_channels = true
  ) {
    return to(getNode({ lnd, public_key, is_omitting_channels }));
  }

  async verifyBackup(lnd: AuthenticatedLnd, backup: string) {
    return to<{ is_valid: boolean }>(verifyBackup({ lnd, backup }));
  }

  async verifyBackups(lnd: AuthenticatedLnd, args: VerifyBackupsOptions) {
    return to(verifyBackups({ lnd, ...args }));
  }

  async recoverFundsFromChannels(lnd: AuthenticatedLnd, backup: string) {
    return to(recoverFundsFromChannels({ lnd, backup }));
  }

  async getBackups(lnd: AuthenticatedLnd) {
    return to(getBackups({ lnd }));
  }

  async verifyMessage(
    lnd: AuthenticatedLnd,
    message: string,
    signature: string
  ) {
    return to(verifyMessage({ lnd, message, signature }));
  }

  async signMessage(lnd: AuthenticatedLnd, message: string) {
    return to(signMessage({ lnd, message }));
  }

  async grantAccess(lnd: AuthenticatedLnd, permissions: GrantAccessOptions) {
    return to(grantAccess({ lnd, ...permissions }));
  }

  async getAccessIds(lnd: AuthenticatedLnd) {
    return to(getAccessIds({ lnd }));
  }

  async bakeMacaroon(
    lnd: AuthenticatedLnd,
    options: BakeMacaroonOptions
  ): Promise<BakeMacaroonResult> {
    return new Promise((resolve, reject) => {
      (lnd as any).default.bakeMacaroon(
        {
          permissions: options.permissions,
          root_key_id: options.root_key_id || undefined,
          allow_external_permissions: options.allow_external_permissions,
        },
        (err: any, res: any) => {
          if (err) {
            return reject(new Error(err.details || 'Failed to bake macaroon'));
          }

          if (!res?.macaroon) {
            return reject(new Error('No macaroon returned'));
          }

          const macaroon = Buffer.from(res.macaroon, 'hex').toString('base64');

          return resolve({ macaroon });
        }
      );
    });
  }

  async getNetworkInfo(lnd: AuthenticatedLnd) {
    return to(getNetworkInfo({ lnd }));
  }

  async getPeers(lnd: AuthenticatedLnd) {
    return to(getPeers({ lnd }));
  }

  async addPeer(
    lnd: AuthenticatedLnd,
    public_key: string,
    socket: string,
    is_temporary: boolean
  ) {
    return to(addPeer({ lnd, public_key, socket, is_temporary }));
  }

  async removePeer(lnd: AuthenticatedLnd, public_key: string) {
    return to(removePeer({ lnd, public_key }));
  }

  async getChainTransactions(lnd: AuthenticatedLnd) {
    return to(getChainTransactions({ lnd }));
  }

  async getUtxos(lnd: AuthenticatedLnd) {
    return to(getUtxos({ lnd }));
  }

  async createChainAddress(
    lnd: AuthenticatedLnd,
    is_unused: boolean,
    format: CreateChainAddressFormat
  ) {
    return to(createChainAddress({ lnd, is_unused, format }));
  }

  async sendToChainAddress(
    lnd: AuthenticatedLnd,
    options: SendToChainAddressOptions
  ) {
    return to(
      sendToChainAddress({
        lnd,
        ...options,
      } as any)
    );
  }

  async diffieHellmanComputeSecret(
    lnd: AuthenticatedLnd,
    options: DiffieHellmanComputeSecretOptions
  ) {
    return to(diffieHellmanComputeSecret({ lnd, ...options }));
  }

  async decodePaymentRequest(lnd: AuthenticatedLnd, request: string) {
    return to(decodePaymentRequest({ lnd, request }));
  }

  async pay(lnd: AuthenticatedLnd, options: PayOptions) {
    return to(pay({ lnd, ...options } as any));
  }

  async createInvoice(lnd: AuthenticatedLnd, options: CreateInvoiceOptions) {
    return to(createInvoice({ lnd, ...options } as any));
  }

  async getChannel(lnd: AuthenticatedLnd, id: string) {
    return to(getChannel({ lnd, id }));
  }

  async closeChannel(lnd: AuthenticatedLnd, options: CloseChannelOptions) {
    return to(closeChannel({ lnd, ...options } as any));
  }

  async openChannel(lnd: AuthenticatedLnd, options: OpenChannelOptions) {
    return to(openChannel({ lnd, ...options } as any));
  }

  async updateRoutingFees(
    lnd: AuthenticatedLnd,
    options: UpdateRoutingFeesOptions
  ) {
    return to(updateRoutingFees({ lnd, ...options } as any));
  }

  async getForwards(lnd: AuthenticatedLnd, options: GetForwardsOptions) {
    return to(getForwards({ lnd, ...options } as any));
  }

  async getPayments(lnd: AuthenticatedLnd, options: GetPaymentsOptions) {
    return to(getPayments({ lnd, ...options } as any));
  }

  async getInvoices(lnd: AuthenticatedLnd, options: GetInvoicesOptions) {
    return to(getInvoices({ lnd, ...options } as any));
  }

  async payViaPaymentDetails(
    lnd: AuthenticatedLnd,
    options: PayViaPaymentDetailsOptions
  ) {
    return to(payViaPaymentDetails({ lnd, ...options } as any));
  }

  // Intentionally not wrapped in to() — callers need the raw [code, message,
  // {failures}] array that payViaRoutes throws on failure for diagnostics.
  async payViaRoutes(lnd: AuthenticatedLnd, options: PayViaRoutesOptions) {
    return payViaRoutes({ lnd, ...options } as any);
  }

  subscribeToInvoice(lnd: AuthenticatedLnd, id: string): EventEmitter {
    return subscribeToInvoice({ lnd, id });
  }
}
