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
  @Field()
  id: string;
  @Field()
  score: number;
  @Field()
  volumeNormalized: string;
  @Field()
  averageVolumeNormalized: string;
  @Field(() => Node)
  partner: Node;
}

@ObjectType()
export class ChannelsHealth {
  @Field()
  score: number;
  @Field(() => ChannelHealth)
  channels: ChannelHealth[];
}

@ObjectType()
export class ChannelTimeHealth {
  @Field()
  id: string;
  @Field()
  score: number;
  @Field()
  significant: boolean;
  @Field()
  monitoredTime: number;
  @Field()
  monitoredUptime: number;
  @Field()
  monitoredDowntime: number;
  @Field(() => Node)
  partner: Node;
}

@ObjectType()
export class ChannelsTimeHealth {
  @Field()
  score: number;
  @Field(() => ChannelTimeHealth)
  channels: ChannelTimeHealth[];
}

@ObjectType()
export class FeeHealth {
  @Field()
  score: number;
  @Field()
  rate: number;
  @Field()
  base: string;
  @Field()
  rateScore: number;
  @Field()
  baseScore: number;
  @Field()
  rateOver: boolean;
  @Field()
  baseOver: boolean;
}

@ObjectType()
export class ChannelFeeHealth {
  @Field()
  id: string;
  @Field(() => FeeHealth)
  partnerSide: FeeHealth;
  @Field(() => FeeHealth)
  mySide: FeeHealth;
  @Field(() => Node)
  partner: Node;
}

@ObjectType()
export class ChannelsFeeHealth {
  @Field()
  score: number;
  @Field(() => ChannelFeeHealth)
  channels: ChannelFeeHealth[];
}
