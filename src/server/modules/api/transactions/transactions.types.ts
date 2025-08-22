import { Field, ObjectType } from '@nestjs/graphql';

import { Node } from '../node/node.types';

@ObjectType()
export class MessageType {
  @Field({ nullable: true })
  message: string;
}

@ObjectType()
export class InvoicePayment {
  @Field({ nullable: true })
  canceled_at: string;
  @Field({ nullable: true })
  confirmed_at: string;
  @Field()
  created_at: string;
  @Field()
  created_height: number;
  @Field()
  is_canceled: boolean;
  @Field()
  is_confirmed: boolean;
  @Field()
  is_held: boolean;
  @Field()
  mtokens: string;
  @Field({ nullable: true })
  pending_index: number;
  @Field()
  timeout: number;
  @Field()
  tokens: number;
  @Field({ nullable: true })
  total_mtokens: string;
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
  @Field()
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
  @Field()
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
  @Field()
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

@ObjectType()
export class GetInvoicesType {
  @Field({ nullable: true })
  next: string;

  @Field(() => [InvoiceType])
  invoices: InvoiceType[];
}

@ObjectType()
export class GetPaymentsType {
  @Field({ nullable: true })
  next: string;

  @Field(() => [PaymentType])
  payments: PaymentType[];
}
