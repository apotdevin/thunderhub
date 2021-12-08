import { createUnionType, Field, ObjectType } from '@nestjs/graphql';
import { Node } from '../node/node.types';

@ObjectType()
export class MessageType {
  @Field({ nullable: true })
  message: string;
}

@ObjectType()
export class InvoicePayment {
  @Field()
  in_channel: string;
  @Field({ nullable: true })
  messages: MessageType;
}

@ObjectType()
export class InvoiceType {
  @Field({ nullable: true })
  chain_address: string;
  @Field({ nullable: true })
  confirmed_at: string;
  @Field({ nullable: true })
  created_at: string;
  @Field()
  description: string;
  @Field({ nullable: true })
  description_hash: string;
  @Field()
  expires_at: string;
  @Field()
  id: string;
  @Field({ nullable: true })
  is_canceled: boolean;
  @Field()
  is_confirmed: boolean;
  @Field({ nullable: true })
  is_held: boolean;
  @Field()
  is_private: boolean;
  @Field({ nullable: true })
  is_push: boolean;
  @Field({ nullable: true })
  received: number;
  @Field()
  received_mtokens: string;
  @Field({ nullable: true })
  request: string;
  @Field()
  secret: string;
  @Field()
  tokens: string;
  @Field()
  type: string;
  @Field()
  date: string;
  @Field(() => [InvoicePayment])
  payments: InvoicePayment[];
}

@ObjectType()
export class PaymentType {
  @Field({ nullable: true })
  created_at: string;
  @Field()
  destination: string;
  @Field(() => Node)
  destination_node: Node;
  @Field()
  fee: number;
  @Field()
  fee_mtokens: string;
  @Field(() => [Node])
  hops: Node[];
  @Field()
  id: string;
  @Field({ nullable: true })
  index: number;
  @Field()
  is_confirmed: boolean;
  @Field()
  is_outgoing: boolean;
  @Field()
  mtokens: string;
  @Field({ nullable: true })
  request: string;
  @Field()
  safe_fee: number;
  @Field({ nullable: true })
  safe_tokens: number;
  @Field()
  secret: string;
  @Field()
  tokens: string;
  @Field()
  type: string;
  @Field()
  date: string;
}

export const Transaction = createUnionType({
  name: 'Transaction',
  types: () => [InvoiceType, PaymentType],
});

@ObjectType()
export class GetResumeType {
  @Field()
  offset: number;
  @Field(() => [Transaction])
  resume: Array<typeof Transaction>;
}
