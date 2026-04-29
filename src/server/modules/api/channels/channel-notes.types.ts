import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ChannelNote {
  @Field(() => String)
  channelId: string;

  @Field(() => String)
  note: string;

  @Field(() => String)
  updatedAt: string;
}
