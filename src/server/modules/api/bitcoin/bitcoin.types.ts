import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BitcoinFee {
  @Field()
  fast: number;
  @Field()
  halfHour: number;
  @Field()
  hour: number;
  @Field()
  minimum: number;
}
