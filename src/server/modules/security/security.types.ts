import { Field, ObjectType } from '@nestjs/graphql';

export type JwtObjectType = {
  iat: number;
  exp: number;
  iss: string;
  sub: string;
};

@ObjectType()
export class UserId {
  @Field()
  id: string;
}
