import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ChannelMetadata {
  @Field(() => String)
  channel_id: string;

  @Field(() => String)
  note: string;

  @Field(() => String)
  updated_at: string;
}

@ObjectType()
export class ChannelsMutations {
  @Field(() => ChannelMetadata)
  upsert_note: ChannelMetadata;

  @Field(() => Boolean)
  delete_note: boolean;
}

@ObjectType()
export class OffchainMutations {
  @Field(() => ChannelsMutations)
  channels: ChannelsMutations;
}

@ObjectType()
export class UserMutations {
  @Field(() => OffchainMutations)
  offchain: OffchainMutations;
}
