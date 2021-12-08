import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LnMarketsUserInfo {
  @Field({ nullable: true })
  uid: string;
  @Field({ nullable: true })
  balance: string;
  @Field({ nullable: true })
  account_type: string;
  @Field({ nullable: true })
  username: string;
  @Field({ nullable: true })
  linkingpublickey: string;
  @Field({ nullable: true })
  last_ip: string;
}
