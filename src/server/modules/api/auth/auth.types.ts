import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TwofaResult {
  @Field()
  url: string;
  @Field()
  secret: string;
}
