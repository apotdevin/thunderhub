import {
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { groupBy, orderBy, uniq } from 'lodash';
import { subDays } from 'date-fns';
import { NodeService } from '../../node/node.service';
import { UserId } from '../../security/security.types';
import { CurrentUser } from '../../security/security.decorators';
import {
  AggregatedByChannel,
  AggregatedByChannelSide,
  AggregatedByRoute,
  AggregatedChannelForwards,
  AggregatedChannelSideForwards,
  AggregatedRouteForwards,
  AggregatedSideStats,
  BaseNodeInfo,
  ChannelInfo,
  EdgeInfoWithPubkey,
  Forward,
  ForwardsWithPubkey,
  GetForwards,
  defaultValues,
} from './forwards.types';
import { ContextType } from 'src/server/app.module';
import { BaseNodeInfoType } from '../amboss/amboss.types';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';
import { v5 as uuidv5 } from 'uuid';
import {
  mapByChannel,
  reduceByChannel,
  reduceByRoute,
} from './forwards.helpers';

@Resolver(BaseNodeInfo)
export class BaseNodeInfoResolver {
  @ResolveField()
  public_key(@Parent() { pub_key }: BaseNodeInfoType) {
    return pub_key;
  }
}

@Resolver(Forward)
export class ForwardResolver {
  @ResolveField()
  id(@Parent() parent: Forward) {
    return uuidv5(JSON.stringify(parent), uuidv5.URL);
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

@Resolver(AggregatedChannelSideForwards)
export class AggregatedChannelSideForwardsResolver {
  @ResolveField()
  id(@Parent() parent: AggregatedByChannelSide) {
    return uuidv5(JSON.stringify(parent), uuidv5.URL);
  }

  @ResolveField()
  async channel_info(
    @Parent() { channel, currentPubkey }: AggregatedByChannelSide,
    @Context() { loaders }: ContextType
  ): Promise<EdgeInfoWithPubkey> {
    const edge = await loaders.edgesLoader.load(channel);
    return edge ? { ...edge, currentPubkey } : null;
  }
}

@Resolver(AggregatedSideStats)
export class AggregatedSideStatsResolver {
  @ResolveField()
  id(@Parent() parent: AggregatedSideStats) {
    return uuidv5(JSON.stringify(parent), uuidv5.URL);
  }
}

@Resolver(AggregatedChannelForwards)
export class AggregatedChannelForwardsResolver {
  @ResolveField()
  id(@Parent() parent: AggregatedByChannelSide) {
    return uuidv5(JSON.stringify(parent), uuidv5.URL);
  }

  @ResolveField()
  async channel_info(
    @Parent() { channel, currentPubkey }: AggregatedByChannelSide,
    @Context() { loaders }: ContextType
  ): Promise<EdgeInfoWithPubkey> {
    const edge = await loaders.edgesLoader.load(channel);
    return edge ? { ...edge, currentPubkey } : null;
  }
}

@Resolver(AggregatedRouteForwards)
export class AggregatedRouteForwardsResolver {
  @ResolveField()
  id(@Parent() parent: AggregatedByRoute) {
    return uuidv5(JSON.stringify(parent), uuidv5.URL);
  }

  @ResolveField()
  async incoming_channel_info(
    @Parent() { incoming_channel, currentPubkey }: AggregatedByRoute,
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

@Resolver(GetForwards)
export class GetForwardsResolver {
  @ResolveField()
  list(@Parent() forwards: ForwardsWithPubkey[]) {
    return forwards;
  }

  @ResolveField()
  by_channel(@Parent() forwards: ForwardsWithPubkey[]): AggregatedByChannel[] {
    if (!forwards.length) return [];

    const currentPubkey = forwards[0].currentPubkey;

    const groupedIncoming = groupBy(forwards, f => f.incoming_channel);
    const groupedOutgoing = groupBy(forwards, f => f.outgoing_channel);

    const aggregatedIncoming = mapByChannel(groupedIncoming);
    const aggregatedOutgoing = mapByChannel(groupedOutgoing);

    const allChannels = uniq([
      ...Object.keys(groupedIncoming),
      ...Object.keys(groupedOutgoing),
    ]);

    const mapped = allChannels.map(channel => {
      const incoming = aggregatedIncoming[channel] || defaultValues;
      const outgoing = aggregatedOutgoing[channel] || defaultValues;

      return {
        incoming: { ...incoming, channel },
        outgoing: { ...outgoing, channel },
        channel,
        currentPubkey,
      };
    });

    return mapped;
  }

  @ResolveField()
  by_incoming(
    @Parent() forwards: ForwardsWithPubkey[]
  ): AggregatedByChannelSide[] {
    if (!forwards.length) return [];

    const currentPubkey = forwards[0].currentPubkey;

    const incoming = groupBy(forwards, f => f.incoming_channel);

    return reduceByChannel(currentPubkey, incoming).map(c => ({
      ...c,
      side: 'incoming',
    }));
  }

  @ResolveField()
  by_outgoing(
    @Parent() forwards: ForwardsWithPubkey[]
  ): AggregatedByChannelSide[] {
    if (!forwards.length) return [];

    const currentPubkey = forwards[0].currentPubkey;

    const outgoing = groupBy(forwards, f => f.outgoing_channel);

    return reduceByChannel(currentPubkey, outgoing).map(c => ({
      ...c,
      side: 'outgoing',
    }));
  }

  @ResolveField()
  by_route(@Parent() forwards: ForwardsWithPubkey[]): AggregatedByRoute[] {
    if (!forwards.length) return [];

    const currentPubkey = forwards[0].currentPubkey;

    const route = groupBy(
      forwards,
      f => `${f.incoming_channel}-${f.outgoing_channel}`
    );

    return reduceByRoute(currentPubkey, route);
  }
}

@Resolver()
export class ForwardsResolver {
  constructor(
    private nodeService: NodeService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => GetForwards)
  async getForwards(
    @CurrentUser() user: UserId,
    @Args('days') days: number
  ): Promise<ForwardsWithPubkey[]> {
    const walletInfo = await this.nodeService.getIdentity(user.id);

    if (!walletInfo) return [];

    const today = new Date();
    const startDate = subDays(today, days);

    this.logger.debug('Getting forwards', {
      from: startDate.toISOString(),
      to: today.toISOString(),
    });

    const forwardsList = await this.nodeService.getForwards(user.id, {
      after: startDate.toISOString(),
      before: today.toISOString(),
    });

    let forwards = forwardsList.forwards;
    let next = forwardsList.next;

    let finishedFetching = false;

    if (!next || !forwards?.length) {
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

    const end = new Date();

    this.logger.debug('Time to get forwards', {
      forward_amount: forwards.length,
      duration: end.getTime() - today.getTime() + ' ms',
    });

    const forwardsWithCurrentPubkey = forwards.map(f => ({
      ...f,
      currentPubkey: walletInfo.public_key,
    }));

    return orderBy(forwardsWithCurrentPubkey, 'created_at', 'desc');
  }
}
