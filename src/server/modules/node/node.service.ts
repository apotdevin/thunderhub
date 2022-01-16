import { Injectable } from '@nestjs/common';
import EventEmitter from 'events';
import { AccountsService } from '../accounts/accounts.service';
import { LndService } from './lnd/lnd.service';
import {
  BackupChannel,
  CloseChannelParams,
  CreateInvoiceParams,
  DiffieHellmanComputeSecretParams,
  GetChannelsParams,
  GetForwardsParams,
  GetPaymentsParams,
  OpenChannelParams,
  PayInvoiceParams,
  PayViaPaymentDetailsParams,
  Permissions,
  SendToChainParams,
  UpdateRoutingFeesParams,
} from './lnd/lnd.types';

@Injectable()
export class NodeService {
  constructor(
    private accountsService: AccountsService,
    private lndService: LndService
  ) {}

  async getWalletInfo(id: string) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.getWalletInfo(account);
  }

  async getWalletVersion(id: string) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.getWalletVersion(account);
  }

  async getHeight(id: string) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.getHeight(account);
  }

  async getClosedChannels(id: string) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.getClosedChannels(account);
  }

  async getPendingChannels(id: string) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.getPendingChannels(account);
  }

  async getChannels(id: string, options?: GetChannelsParams) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.getChannels(account, options);
  }

  async getChannelBalance(id: string) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.getChannelBalance(account);
  }

  async getChainBalance(id: string) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.getChainBalance(account);
  }

  async getPendingChainBalance(id: string) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.getPendingChainBalance(account);
  }

  async getNode(id: string, pubkey: string, withoutChannels: boolean) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.getNode(account, pubkey, withoutChannels);
  }

  async verifyBackups(id: string, backup: string, channels: BackupChannel[]) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.verifyBackups(account, backup, channels);
  }

  async recoverFundsFromChannels(id: string, backup: string) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.recoverFundsFromChannels(account, backup);
  }

  async getBackups(id: string) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.getBackups(account);
  }

  async verifyMessage(id: string, message: string, signature: string) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.verifyMessage(account, message, signature);
  }

  async signMessage(id: string, message: string) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.signMessage(account, message);
  }

  async grantAccess(id: string, permissions: Permissions) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.grantAccess(account, permissions);
  }

  async getNetworkInfo(id: string) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.getNetworkInfo(account);
  }

  async getPeers(id: string) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.getPeers(account);
  }

  async addPeer(
    id: string,
    public_key: string,
    socket: string,
    is_temporary: boolean
  ) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.addPeer(account, public_key, socket, is_temporary);
  }

  async removePeer(id: string, public_key: string) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.removePeer(account, public_key);
  }

  async getChainTransactions(id: string) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.getChainTransactions(account);
  }

  async getUtxos(id: string) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.getUtxos(account);
  }

  async createChainAddress(id: string, is_unused = true, format = 'p2wpkh') {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.createChainAddress(account, is_unused, format);
  }

  async sendToChainAddress(id: string, options: SendToChainParams) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.sendToChainAddress(account, options);
  }

  async diffieHellmanComputeSecret(
    id: string,
    options: DiffieHellmanComputeSecretParams
  ) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.diffieHellmanComputeSecret(account, options);
  }

  async decodePaymentRequest(id: string, request: string) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.decodePaymentRequest(account, request);
  }

  async pay(id: string, options: PayInvoiceParams) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.pay(account, options);
  }

  async createInvoice(id: string, options: CreateInvoiceParams) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.createInvoice(account, options);
  }

  async getChannel(id: string, channel_id: string) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.getChannel(account, channel_id);
  }

  async closeChannel(id: string, options: CloseChannelParams) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.closeChannel(account, options);
  }

  async openChannel(id: string, options: OpenChannelParams) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.openChannel(account, options);
  }

  async updateRoutingFees(id: string, options: UpdateRoutingFeesParams) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.updateRoutingFees(account, options);
  }

  async getForwards(id: string, options: GetForwardsParams) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.getForwards(account, options);
  }

  async getPayments(id: string, options: GetPaymentsParams) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.getPayments(account, options);
  }

  async getInvoices(id: string, options: GetPaymentsParams) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.getInvoices(account, options);
  }

  async payViaPaymentDetails(id: string, options: PayViaPaymentDetailsParams) {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.payViaPaymentDetails(account, options);
  }

  subscribeToInvoice(id: string, invoice: string): EventEmitter {
    const account = this.accountsService.getAccount(id);
    if (!account) throw new Error('Node account not found');
    return this.lndService.subscribeToInvoice(account, invoice);
  }
}
