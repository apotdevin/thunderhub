import { Injectable } from '@nestjs/common';
import {
  BackupChannel,
  CloseChannel,
  CloseChannelParams,
  CreateInvoiceParams,
  CreateInvoiceType,
  DecodedType,
  DiffieHellmanComputeSecretParams,
  DiffieHellmanComputeSecretResult,
  GetChainBalanceType,
  GetChainTransactionsType,
  GetChannelBalanceType,
  GetChannelsParams,
  GetChannelsType,
  GetChannelType,
  GetClosedChannelsType,
  GetForwards,
  GetForwardsParams,
  GetInvoices,
  GetNodeType,
  GetPayments,
  GetPaymentsParams,
  GetPeers,
  GetPendingChainBalanceType,
  GetPendingChannelsType,
  GetUtxosType,
  GetWalletInfoType,
  GrantAccess,
  NetworkInfo,
  OpenChannel,
  OpenChannelParams,
  PayInvoiceParams,
  PayInvoiceType,
  PayViaPaymentDetailsParams,
  Permissions,
  SendToChainAddressType,
  SendToChainParams,
  SignMessage,
  UpdateRoutingFees,
  UpdateRoutingFeesParams,
  VerifyMessage,
} from './lnd.types';
import {
  diffieHellmanComputeSecret,
  getWalletInfo,
  getClosedChannels,
  getPendingChannels,
  getNode,
  getChannels,
  getChainBalance,
  getPendingChainBalance,
  getChannelBalance,
  getWalletVersion,
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
} from 'ln-service';
import { EnrichedAccount } from '../../accounts/accounts.types';
import { to } from './lnd.helpers';
import EventEmitter from 'events';

@Injectable()
export class LndService {
  async getWalletInfo(account: EnrichedAccount) {
    return to<GetWalletInfoType>(
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

  async getClosedChannels(account: EnrichedAccount) {
    return to<GetClosedChannelsType>(
      getClosedChannels({
        lnd: account.lnd,
      })
    );
  }

  async getPendingChannels(account: EnrichedAccount) {
    return to<GetPendingChannelsType>(
      getPendingChannels({
        lnd: account.lnd,
      })
    );
  }

  async getChannels(account: EnrichedAccount, options?: GetChannelsParams) {
    return to<GetChannelsType>(
      getChannels({
        lnd: account.lnd,
        ...options,
      })
    );
  }

  async getChannelBalance(account: EnrichedAccount) {
    return to<GetChannelBalanceType>(
      getChannelBalance({
        lnd: account.lnd,
      })
    );
  }

  async getChainBalance(account: EnrichedAccount) {
    return to<GetChainBalanceType>(
      getChainBalance({
        lnd: account.lnd,
      })
    );
  }

  async getPendingChainBalance(account: EnrichedAccount) {
    return to<GetPendingChainBalanceType>(
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
    return to<GetNodeType>(
      getNode({
        lnd: account.lnd,
        public_key,
        is_omitting_channels,
      })
    );
  }

  async verifyBackups(
    account: EnrichedAccount,
    backup: string,
    channels: BackupChannel[]
  ) {
    return to<{ is_valid: boolean }>(
      verifyBackups({
        lnd: account.lnd,
        backup,
        channels,
      })
    );
  }

  async recoverFundsFromChannels(account: EnrichedAccount, backup: string) {
    return to<void>(
      recoverFundsFromChannels({
        lnd: account.lnd,
        backup,
      })
    );
  }

  async getBackups(account: EnrichedAccount) {
    return to<{ backup: string; channels: BackupChannel[] }>(
      getBackups({ lnd: account.lnd })
    );
  }

  async verifyMessage(
    account: EnrichedAccount,
    message: string,
    signature: string
  ) {
    return to<VerifyMessage>(
      verifyMessage({ lnd: account.lnd, message, signature })
    );
  }

  async signMessage(account: EnrichedAccount, message: string) {
    return to<SignMessage>(signMessage({ lnd: account.lnd, message }));
  }

  async grantAccess(account: EnrichedAccount, permissions: Permissions) {
    return to<GrantAccess>(grantAccess({ lnd: account.lnd, ...permissions }));
  }

  async getNetworkInfo(account: EnrichedAccount) {
    return to<NetworkInfo>(getNetworkInfo({ lnd: account.lnd }));
  }

  async getPeers(account: EnrichedAccount) {
    return to<GetPeers>(getPeers({ lnd: account.lnd }));
  }

  async addPeer(
    account: EnrichedAccount,
    public_key: string,
    socket: string,
    is_temporary: boolean
  ) {
    return to<void>(
      addPeer({ lnd: account.lnd, public_key, socket, is_temporary })
    );
  }

  async removePeer(account: EnrichedAccount, public_key: string) {
    return to<void>(getPeers({ lnd: account.lnd, public_key }));
  }

  async getChainTransactions(account: EnrichedAccount) {
    return to<GetChainTransactionsType>(
      getChainTransactions({ lnd: account.lnd })
    );
  }

  async getUtxos(account: EnrichedAccount) {
    return to<GetUtxosType>(getUtxos({ lnd: account.lnd }));
  }

  async createChainAddress(
    account: EnrichedAccount,
    is_unused: boolean,
    format: string
  ) {
    return to<{ address: string }>(
      createChainAddress({
        lnd: account.lnd,
        is_unused,
        format,
      })
    );
  }

  async sendToChainAddress(
    account: EnrichedAccount,
    options: SendToChainParams
  ) {
    return to<SendToChainAddressType>(
      sendToChainAddress({ lnd: account.lnd, ...options })
    );
  }

  async diffieHellmanComputeSecret(
    account: EnrichedAccount,
    options: DiffieHellmanComputeSecretParams
  ) {
    return to<DiffieHellmanComputeSecretResult>(
      diffieHellmanComputeSecret({ lnd: account.lnd, ...options })
    );
  }

  async decodePaymentRequest(account: EnrichedAccount, request: string) {
    return to<DecodedType>(decodePaymentRequest({ lnd: account.lnd, request }));
  }

  async pay(account: EnrichedAccount, options: PayInvoiceParams) {
    return to<PayInvoiceType>(pay({ lnd: account.lnd, ...options }));
  }

  async createInvoice(account: EnrichedAccount, options: CreateInvoiceParams) {
    return to<CreateInvoiceType>(
      createInvoice({ lnd: account.lnd, ...options })
    );
  }

  async getChannel(account: EnrichedAccount, id: string) {
    return to<GetChannelType>(getChannel({ lnd: account.lnd, id }));
  }

  async closeChannel(account: EnrichedAccount, options: CloseChannelParams) {
    return to<CloseChannel>(closeChannel({ lnd: account.lnd, ...options }));
  }

  async openChannel(account: EnrichedAccount, options: OpenChannelParams) {
    return to<OpenChannel>(openChannel({ lnd: account.lnd, ...options }));
  }

  async updateRoutingFees(
    account: EnrichedAccount,
    options: UpdateRoutingFeesParams
  ) {
    return to<UpdateRoutingFees>(
      updateRoutingFees({ lnd: account.lnd, ...options })
    );
  }

  async getForwards(account: EnrichedAccount, options: GetForwardsParams) {
    return to<GetForwards>(getForwards({ lnd: account.lnd, ...options }));
  }

  async getPayments(account: EnrichedAccount, options: GetPaymentsParams) {
    return to<GetPayments>(getPayments({ lnd: account.lnd, ...options }));
  }

  async getInvoices(account: EnrichedAccount, options: GetPaymentsParams) {
    return to<GetInvoices>(getInvoices({ lnd: account.lnd, ...options }));
  }

  async payViaPaymentDetails(
    account: EnrichedAccount,
    options: PayViaPaymentDetailsParams
  ) {
    return to<PayInvoiceType>(
      payViaPaymentDetails({ lnd: account.lnd, ...options })
    );
  }

  subscribeToInvoice(account: EnrichedAccount, id: string): EventEmitter {
    return subscribeToInvoice({ lnd: account.lnd, id });
  }
}
