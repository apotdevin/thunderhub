import { Field, ObjectType } from '@nestjs/graphql';
import { Node } from '../node/node.types';

export type ChannelFeesType = {
  id: string;
  publicKey: string;
  partnerBaseFee: number;
  partnerFeeRate: number;
  myBaseFee: number;
  myFeeRate: number;
};

@ObjectType()
export class ChannelHealth {
  @Field({ nullable: true })
  id: string;
  @Field({ nullable: true })
  score: number;
  @Field({ nullable: true })
  volumeNormalized: string;
  @Field({ nullable: true })
  averageVolumeNormalized: string;
  @Field(() => Node, { nullable: true })
  partner: Node;
}

@ObjectType()
export class ChannelsHealth {
  @Field({ nullable: true })
  score: number;
  @Field(() => [ChannelHealth], { nullable: true })
  channels: ChannelHealth[];
}

@ObjectType()
export class ChannelTimeHealth {
  @Field({ nullable: true })
  id: string;
  @Field({ nullable: true })
  score: number;
  @Field({ nullable: true })
  significant: boolean;
  @Field({ nullable: true })
  monitoredTime: number;
  @Field({ nullable: true })
  monitoredUptime: number;
  @Field({ nullable: true })
  monitoredDowntime: number;
  @Field(() => Node, { nullable: true })
  partner: Node;
}

@ObjectType()
export class ChannelsTimeHealth {
  @Field({ nullable: true })
  score: number;
  @Field(() => [ChannelTimeHealth], { nullable: true })
  channels: ChannelTimeHealth[];
}

@ObjectType()
export class FeeHealth {
  @Field({ nullable: true })
  score: number;
  @Field({ nullable: true })
  rate: number;
  @Field({ nullable: true })
  base: string;
  @Field({ nullable: true })
  rateScore: number;
  @Field({ nullable: true })
  baseScore: number;
  @Field({ nullable: true })
  rateOver: boolean;
  @Field({ nullable: true })
  baseOver: boolean;
}

@ObjectType()
export class ChannelFeeHealth {
  @Field({ nullable: true })
  id: string;
  @Field(() => FeeHealth, { nullable: true })
  partnerSide: FeeHealth;
  @Field(() => FeeHealth, { nullable: true })
  mySide: FeeHealth;
  @Field(() => Node, { nullable: true })
  partner: Node;
}

@ObjectType()
export class ChannelsFeeHealth {
  @Field({ nullable: true })
  score: number;
  @Field(() => [ChannelFeeHealth], { nullable: true })
  channels: ChannelFeeHealth[];
}
