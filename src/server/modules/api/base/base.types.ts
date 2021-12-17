import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseNode {
  @Field({ nullable: true })
  _id: string;
  @Field({ nullable: true })
  name: string;
  @Field()
  public_key: string;
  @Field()
  socket: string;
}

@ObjectType()
export class BasePoints {
  @Field()
  alias: string;
  @Field()
  amount: number;
}

@ObjectType()
export class BaseInvoice {
  @Field()
  id: string;
  @Field()
  request: string;
}
