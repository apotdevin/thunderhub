import { Injectable } from '@nestjs/common';
import {
  getPeerSwapClient,
  listSwaps,
  listPeers,
  swapIn,
  swapOut,
  liquidGetBalance,
} from '@vilm3r/peerswap-client';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class PeerSwapService {
  constructor(private accountsService: AccountsService) {}

  getClient(id: string) {
    const account = this.accountsService.getAccount(id);
    if (!account?.peerSwapSocket)
      throw new Error('Peerswap socket entry missing or invalid');
    return getPeerSwapClient({ socket: account.peerSwapSocket });
  }

  async getSwaps(id: string) {
    return listSwaps(this.getClient(id));
  }

  async getPeers(id: string) {
    return listPeers(this.getClient(id));
  }

  async createSwap(id: string, { amount, asset, channelId, type }) {
    return type === 'swap_in'
      ? swapIn(this.getClient(id), channelId, amount, asset)
      : swapOut(this.getClient(id), channelId, amount, asset);
  }

  async getLiquidBalance(id: string) {
    try {
      return (await liquidGetBalance(this.getClient(id))).satAmount || null;
    } catch (ex) {
      return null;
    }
  }
}
