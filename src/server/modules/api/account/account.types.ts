import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class LndInput {
  @Field()
  socket: string;
  @Field()
  macaroon: string;
  @Field({ nullable: true })
  cert?: string;
}

@InputType()
export class LitdInput {
  @Field()
  socket: string;
  @Field()
  macaroon: string;
  @Field({ nullable: true })
  cert?: string;
}

@InputType()
export class AddNodeInput {
  @Field()
  name: string;
  @Field(() => LndInput, { nullable: true })
  lnd?: LndInput;
  @Field(() => LitdInput, { nullable: true })
  litd?: LitdInput;
}

@ObjectType()
export class ServerAccount {
  @Field()
  name: string;
  @Field()
  id: string;
  @Field()
  slug: string;
  @Field()
  loggedIn: boolean;
  @Field()
  type: string;
  @Field()
  twofaEnabled: boolean;
  @Field({ nullable: true })
  hasNode?: boolean;
}

@ObjectType()
export class AddNodeResult {
  @Field()
  id: string;
  @Field()
  slug: string;
  @Field()
  name: string;
}

@ObjectType()
export class UserNode {
  @Field()
  id: string;
  @Field()
  slug: string;
  @Field()
  name: string;
}

@ObjectType()
export class UserQueries {
  @Field(() => [UserNode])
  get_nodes: UserNode[];
}

@ObjectType()
export class TeamMutations {
  @Field(() => AddNodeResult)
  add_node: AddNodeResult;
}

@ObjectType()
export class PublicQueries {
  @Field(() => [ServerAccount])
  get_server_accounts: ServerAccount[];
}
