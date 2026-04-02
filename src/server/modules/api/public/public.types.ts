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
}
