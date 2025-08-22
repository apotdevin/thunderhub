import { Field, ObjectType } from '@nestjs/graphql';

import { Node } from '../node/node.types';

@ObjectType()
export class Route {
  @Field({ nullable: true })
  base_fee_mtokens: string;
  @Field({ nullable: true })
  channel: string;
  @Field({ nullable: true })
  cltv_delta: number;
  @Field({ nullable: true })
  fee_rate: number;
  @Field()
  public_key: string;
}

@ObjectType()
export class DecodeInvoice {
  @Field({ nullable: true })
  chain_address: string;
  @Field({ nullable: true })
  cltv_delta: number;
  @Field()
  description: string;
  @Field({ nullable: true })
  description_hash: string;
  @Field()
  destination: string;
  @Field()
  expires_at: string;
  @Field()
  id: string;
  @Field()
  mtokens: string;
  @Field({ nullable: true })
  payment: string;
  @Field(() => [[Route]])
  routes: Route[][];
  @Field()
  safe_tokens: number;
  @Field()
  tokens: number;
  @Field(() => Node, { nullable: true })
  destination_node: Node;
}

@ObjectType()
export class CreateInvoice {
  @Field({ nullable: true })
  chain_address?: string;
  @Field()
  created_at: string;
  @Field()
  description: string;
  @Field()
  id: string;
  @Field({ nullable: true })
  mtokens?: string;
  @Field()
  request: string;
  @Field()
  secret: string;
  @Field({ nullable: true })
  tokens?: number;
}

@ObjectType()
export class Hops {
  @Field()
  channel: string;
  @Field()
  channel_capacity: number;
  @Field()
  fee_mtokens: string;
  @Field()
  forward_mtokens: string;
  @Field()
  timeout: number;
}

@ObjectType()
export class PayInvoice {
  @Field()
  fee: number;
  @Field()
  fee_mtokens: string;
  @Field(() => [Hops])
  hops: Hops[];
  @Field()
  id: string;
  @Field()
  is_confirmed: boolean;
  @Field()
  is_outgoing: boolean;
  @Field()
  mtokens: string;
  @Field()
  secret: string;
  @Field()
  safe_fee: number;
  @Field()
  safe_tokens: number;
  @Field()
  tokens: number;
}
