import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { TapTransactionType } from '../magma/magma.types';

@InputType()
export class TradeQuoteInput {
  @Field({ nullable: true })
  tapd_asset_id?: string;

  @Field({ nullable: true })
  tapd_group_key?: string;

  @Field()
  asset_amount: string;

  @Field(() => TapTransactionType)
  transaction_type: TapTransactionType;

  @Field()
  peer_pubkey: string;

  @Field({ nullable: true })
  asset_symbol?: string;

  @Field({ nullable: true })
  asset_precision?: number;

  @Field({ nullable: true })
  expiry?: number;
}

@ObjectType()
export class TradeQuoteResult {
  @Field()
  sats_amount: string;

  @Field()
  asset_amount: string;

  @Field({ nullable: true })
  rate_fixed?: string;

  @Field({ nullable: true })
  payment_request?: string;

  @Field({ nullable: true })
  rfq_id?: string;

  @Field({ nullable: true })
  expiry_epoch?: string;
}

@InputType()
export class ExecuteTradeInput {
  @Field({ nullable: true })
  tapd_asset_id?: string;

  @Field({ nullable: true })
  tapd_group_key?: string;

  @Field()
  asset_amount: string;

  @Field()
  sats_amount: string;

  @Field(() => TapTransactionType)
  transaction_type: TapTransactionType;

  @Field()
  peer_pubkey: string;

  @Field({ nullable: true })
  asset_symbol?: string;

  @Field({ nullable: true })
  asset_precision?: number;

  @Field({ nullable: true })
  payment_request?: string;

  @Field({ nullable: true })
  rfq_id?: string;

  @Field({ nullable: true })
  expiry_epoch?: string;
}

@ObjectType()
export class ExecuteTradeResult {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  payment_preimage?: string;

  @Field({ nullable: true })
  sats_amount?: string;

  @Field({ nullable: true })
  fee_sats?: string;
}

export type BtcChannel = {
  id: string;
  capacity: number;
  local_balance: number;
  remote_balance: number;
};

export type TaChannel = BtcChannel & {
  local_reserve: number;
  partner_scid_alias?: string;
  transaction_id: string;
  transaction_vout: number;
};

export type TaChannelPointAndId = {
  channelPoint: string;
  assetId: string;
  groupKey: string;
};

// ── Trade Invoices ──────────────────────────────────────────────

@ObjectType()
export class TradeInvoice {
  @Field()
  id: string;

  @Field()
  direction: string;

  @Field({ nullable: true })
  group_key?: string;

  @Field({ nullable: true })
  asset_id?: string;

  @Field()
  asset_amount: string;

  @Field({ nullable: true })
  asset_symbol?: string;

  @Field({ nullable: true })
  asset_precision?: number;

  @Field()
  sats: string;

  @Field()
  is_confirmed: boolean;

  @Field({ nullable: true })
  is_canceled?: boolean;

  @Field()
  created_at: string;

  @Field({ nullable: true })
  confirmed_at?: string;
}

@ObjectType()
export class GetTradeInvoicesResult {
  @Field(() => [TradeInvoice])
  invoices: TradeInvoice[];

  @Field({ nullable: true })
  next?: string;
}

// ── Trade Query Namespace ───────────────────────────────────────

@ObjectType()
export class TradeQueries {
  @Field(() => GetTradeInvoicesResult)
  trade_invoices: GetTradeInvoicesResult;
}

// ── Trade Readiness ─────────────────────────────────────────────

@InputType()
export class OfferReadinessInput {
  @Field()
  peer_pubkey: string;

  @Field({ nullable: true })
  tapd_asset_id?: string;

  @Field({ nullable: true })
  tapd_group_key?: string;
}

@ObjectType()
export class RecommendedNode {
  @Field()
  pubkey: string;

  @Field(() => [String])
  sockets: string[];
}

@ObjectType()
export class ChannelSummary {
  @Field(() => Int)
  open_count: number;

  @Field(() => Int)
  pending_count: number;

  @Field()
  total_local_sats: string;

  @Field()
  total_remote_sats: string;

  @Field()
  has_active_channel: boolean;
}

@ObjectType()
export class AssetChannelSummary {
  @Field(() => Int)
  open_count: number;

  @Field(() => Int)
  pending_count: number;

  @Field()
  total_local_atomic: string;

  @Field()
  total_remote_atomic: string;

  @Field()
  has_active_channel: boolean;
}

@ObjectType()
export class TradeReadinessResult {
  @Field()
  node_online: boolean;

  @Field({ nullable: true })
  public_key?: string;

  @Field({ nullable: true })
  alias?: string;

  @Field()
  has_tapd: boolean;

  @Field()
  onchain_balance_sats: string;

  @Field()
  pending_onchain_balance_sats: string;

  @Field({ nullable: true })
  deposit_address?: string;

  @Field()
  has_channel: boolean;

  @Field()
  has_active_channel: boolean;

  @Field(() => RecommendedNode, { nullable: true })
  recommended_node?: RecommendedNode;
}

@ObjectType()
export class OfferReadinessResult {
  @Field()
  is_peer_connected: boolean;

  @Field(() => ChannelSummary)
  btc_channels: ChannelSummary;

  @Field(() => AssetChannelSummary)
  asset_channels: AssetChannelSummary;

  @Field()
  has_pending_order: boolean;

  @Field()
  onchain_balance_sats: string;

  @Field()
  onchain_asset_balance: string;
}
