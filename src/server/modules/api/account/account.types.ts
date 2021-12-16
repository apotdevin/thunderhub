import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ServerAccount {
  @Field()
  name: string;
  @Field()
  id: string;
  @Field()
  loggedIn: boolean;
  @Field()
  type: string;
  @Field()
  twofaEnabled: boolean;
}
