import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { Node } from '../node/node.types';

@ObjectType()
export class PendingResume {
  @Field()
  incoming_tokens: number;
  @Field()
  outgoing_tokens: number;
  @Field()
  incoming_amount: number;
  @Field()
  outgoing_amount: number;
  @Field()
  total_tokens: number;
  @Field()
  total_amount: number;
}

@ObjectType()
export class PendingPayment {
  @Field()
  id: string;
  @Field()
  is_outgoing: boolean;
  @Field()
  timeout: number;
  @Field()
  tokens: number;
}

@ObjectType()
export class Policy {
  @Field({ nullable: true })
  base_fee_mtokens: string;
  @Field({ nullable: true })
  cltv_delta: number;
  @Field({ nullable: true })
  fee_rate: number;
  @Field({ nullable: true })
  is_disabled: boolean;
  @Field({ nullable: true })
  max_htlc_mtokens: string;
  @Field({ nullable: true })
  min_htlc_mtokens: string;
  @Field()
  public_key: string;
  @Field({ nullable: true })
  updated_at: string;
}

@ObjectType()
export class NodePolicy {
  @Field({ nullable: true })
  base_fee_mtokens: string;
  @Field({ nullable: true })
  cltv_delta: number;
  @Field({ nullable: true })
  fee_rate: number;
  @Field({ nullable: true })
  is_disabled: boolean;
  @Field({ nullable: true })
  max_htlc_mtokens: string;
  @Field({ nullable: true })
  min_htlc_mtokens: string;
  @Field({ nullable: true })
  updated_at: string;
  @Field(() => Node, { nullable: true })
  node: Node;

  public_key: string;
}

@ObjectType()
export class SingleChannel {
  @Field()
  capacity: number;
  @Field()
  id: string;
  @Field(() => [Policy])
  policies: Policy[];
  @Field()
  transaction_id: string;
  @Field()
  transaction_vout: number;
  @Field({ nullable: true })
  updated_at: string;
  @Field(() => NodePolicy, { nullable: true })
  node_policies: NodePolicy;
  @Field(() => NodePolicy, { nullable: true })
  partner_node_policies: NodePolicy;
}

@ObjectType()
export class Channel {
  @Field()
  capacity: number;
  @Field()
  commit_transaction_fee: number;
  @Field()
  commit_transaction_weight: number;
  @Field()
  id: string;
  @Field()
  is_active: boolean;
  @Field()
  is_closing: boolean;
  @Field()
  is_opening: boolean;
  @Field()
  is_partner_initiated: boolean;
  @Field()
  is_private: boolean;
  @Field()
  local_balance: number;
  @Field()
  local_reserve: number;
  @Field()
  partner_public_key: string;
  @Field()
  past_states: number;
  @Field()
  received: number;
  @Field()
  remote_balance: number;
  @Field()
  remote_reserve: number;
  @Field()
  sent: number;
  @Field({ nullable: true })
  time_offline: number;
  @Field({ nullable: true })
  time_online: number;
  @Field()
  transaction_id: string;
  @Field()
  transaction_vout: number;
  @Field()
  unsettled_balance: number;
  @Field(() => Node)
  partner_node_info: Node;
  @Field(() => SingleChannel, { nullable: true })
  partner_fee_info: SingleChannel;
  @Field()
  channel_age: number;
  @Field(() => [PendingPayment])
  pending_payments: PendingPayment[];
  @Field(() => PendingResume)
  pending_resume: PendingResume;
}

export type SingleChannelParentType = {
  id: string;
  partner_fee_info: {
    lnd: any;
    localKey: string;
  };
};

@ObjectType()
export class ClosedChannel {
  @Field()
  capacity: number;
  @Field({ nullable: true })
  close_confirm_height: number;
  @Field({ nullable: true })
  close_transaction_id: string;
  @Field()
  final_local_balance: number;
  @Field()
  final_time_locked_balance: number;
  @Field({ nullable: true })
  id: string;
  @Field()
  is_breach_close: boolean;
  @Field()
  is_cooperative_close: boolean;
  @Field()
  is_funding_cancel: boolean;
  @Field()
  is_local_force_close: boolean;
  @Field()
  is_remote_force_close: boolean;
  @Field()
  partner_public_key: string;
  @Field()
  transaction_id: string;
  @Field()
  transaction_vout: number;
  @Field(() => Node)
  partner_node_info: Node;
  @Field({ nullable: true })
  channel_age: number;
  @Field({ nullable: true })
  closed_for_blocks: number;
}

@ObjectType()
export class PendingChannel {
  @Field({ nullable: true })
  close_transaction_id: string;
  @Field()
  is_active: boolean;
  @Field()
  is_closing: boolean;
  @Field()
  is_opening: boolean;
  @Field()
  is_timelocked: boolean;
  @Field()
  local_balance: number;
  @Field()
  local_reserve: number;
  @Field()
  partner_public_key: string;
  @Field()
  received: number;
  @Field()
  remote_balance: number;
  @Field()
  remote_reserve: number;
  @Field()
  sent: number;
  @Field({ nullable: true })
  transaction_fee: number;
  @Field()
  transaction_id: string;
  @Field()
  transaction_vout: number;
  @Field(() => Node)
  partner_node_info: Node;
  @Field({ nullable: true })
  timelock_blocks: number;
  @Field({ nullable: true })
  timelock_expiration: number;
}

@ObjectType()
export class OpenOrCloseChannel {
  @Field()
  transactionId: string;
  @Field()
  transactionOutputIndex: string;
}

@InputType()
export class UpdateRoutingFeesParams {
  @Field({ nullable: true })
  transaction_id?: string;
  @Field({ nullable: true })
  transaction_vout?: number;
  @Field({ nullable: true })
  base_fee_mtokens?: string;
  @Field({ nullable: true })
  base_fee_tokens?: number;
  @Field({ nullable: true })
  cltv_delta?: number;
  @Field({ nullable: true })
  fee_rate?: number;
  @Field({ nullable: true })
  max_htlc_mtokens?: string;
  @Field({ nullable: true })
  min_htlc_mtokens?: string;
}

@InputType()
export class OpenChannelParams {
  @Field({ nullable: true })
  is_recommended: boolean;
  @Field({ nullable: true })
  partner_public_key: string;
  @Field({ nullable: true })
  channel_size: number;
  @Field({ nullable: true })
  is_private: boolean;
  @Field({ nullable: true })
  is_max_funding: boolean;
  @Field({ nullable: true, defaultValue: 0 })
  give_tokens: number;
  @Field({ nullable: true })
  chain_fee_tokens_per_vbyte: number;
  @Field({ nullable: true })
  base_fee_mtokens: string;
  @Field({ nullable: true })
  fee_rate: number;
}

export type OpenChannelAuto = {
  checkArgs: void;
  recommendedPeer: { pubkey: string } | undefined;
  peer: { pubkey: string } | undefined;
  openChannel: { transactionId: string; transactionOutputIndex: string };
};
