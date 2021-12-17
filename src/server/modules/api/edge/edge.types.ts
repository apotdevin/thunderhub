import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ChannelReport {
  @Field()
  local: number;
  @Field()
  remote: number;
  @Field()
  maxIn: number;
  @Field()
  maxOut: number;
  @Field()
  commit: number;
  @Field()
  totalPendingHtlc: number;
  @Field()
  outgoingPendingHtlc: number;
  @Field()
  incomingPendingHtlc: number;
}
