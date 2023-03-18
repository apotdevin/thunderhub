import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Keys {
  @Field()
  pubkey: string;

  @Field()
  privkey: string;
}
