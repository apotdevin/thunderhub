import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  getPeerSwapClient,
  listSwaps,
  listPeers,
  swapIn,
  swapOut,
  liquidGetBalance,
} from '@vilm3r/peerswap-client';

@Injectable()
export class PeerSwapService {
  constructor(private configService: ConfigService) {}

  client = getPeerSwapClient({
    socket: this.configService.get('peerswap.socket'),
  });

  async getSwaps() {
    return listSwaps(this.client);
  }

  async getPeers() {
    return listPeers(this.client);
  }

  async createSwap({ amount, asset, channelId, type }) {
    return type === 'swap_in'
      ? swapIn(this.client, channelId, amount, asset)
      : swapOut(this.client, channelId, amount, asset);
  }

  async getLiquidBalance() {
    try {
      return (await liquidGetBalance(this.client)).satAmount || null;
    } catch (ex) {
      return null;
    }
  }
}
