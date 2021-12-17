import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
class Message {
  @Field()
  date: string;
  @Field()
  id: string;
  @Field()
  verified: boolean;
  @Field({ nullable: true })
  contentType: string;
  @Field({ nullable: true })
  sender: string;
  @Field({ nullable: true })
  alias: string;
  @Field({ nullable: true })
  message: string;
  @Field({ nullable: true })
  tokens: number;
}

@ObjectType()
export class GetMessages {
  @Field({ nullable: true })
  token: string;
  @Field(() => [Message])
  messages: Message[];
}
