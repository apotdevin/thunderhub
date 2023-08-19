import {
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { orderBy } from 'lodash';
import { subDays } from 'date-fns';
import { NodeService } from '../../node/node.service';
import { UserId } from '../../security/security.types';
import { CurrentUser } from '../../security/security.decorators';
import {
  BaseNodeInfo,
  ChannelInfo,
  EdgeInfoWithPubkey,
  Forward,
  ForwardsWithPubkey,
} from './forwards.types';
import { ContextType } from 'src/server/app.module';
import { BaseNodeInfoType } from '../amboss/amboss.types';

@Resolver(BaseNodeInfo)
export class BaseNodeInfoResolver {
  @ResolveField()
  public_key(@Parent() { pub_key }: BaseNodeInfoType) {
    return pub_key;
  }
}

@Resolver(ChannelInfo)
export class ChannelInfoResolver {
  @ResolveField()
  async node1_info(@Parent() { info, currentPubkey }: EdgeInfoWithPubkey) {
    return currentPubkey === info.node1_pub
      ? info.node1_info.node
      : info.node2_info.node;
  }

  @ResolveField()
  async node2_info(@Parent() { info, currentPubkey }: EdgeInfoWithPubkey) {
    return currentPubkey === info.node1_pub
      ? info.node2_info.node
      : info.node1_info.node;
  }
}

@Resolver(Forward)
export class ForwardResolver {
  @ResolveField()
  async incoming_channel_info(
    @Parent() { incoming_channel, currentPubkey }: ForwardsWithPubkey,
    @Context() { loaders }: ContextType
  ): Promise<EdgeInfoWithPubkey> {
    const edge = await loaders.edgesLoader.load(incoming_channel);
    return edge ? { ...edge, currentPubkey } : null;
  }

  @ResolveField()
  async outgoing_channel_info(
    @Parent() { outgoing_channel, currentPubkey }: ForwardsWithPubkey,
    @Context() { loaders }: ContextType
  ): Promise<EdgeInfoWithPubkey> {
    const edge = await loaders.edgesLoader.load(outgoing_channel);
    return edge ? { ...edge, currentPubkey } : null;
  }
}

@Resolver()
export class ForwardsResolver {
  constructor(private nodeService: NodeService) {}

  @Query(() => [Forward])
  async getForwards(
    @CurrentUser() user: UserId,
    @Args('days') days: number
  ): Promise<ForwardsWithPubkey[]> {
    const walletInfo = await this.nodeService.getWalletInfo(user.id);

    if (!walletInfo) return [];

    const today = new Date();
    const startDate = subDays(today, days);

    const forwardsList = await this.nodeService.getForwards(user.id, {
      after: startDate.toISOString(),
      before: today.toISOString(),
    });

    let forwards = forwardsList.forwards;
    let next = forwardsList.next;

    let finishedFetching = false;

    if (!next || !forwards || forwards.length <= 0) {
      finishedFetching = true;
    }

    while (!finishedFetching) {
      if (next) {
        const moreForwards = await this.nodeService.getForwards(user.id, {
          token: next,
        });

        forwards = [...forwards, ...moreForwards.forwards];
        next = moreForwards.next;
      } else {
        finishedFetching = true;
      }
    }

    const forwardsWithCurrentPubkey = forwards.map(f => ({
      ...f,
      currentPubkey: walletInfo.public_key,
    }));

    return orderBy(forwardsWithCurrentPubkey, 'created_at', 'desc');
  }
}
