import { Field, ObjectType } from '@nestjs/graphql';
import { GetForwardsResult } from 'lightning';

import { EdgeInfo } from '../amboss/amboss.types';

@ObjectType()
export class BaseNodeInfo {
  @Field()
  alias: string;

  @Field()
  public_key: string;
}

@ObjectType()
export class ChannelInfo {
  @Field(() => BaseNodeInfo)
  node1_info: BaseNodeInfo;

  @Field(() => BaseNodeInfo)
  node2_info: BaseNodeInfo;
}

@ObjectType()
export class Forward {
  @Field()
  id: string;
  @Field()
  created_at: string;
  @Field()
  fee: number;
  @Field()
  fee_mtokens: string;
  @Field()
  incoming_channel: string;
  @Field()
  mtokens: string;
  @Field()
  outgoing_channel: string;
  @Field()
  tokens: number;
}

@ObjectType()
export class AggregatedChannelSideForwards {
  @Field()
  id: string;
  @Field()
  count: number;
  @Field()
  fee: number;
  @Field()
  fee_mtokens: string;
  @Field()
  mtokens: string;
  @Field()
  tokens: number;
  @Field({ nullable: true })
  channel: string;
  @Field({ nullable: true })
  channel_info: ChannelInfo;
}

@ObjectType()
export class AggregatedSideStats {
  @Field()
  id: string;
  @Field()
  count: number;
  @Field()
  fee: number;
  @Field()
  fee_mtokens: string;
  @Field()
  mtokens: string;
  @Field()
  tokens: number;
}

@ObjectType()
export class AggregatedChannelForwards {
  @Field()
  id: string;
  @Field(() => AggregatedSideStats)
  incoming: AggregatedSideStats;
  @Field(() => AggregatedSideStats)
  outgoing: AggregatedSideStats;
  @Field({ nullable: true })
  channel: string;
  @Field({ nullable: true })
  channel_info: ChannelInfo;
}

@ObjectType()
export class AggregatedRouteForwards {
  @Field()
  id: string;
  @Field()
  count: number;
  @Field()
  fee: number;
  @Field()
  fee_mtokens: string;
  @Field()
  mtokens: string;
  @Field()
  tokens: number;
  @Field()
  route: string;
  @Field()
  incoming_channel: string;
  @Field()
  outgoing_channel: string;
  @Field({ nullable: true })
  incoming_channel_info: ChannelInfo;
  @Field({ nullable: true })
  outgoing_channel_info: ChannelInfo;
}

export type ForwardsWithPubkey = GetForwardsResult['forwards'][0] & {
  currentPubkey: string;
};

export type EdgeInfoWithPubkey = EdgeInfo & {
  currentPubkey: string;
};

@ObjectType()
export class GetForwards {
  @Field(() => [Forward])
  list: Forward[];

  @Field(() => [AggregatedChannelSideForwards])
  by_incoming: AggregatedChannelSideForwards[];

  @Field(() => [AggregatedChannelSideForwards])
  by_outgoing: AggregatedChannelSideForwards[];

  @Field(() => [AggregatedRouteForwards])
  by_route: AggregatedRouteForwards[];

  @Field(() => [AggregatedChannelForwards])
  by_channel: AggregatedChannelForwards[];
}

export type AggregatedByChannelSide = {
  count: number;
  fee: number;
  fee_mtokens: number;
  mtokens: number;
  tokens: number;
  channel: string;
  currentPubkey: string;
};

export type AggregatedByChannel = {
  incoming: {
    count: number;
    fee: number;
    fee_mtokens: number;
    mtokens: number;
    tokens: number;
  };
  outgoing: {
    count: number;
    fee: number;
    fee_mtokens: number;
    mtokens: number;
    tokens: number;
  };
  channel: string;
  currentPubkey: string;
};

export type AggregatedByRoute = {
  count: number;
  fee: number;
  fee_mtokens: number;
  mtokens: number;
  tokens: number;
  route: string;
  incoming_channel: string;
  outgoing_channel: string;
  currentPubkey: string;
};

export const defaultValues = {
  count: 0,
  fee: 0,
  fee_mtokens: 0,
  mtokens: 0,
  tokens: 0,
};
