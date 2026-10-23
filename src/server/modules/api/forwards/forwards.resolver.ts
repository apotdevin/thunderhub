import {
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { groupBy, uniq } from 'lodash';
import { subDays, subHours } from 'date-fns';
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
  ForwardSummary,
  ForwardTimeSeries,
  ForwardsWithPubkey,
  GetForwards,
  defaultValues,
} from './forwards.types';
import { ContextType } from 'src/server/app.module';
import { BaseNodeInfoType } from '../amboss/amboss.types';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';
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
    return `${parent.created_at}_${parent.incoming_channel}_${parent.outgoing_channel}_${parent.tokens}_${parent.fee_mtokens}`;
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
    return parent.channel || 'channel_side';
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
    return parent.id || `${parent.count}_${parent.tokens}_${parent.fee}`;
  }
}

@Resolver(AggregatedChannelForwards)
export class AggregatedChannelForwardsResolver {
  @ResolveField()
  id(@Parent() parent: AggregatedByChannelSide) {
    return parent.channel || 'channel_fwd';
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
    return (
      parent.route || `${parent.incoming_channel}_${parent.outgoing_channel}`
    );
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
  @ResolveField(() => ForwardSummary)
  summary(@Parent() forwards: ForwardsWithPubkey[]): ForwardSummary {
    const empty = { count: 0, tokens: 0, fee: 0, fee_mtokens: '0' };
    if (!forwards?.length) {
      return { day: empty, week: empty, month: empty, year: empty, count: 0 };
    }

    const now = Date.now();
    const msDay = 24 * 60 * 60 * 1000;
    const tDay = now - msDay;
    const tWeek = now - 7 * msDay;
    const tMonth = now - 30 * msDay;

    let dayCount = 0,
      dayTokens = 0,
      dayFee = 0,
      dayFeeM = 0;
    let weekCount = 0,
      weekTokens = 0,
      weekFee = 0,
      weekFeeM = 0;
    let monthCount = 0,
      monthTokens = 0,
      monthFee = 0,
      monthFeeM = 0;
    let yearCount = 0,
      yearTokens = 0,
      yearFee = 0,
      yearFeeM = 0;

    for (let i = 0; i < forwards.length; i++) {
      const f = forwards[i];
      if (!f) continue;

      const feeM = Number.parseInt(f.fee_mtokens) || 0;
      const fee = f.fee || 0;
      const tokens = f.tokens || 0;

      yearCount++;
      yearTokens += tokens;
      yearFee += fee;
      yearFeeM += feeM;

      const time = new Date(f.created_at).getTime();
      if (time >= tMonth) {
        monthCount++;
        monthTokens += tokens;
        monthFee += fee;
        monthFeeM += feeM;

        if (time >= tWeek) {
          weekCount++;
          weekTokens += tokens;
          weekFee += fee;
          weekFeeM += feeM;

          if (time >= tDay) {
            dayCount++;
            dayTokens += tokens;
            dayFee += fee;
            dayFeeM += feeM;
          }
        }
      }
    }

    return {
      count: yearCount,
      day: {
        count: dayCount,
        tokens: dayTokens,
        fee: dayFee,
        fee_mtokens: dayFeeM.toString(),
      },
      week: {
        count: weekCount,
        tokens: weekTokens,
        fee: weekFee,
        fee_mtokens: weekFeeM.toString(),
      },
      month: {
        count: monthCount,
        tokens: monthTokens,
        fee: monthFee,
        fee_mtokens: monthFeeM.toString(),
      },
      year: {
        count: yearCount,
        tokens: yearTokens,
        fee: yearFee,
        fee_mtokens: yearFeeM.toString(),
      },
    };
  }

  @ResolveField(() => [ForwardTimeSeries])
  by_time(@Parent() forwards: ForwardsWithPubkey[]): ForwardTimeSeries[] {
    const days = (forwards as any)?.requestedDays || 7;
    const isDay = days <= 1;
    const bucketCount = isDay ? 24 : Math.max(1, Math.round(days));
    const now = new Date();
    const baseTime = isDay
      ? new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours()
        ).getTime()
      : new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const msPerUnit = isDay ? 3600000 : 86400000;

    const buckets: ForwardTimeSeries[] = new Array(bucketCount);
    for (let i = 0; i < bucketCount; i++) {
      buckets[i] = {
        tokens: 0,
        fee: 0,
        count: 0,
        date: isDay
          ? subHours(baseTime, i).toISOString()
          : subDays(baseTime, i).toISOString(),
      };
    }

    if (!forwards?.length) {
      return buckets.reverse();
    }

    for (let i = 0; i < forwards.length; i++) {
      const f = forwards[i];
      if (!f?.created_at) continue;

      const txTime = new Date(f.created_at).getTime();
      const diff = Math.floor((baseTime - txTime) / msPerUnit);
      if (diff >= 0 && diff < bucketCount) {
        const b = buckets[diff];
        b.tokens += f.tokens || 0;
        b.fee += f.fee || 0;
        b.count++;
      }
    }

    return buckets.reverse();
  }

  @ResolveField(() => [Forward])
  list(
    @Parent() forwards: ForwardsWithPubkey[],
    @Args('limit', { nullable: true, defaultValue: 50 }) limit?: number,
    @Args('offset', { nullable: true, defaultValue: 0 }) offset?: number
  ): ForwardsWithPubkey[] {
    if (!forwards?.length) return [];
    const start = Math.max(0, offset || 0);
    const end = start + (limit || 50);
    return forwards.slice(start, end);
  }

  @ResolveField(() => [AggregatedChannelForwards])
  by_channel(@Parent() forwards: ForwardsWithPubkey[]): AggregatedByChannel[] {
    if (!forwards?.length) return [];

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
        id: channel,
        incoming: { ...incoming, id: `in_${channel}` },
        outgoing: { ...outgoing, id: `out_${channel}` },
        channel,
        currentPubkey,
      };
    });

    return mapped;
  }

  @ResolveField(() => [AggregatedChannelSideForwards])
  by_incoming(
    @Parent() forwards: ForwardsWithPubkey[]
  ): AggregatedByChannelSide[] {
    if (!forwards?.length) return [];

    const currentPubkey = forwards[0].currentPubkey;

    const incoming = groupBy(forwards, f => f.incoming_channel);

    return reduceByChannel(currentPubkey, incoming).map(c => ({
      ...c,
      side: 'incoming',
    }));
  }

  @ResolveField(() => [AggregatedChannelSideForwards])
  by_outgoing(
    @Parent() forwards: ForwardsWithPubkey[]
  ): AggregatedByChannelSide[] {
    if (!forwards?.length) return [];

    const currentPubkey = forwards[0].currentPubkey;

    const outgoing = groupBy(forwards, f => f.outgoing_channel);

    return reduceByChannel(currentPubkey, outgoing).map(c => ({
      ...c,
      side: 'outgoing',
    }));
  }

  @ResolveField(() => [AggregatedRouteForwards])
  by_route(@Parent() forwards: ForwardsWithPubkey[]): AggregatedByRoute[] {
    if (!forwards?.length) return [];

    const currentPubkey = forwards[0].currentPubkey;

    const route = groupBy(
      forwards,
      f => `${f.incoming_channel}-${f.outgoing_channel}`
    );

    return reduceByRoute(currentPubkey, route);
  }
}

interface CachedForwards {
  fetchedAt: number;
  startDate: Date;
  forwards: ForwardsWithPubkey[];
}

interface InFlightForwards {
  startDate: Date;
  promise: Promise<ForwardsWithPubkey[]>;
}

const forwardsCache = new Map<string, CachedForwards>();
const inFlightForwards = new Map<string, InFlightForwards>();
const CACHE_TTL_MS = 60 * 1000;

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

    // Check if we have a fresh cached forward list that covers this time range
    const cached = forwardsCache.get(user.id);
    if (
      cached &&
      Date.now() - cached.fetchedAt < CACHE_TTL_MS &&
      cached.startDate.getTime() <= startDate.getTime()
    ) {
      this.logger.debug('Serving forwards from cache', {
        days,
        cached_count: cached.forwards.length,
      });
      const startMs = startDate.getTime();
      const filtered = cached.forwards.filter(
        f => new Date(f.created_at).getTime() >= startMs
      );
      (filtered as any).requestedDays = days;
      return filtered;
    }

    // Check if an in-flight request already covers this time range
    const inFlight = inFlightForwards.get(user.id);
    if (inFlight && inFlight.startDate.getTime() <= startDate.getTime()) {
      this.logger.debug('Awaiting in-flight forwards query', { days });
      const forwards = await inFlight.promise;
      const startMs = startDate.getTime();
      const filtered = forwards.filter(
        f => new Date(f.created_at).getTime() >= startMs
      );
      (filtered as any).requestedDays = days;
      return filtered;
    }

    this.logger.debug('Getting forwards from node', {
      from: startDate.toISOString(),
      to: today.toISOString(),
    });

    const startTime = Date.now();

    const fetchPromise = (async () => {
      try {
        const forwardsList = await this.nodeService.getForwards(user.id, {
          after: startDate.toISOString(),
          before: today.toISOString(),
          limit: 50000,
        });

        const forwards: any[] = [...(forwardsList?.forwards || [])];
        let next = forwardsList?.next;

        while (next) {
          const moreForwards = await this.nodeService.getForwards(user.id, {
            token: next,
          });

          if (moreForwards?.forwards?.length) {
            forwards.push(...moreForwards.forwards);
            next = moreForwards.next;
          } else {
            break;
          }
        }

        const duration = Date.now() - startTime;
        this.logger.debug('Time to get forwards', {
          forward_amount: forwards.length,
          duration: `${duration} ms`,
        });

        const forwardsWithCurrentPubkey: ForwardsWithPubkey[] = forwards.map(
          f => ({
            ...f,
            currentPubkey: walletInfo.public_key,
          })
        );

        forwardsWithCurrentPubkey.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        forwardsCache.set(user.id, {
          fetchedAt: Date.now(),
          startDate,
          forwards: forwardsWithCurrentPubkey,
        });

        return forwardsWithCurrentPubkey;
      } finally {
        inFlightForwards.delete(user.id);
      }
    })();

    inFlightForwards.set(user.id, {
      startDate,
      promise: fetchPromise,
    });

    const result = await fetchPromise;
    const startMs = startDate.getTime();
    const filtered = result.filter(
      f => new Date(f.created_at).getTime() >= startMs
    );
    (filtered as any).requestedDays = days;
    return filtered;
  }
}
