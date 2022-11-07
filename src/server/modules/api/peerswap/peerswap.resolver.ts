import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PeerSwapService } from '../../peerswap/peerswap.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import {
  GetPeerSwapPeersType,
  GetPeerSwapSwapsType,
  GetPeerSwapSwapType,
} from './peerswap.types';

@Resolver()
export class PeerSwapResolver {
  constructor(private peerSwapService: PeerSwapService) {}

  @Query(() => GetPeerSwapSwapsType)
  async getPeerSwapSwaps(@CurrentUser() { id }: UserId) {
    return await this.peerSwapService.getSwaps(id);
  }

  @Query(() => GetPeerSwapPeersType)
  async getPeerSwapPeers(@CurrentUser() { id }: UserId) {
    return await this.peerSwapService.getPeers(id);
  }

  @Mutation(() => GetPeerSwapSwapType)
  async createPeerSwapSwap(
    @CurrentUser() { id }: UserId,
    @Args('amount') amount: number,
    @Args('asset') asset: string,
    @Args('channelId') channelId: string,
    @Args('type') type: string
  ) {
    return await this.peerSwapService.createSwap(id, {
      amount,
      asset,
      channelId,
      type,
    });
  }
}
