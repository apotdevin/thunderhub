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
  GetChannelsArgs,
  VerifyBackupsArgs,
  SendToChainAddressArgs,
  DiffieHellmanComputeSecretArgs,
  PayArgs,
  CreateInvoiceArgs,
  CloseChannelArgs,
  OpenChannelArgs,
  UpdateRoutingFeesArgs,
  GetForwardsArgs,
  PayViaPaymentDetailsArgs,
  GetPaymentsArgs,
  GrantAccessArgs,
  GetInvoicesArgs,
  CreateChainAddressArgs,
} from 'lightning';
import { EnrichedAccount } from '../../accounts/accounts.types';
import { to } from './lnd.helpers';
import EventEmitter from 'events';

@Injectable()
export class LndService {
  async getWalletInfo(account: EnrichedAccount) {
    return to(
      getWalletInfo({
        lnd: account.lnd,
      })
    );
  }

  async getWalletVersion(account: EnrichedAccount) {
    return to(
      getWalletVersion({
        lnd: account.lnd,
      })
    );
  }

  async getHeight(account: EnrichedAccount) {
    return to(
      getHeight({
        lnd: account.lnd,
      })
    );
  }

  async getClosedChannels(account: EnrichedAccount) {
    return to(
      getClosedChannels({
        lnd: account.lnd,
      })
    );
  }

  async getPendingChannels(account: EnrichedAccount) {
    return to(
      getPendingChannels({
        lnd: account.lnd,
      })
    );
  }

  async getChannels(
    account: EnrichedAccount,
    options?: Omit<GetChannelsArgs, 'lnd'>
  ) {
    return to(
      getChannels({
        lnd: account.lnd,
        ...options,
      })
    );
  }

  async getChannelBalance(account: EnrichedAccount) {
    return to(
      getChannelBalance({
        lnd: account.lnd,
      })
    );
  }

  async getChainBalance(account: EnrichedAccount) {
    return to(
      getChainBalance({
        lnd: account.lnd,
      })
    );
  }

  async getPendingChainBalance(account: EnrichedAccount) {
    return to(
      getPendingChainBalance({
        lnd: account.lnd,
      })
    );
  }

  async getNode(
    account: EnrichedAccount,
    public_key: string,
    is_omitting_channels = true
  ) {
    return to(
      getNode({
        lnd: account.lnd,
        public_key,
        is_omitting_channels,
      })
    );
  }

  async verifyBackup(account: EnrichedAccount, backup: string) {
    const result = await to<{ is_valid: boolean }>(
      verifyBackup({
        lnd: account.lnd,
        backup,
      })
    );
    console.log(result);
    return result;
  }

  async verifyBackups(
    account: EnrichedAccount,
    args: Omit<VerifyBackupsArgs, 'lnd'>
  ) {
    return to(
      verifyBackups({
        lnd: account.lnd,
        ...args,
      })
    );
  }

  async recoverFundsFromChannels(account: EnrichedAccount, backup: string) {
    return to(
      recoverFundsFromChannels({
        lnd: account.lnd,
        backup,
      })
    );
  }

  async getBackups(account: EnrichedAccount) {
    return to(getBackups({ lnd: account.lnd }));
  }

  async verifyMessage(
    account: EnrichedAccount,
    message: string,
    signature: string
  ) {
    return to(verifyMessage({ lnd: account.lnd, message, signature }));
  }

  async signMessage(account: EnrichedAccount, message: string) {
    return to(signMessage({ lnd: account.lnd, message }));
  }

  async grantAccess(
    account: EnrichedAccount,
    permissions: Omit<GrantAccessArgs, 'lnd'>
  ) {
    return to(grantAccess({ lnd: account.lnd, ...permissions }));
  }

  async getNetworkInfo(account: EnrichedAccount) {
    return to(getNetworkInfo({ lnd: account.lnd }));
  }

  async getPeers(account: EnrichedAccount) {
    return to(getPeers({ lnd: account.lnd }));
  }

  async addPeer(
    account: EnrichedAccount,
    public_key: string,
    socket: string,
    is_temporary: boolean
  ) {
    return to(addPeer({ lnd: account.lnd, public_key, socket, is_temporary }));
  }

  async removePeer(account: EnrichedAccount, public_key: string) {
    return to(removePeer({ lnd: account.lnd, public_key }));
  }

  async getChainTransactions(account: EnrichedAccount) {
    return to(getChainTransactions({ lnd: account.lnd }));
  }

  async getUtxos(account: EnrichedAccount) {
    return to(getUtxos({ lnd: account.lnd }));
  }

  async createChainAddress(
    account: EnrichedAccount,
    is_unused: boolean,
    format: CreateChainAddressArgs['format']
  ) {
    return to(
      createChainAddress({
        lnd: account.lnd,
        is_unused,
        format,
      })
    );
  }

  async sendToChainAddress(
    account: EnrichedAccount,
    options: Omit<SendToChainAddressArgs, 'lnd'>
  ) {
    return to(
      sendToChainAddress({
        lnd: account.lnd,
        ...(options as SendToChainAddressArgs),
      })
    );
  }

  async diffieHellmanComputeSecret(
    account: EnrichedAccount,
    options: Omit<DiffieHellmanComputeSecretArgs, 'lnd'>
  ) {
    return to(diffieHellmanComputeSecret({ lnd: account.lnd, ...options }));
  }

  async decodePaymentRequest(account: EnrichedAccount, request: string) {
    return to(decodePaymentRequest({ lnd: account.lnd, request }));
  }

  async pay(account: EnrichedAccount, options: Omit<PayArgs, 'lnd'>) {
    return to(pay({ lnd: account.lnd, ...options }));
  }

  async createInvoice(
    account: EnrichedAccount,
    options: Omit<CreateInvoiceArgs, 'lnd'>
  ) {
    return to(createInvoice({ lnd: account.lnd, ...options }));
  }

  async getChannel(account: EnrichedAccount, id: string) {
    return to(getChannel({ lnd: account.lnd, id }));
  }

  async closeChannel(
    account: EnrichedAccount,
    options: Omit<CloseChannelArgs, 'lnd'>
  ) {
    return to(
      closeChannel({ lnd: account.lnd, ...(options as CloseChannelArgs) })
    );
  }

  async openChannel(
    account: EnrichedAccount,
    options: Omit<OpenChannelArgs, 'lnd'>
  ) {
    return to(openChannel({ lnd: account.lnd, ...options }));
  }

  async updateRoutingFees(
    account: EnrichedAccount,
    options: Omit<UpdateRoutingFeesArgs, 'lnd'>
  ) {
    return to(
      updateRoutingFees({
        lnd: account.lnd,
        ...(options as UpdateRoutingFeesArgs),
      })
    );
  }

  async getForwards(
    account: EnrichedAccount,
    options: Omit<GetForwardsArgs, 'lnd'>
  ) {
    return to(
      getForwards({ lnd: account.lnd, ...(options as GetForwardsArgs) })
    );
  }

  async getPayments(
    account: EnrichedAccount,
    options: Omit<GetPaymentsArgs, 'lnd'>
  ) {
    return to(
      getPayments({ lnd: account.lnd, ...(options as GetPaymentsArgs) })
    );
  }

  async getInvoices(
    account: EnrichedAccount,
    options: Omit<GetInvoicesArgs, 'lnd'>
  ) {
    return to(
      getInvoices({ lnd: account.lnd, ...(options as GetInvoicesArgs) })
    );
  }

  async payViaPaymentDetails(
    account: EnrichedAccount,
    options: Omit<PayViaPaymentDetailsArgs, 'lnd' | 'routes'>
  ) {
    return to(
      payViaPaymentDetails({
        lnd: account.lnd,
        ...(options as PayViaPaymentDetailsArgs),
      })
    );
  }

  subscribeToInvoice(account: EnrichedAccount, id: string): EventEmitter {
    return subscribeToInvoice({ lnd: account.lnd, id });
  }
}
