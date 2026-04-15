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
  @Field({ nullable: true })
  network?: string;
  @Field({ nullable: true })
  type?: string;
}

@ObjectType()
export class UserQueries {
  @Field(() => [UserNode])
  get_nodes: UserNode[];
}

@InputType()
export class EditNodeInput {
  @Field()
  slug: string;
  @Field({ nullable: true })
  name?: string;
}

@ObjectType()
export class EditNodeResult {
  @Field()
  id: string;
  @Field()
  slug: string;
  @Field()
  name: string;
}

@ObjectType()
export class DeleteNodeResult {
  @Field()
  success: boolean;
}

@ObjectType()
export class TeamMutations {
  @Field(() => AddNodeResult)
  add_node: AddNodeResult;
  @Field(() => EditNodeResult)
  edit_node: EditNodeResult;
  @Field(() => DeleteNodeResult)
  delete_node: DeleteNodeResult;
}

@ObjectType()
export class SessionInfo {
  @Field()
  loggedIn: boolean;
  @Field({ nullable: true })
  type?: string;
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  slug?: string;
}

@ObjectType()
export class PublicQueries {
  @Field()
  id: string;
  @Field(() => [ServerAccount])
  get_server_accounts: ServerAccount[];
  @Field(() => SessionInfo)
  get_session_info: SessionInfo;
}
