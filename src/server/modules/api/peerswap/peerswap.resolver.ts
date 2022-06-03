import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PeerSwapService } from '../../peerswap/peerswap.service';
import { GetPeerSwapPeersType, GetPeerSwapSwapsType, PeerSwapSwapType } from './peerswap.types';

@Resolver()
export class PeerSwapResolver {
  constructor(private peerSwapService: PeerSwapService) {}

  @Query(() => GetPeerSwapSwapsType)
  async getPeerSwapSwaps() {
    return await this.peerSwapService.getSwaps();
  }

  @Query(() => GetPeerSwapPeersType)
  async getPeerSwapPeers() {
    return await this.peerSwapService.getPeers();
  }

  @Mutation(() => PeerSwapSwapType)
  async createPeerSwapSwap(
    @Args('amount') amount: number,
    @Args('asset') asset: string,
    @Args('channelId') channelId: string,
    @Args('type') type: string,
  ) {
    return await this.peerSwapService.createSwap({amount, asset, channelId, type});
  }
}
