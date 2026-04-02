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

@ObjectType()
export class PublicQueries {
  @Field(() => [ServerAccount])
  get_server_accounts: ServerAccount[];
}
