import { Field, ObjectType } from '@nestjs/graphql';

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
}
