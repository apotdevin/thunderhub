import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NetworkInfo {
  @Field()
  averageChannelSize: number;
  @Field()
  channelCount: number;
  @Field()
  maxChannelSize: number;
  @Field()
  medianChannelSize: number;
  @Field()
  minChannelSize: number;
  @Field()
  nodeCount: number;
  @Field()
  notRecentlyUpdatedPolicyCount: number;
  @Field()
  totalCapacity: number;
}
