import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import EventEmitter from 'events';
import { subscribeToChannels } from 'lightning';
import { AccountsService } from '../accounts/accounts.service';
import { toWithError } from '../../utils/async';
import { ProviderRegistryService } from './provider-registry.service';
import { EnrichedAccount } from '../accounts/accounts.types';
import { LightningProvider } from './lightning.types';
import {
  CloseChannelOptions,
  CreateChainAddressFormat,
  CreateInvoiceOptions,
  DiffieHellmanComputeSecretOptions,
  GetChannelsOptions,
  GetForwardsOptions,
  GetInvoicesOptions,
  GetPaymentsOptions,
  GrantAccessOptions,
  OpenChannelOptions,
  PayOptions,
  PayViaPaymentDetailsOptions,
  SendToChainAddressOptions,
  UpdateRoutingFeesOptions,
  VerifyBackupsOptions,
} from './lightning.types';

@Injectable()
export class NodeService {
  constructor(
    private accountsService: AccountsService,
    private providerRegistry: ProviderRegistryService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  private getAccountAndProvider(id: string): {
    account: EnrichedAccount;
    provider: LightningProvider;
  } {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    const provider = this.providerRegistry.getProvider(account.type);
    return { account, provider };
  }

  getCapabilities(id: string): Set<string> {
    const { provider } = this.getAccountAndProvider(id);
    return provider.getCapabilities();
  }

  async getWalletInfo(id: string) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.getWalletInfo(account.connection);
  }

  async getWalletVersion(id: string) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.getWalletVersion(account.connection);
  }

  async getHeight(id: string) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.getHeight(account.connection);
  }

  async getClosedChannels(id: string) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.getClosedChannels(account.connection);
  }

  async getPendingChannels(id: string) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.getPendingChannels(account.connection);
  }

  async getChannels(id: string, options?: GetChannelsOptions) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.getChannels(account.connection, options);
  }

  async getChannelBalance(id: string) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.getChannelBalance(account.connection);
  }

  async getChainBalance(id: string) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.getChainBalance(account.connection);
  }

  async getPendingChainBalance(id: string) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.getPendingChainBalance(account.connection);
  }

  async getNode(id: string, pubkey: string, withoutChannels: boolean) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.getNode(account.connection, pubkey, withoutChannels);
  }

  async verifyBackup(id: string, backup: string) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.verifyBackup(account.connection, backup);
  }

  async verifyBackups(id: string, args: VerifyBackupsOptions) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.verifyBackups(account.connection, args);
  }

  async recoverFundsFromChannels(id: string, backup: string) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.recoverFundsFromChannels(account.connection, backup);
  }

  async getBackups(id: string) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.getBackups(account.connection);
  }

  async verifyMessage(id: string, message: string, signature: string) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.verifyMessage(account.connection, message, signature);
  }

  async signMessage(id: string, message: string) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.signMessage(account.connection, message);
  }

  async grantAccess(id: string, permissions: GrantAccessOptions) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.grantAccess(account.connection, permissions);
  }

  async getNetworkInfo(id: string) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.getNetworkInfo(account.connection);
  }

  async getPeers(id: string) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.getPeers(account.connection);
  }

  async addPeer(
    id: string,
    public_key: string,
    socket: string,
    is_temporary: boolean
  ) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.addPeer(
      account.connection,
      public_key,
      socket,
      is_temporary
    );
  }

  async removePeer(id: string, public_key: string) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.removePeer(account.connection, public_key);
  }

  async getChainTransactions(id: string) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.getChainTransactions(account.connection);
  }

  async getUtxos(id: string) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.getUtxos(account.connection);
  }

  async createChainAddress(
    id: string,
    is_unused = true,
    format: CreateChainAddressFormat = 'p2wpkh'
  ) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.createChainAddress(account.connection, is_unused, format);
  }

  async sendToChainAddress(id: string, options: SendToChainAddressOptions) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.sendToChainAddress(account.connection, options);
  }

  async diffieHellmanComputeSecret(
    id: string,
    options: DiffieHellmanComputeSecretOptions
  ) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.diffieHellmanComputeSecret(account.connection, options);
  }

  async decodePaymentRequest(id: string, request: string) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.decodePaymentRequest(account.connection, request);
  }

  async pay(id: string, options: PayOptions) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.pay(account.connection, options);
  }

  async createInvoice(id: string, options: CreateInvoiceOptions) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.createInvoice(account.connection, options);
  }

  async getChannel(id: string, channel_id: string) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.getChannel(account.connection, channel_id);
  }

  async closeChannel(id: string, options: CloseChannelOptions) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.closeChannel(account.connection, options);
  }

  async openChannel(id: string, options: OpenChannelOptions) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.openChannel(account.connection, options);
  }

  async updateRoutingFees(id: string, options: UpdateRoutingFeesOptions) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.updateRoutingFees(account.connection, options);
  }

  async getForwards(id: string, options: GetForwardsOptions) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.getForwards(account.connection, options);
  }

  async getPayments(id: string, options: GetPaymentsOptions) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.getPayments(account.connection, options);
  }

  async getInvoices(id: string, options: GetInvoicesOptions) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.getInvoices(account.connection, options);
  }

  async payViaPaymentDetails(id: string, options: PayViaPaymentDetailsOptions) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.payViaPaymentDetails(account.connection, options);
  }

  subscribeToInvoice(id: string, invoice: string): EventEmitter {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.subscribeToInvoice(account.connection, invoice);
  }

  async getIdentity(id: string) {
    const { account, provider } = this.getAccountAndProvider(id);
    return provider.getIdentity(account.connection);
  }

  /**
   * Resolves as soon as LND reports a pending channel opening (channel_opening
   * event) from the given peer. Used to detect Magma inbound channels without
   * waiting for on-chain confirmation.
   *
   * Rejects after `timeoutMs` if no channel from the peer appears.
   */
  waitForChannelFromPeer(
    id: string,
    partnerPubkey: string,
    timeoutMs: number
  ): Promise<void> {
    const { account, provider } = this.getAccountAndProvider(id);
    const lnd = provider.getSubscriptionConnection(account.connection);

    return new Promise<void>((resolve, reject) => {
      let done = false;

      const finish = (err?: Error) => {
        if (done) return;
        done = true;
        sub.removeAllListeners();
        (sub as { destroy?: () => void }).destroy?.();
        clearTimeout(timer);
        if (err) reject(err);
        else resolve();
      };

      const timer = setTimeout(
        () => finish(new Error('Timed out waiting for channel from peer')),
        timeoutMs
      );

      const sub = subscribeToChannels({ lnd });

      sub.on('channel_opening', async () => {
        const [result, err] = await toWithError(
          provider.getPendingChannels(account.connection)
        );

        if (err || !result) {
          this.logger.warn(
            'getPendingChannels failed during channel_opening check',
            { err }
          );
          return;
        }

        const isPeerOpening = result.pending_channels.some(
          ch => ch.is_opening && ch.partner_public_key === partnerPubkey
        );

        if (isPeerOpening) finish();
      });

      sub.on('error', (err: Error) => finish(err));
    });
  }
}
