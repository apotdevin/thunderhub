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
