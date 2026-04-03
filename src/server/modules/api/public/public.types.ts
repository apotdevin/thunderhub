import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateInitialUserResult {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  role: string;
}

@ObjectType()
export class PublicMutation {
  @Field(() => CreateInitialUserResult)
  create_initial_user: CreateInitialUserResult;

  @Field(() => Boolean)
  get_auth_token: boolean;

  @Field(() => String)
  get_session_token: string;

  @Field(() => Boolean)
  get_db_session_token: boolean;
}
