import {
  Field,
  Float,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

// ─── Pending Orders ─────────────────────────────────────────────

// Raw shapes returned by the Amboss Magma API (before mapping to GQL types)

export type AmbossOrderParty = {
  pubkey?: string;
  alias?: string;
};

export type AmbossOrderFeeAmount = {
  sats?: number;
};

export type AmbossOrderRaw = {
  id: string;
  created_at: string;
  status: string;
  payment_status?: string;
  source: AmbossOrderParty;
  destination: AmbossOrderParty;
  amount?: { satoshi?: { sats?: string } };
  fees?: {
    seller?: AmbossOrderFeeAmount;
    buyer?: AmbossOrderFeeAmount;
  };
  timeout?: string;
  channel_id?: string;
};

export type AmbossOrderList = {
  total: number;
  list: AmbossOrderRaw[];
};

@ObjectType()
export class MagmaOrderParty {
  @Field({ nullable: true })
  pubkey?: string;

  @Field({ nullable: true })
  alias?: string;
}

@ObjectType()
export class MagmaOrderAmount {
  @Field({ nullable: true })
  sats?: string;
}

@ObjectType()
export class MagmaOrderFeeAmount {
  @Field(() => Int, { nullable: true })
  sats?: number;
}

@ObjectType()
export class MagmaOrderFees {
  @Field(() => MagmaOrderFeeAmount, { nullable: true })
  seller?: MagmaOrderFeeAmount;

  @Field(() => MagmaOrderFeeAmount, { nullable: true })
  buyer?: MagmaOrderFeeAmount;
}

@ObjectType()
export class MagmaOrder {
  @Field()
  id: string;

  @Field()
  createdAt: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  paymentStatus?: string;

  @Field(() => MagmaOrderParty)
  source: MagmaOrderParty;

  @Field(() => MagmaOrderParty)
  destination: MagmaOrderParty;

  @Field(() => MagmaOrderAmount)
  amount: MagmaOrderAmount;

  @Field(() => MagmaOrderFees)
  fees: MagmaOrderFees;

  @Field({ nullable: true })
  timeout?: string;

  @Field({ nullable: true })
  channelId?: string;
}

@ObjectType()
export class MagmaPendingOrders {
  @Field(() => [MagmaOrder])
  purchases: MagmaOrder[];

  @Field(() => [MagmaOrder])
  sales: MagmaOrder[];

  @Field()
  magmaUrl: string;
}

// ─── Cancel Order ────────────────────────────────────────────────

export enum OrderCancellationReason {
  UNABLE_TO_CONNECT_TO_NODE = 'UNABLE_TO_CONNECT_TO_NODE',
  UNABLE_TO_PAY = 'UNABLE_TO_PAY',
  CHANNEL_SIZE_OUT_OF_BOUNDS = 'CHANNEL_SIZE_OUT_OF_BOUNDS',
}

registerEnumType(OrderCancellationReason, { name: 'OrderCancellationReason' });

@InputType()
export class CancelMagmaOrderInput {
  @Field()
  orderId: string;

  @Field(() => OrderCancellationReason)
  cancellationReason: OrderCancellationReason;
}

@ObjectType()
export class CancelMagmaOrderResult {
  @Field()
  success: boolean;
}

// ─── Enums ──────────────────────────────────────────────────────

export enum TapTransactionType {
  PURCHASE = 'PURCHASE',
  SALE = 'SALE',
}

registerEnumType(TapTransactionType, { name: 'TapTransactionType' });

export enum TapOfferSortBy {
  RATE = 'RATE',
  AVAILABLE = 'AVAILABLE',
}

registerEnumType(TapOfferSortBy, { name: 'TapOfferSortBy' });

export enum TapOfferSortDir {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(TapOfferSortDir, { name: 'TapOfferSortDir' });

// ─── Trading Offers ─────────────────────────────────────────────

@InputType()
export class GetTapOffersInput {
  @Field()
  ambossAssetId: string;

  @Field(() => TapTransactionType)
  transactionType: TapTransactionType;

  @Field(() => TapOfferSortBy, { nullable: true })
  sortBy?: TapOfferSortBy;

  @Field(() => TapOfferSortDir, { nullable: true })
  sortDir?: TapOfferSortDir;

  @Field({ nullable: true })
  minAmount?: string;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}

@ObjectType()
export class TapTradeOfferNode {
  @Field({ nullable: true })
  alias?: string;

  @Field({ nullable: true })
  pubkey?: string;

  @Field(() => [String])
  sockets: string[];
}

@ObjectType()
export class TapTradeOfferAmount {
  @Field()
  displayAmount: string;

  @Field()
  fullAmount: string;
}

@ObjectType()
export class TapTradeOffer {
  @Field()
  id: string;

  @Field()
  magmaOfferId: string;

  @Field(() => TapTradeOfferNode)
  node: TapTradeOfferNode;

  @Field(() => TapTradeOfferAmount)
  rate: TapTradeOfferAmount;

  @Field(() => TapTradeOfferAmount)
  available: TapTradeOfferAmount;
}

@ObjectType()
export class TapTradeOfferList {
  @Field(() => [TapTradeOffer])
  list: TapTradeOffer[];

  @Field()
  totalCount: number;
}

@ObjectType()
export class TapAssetPrice {
  @Field({ nullable: true })
  id?: string;

  @Field(() => Float, { nullable: true })
  usd?: number;
}

@ObjectType()
export class TapSupportedAsset {
  @Field()
  id: string;

  @Field()
  symbol: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int)
  precision: number;

  @Field({ nullable: true })
  assetId?: string;

  @Field({ nullable: true })
  groupKey?: string;

  @Field({ nullable: true })
  universeHost?: string;

  @Field(() => TapAssetPrice, { nullable: true })
  prices?: TapAssetPrice;
}

@ObjectType()
export class TapSupportedAssetList {
  @Field(() => [TapSupportedAsset])
  list: TapSupportedAsset[];

  @Field()
  totalCount: number;
}

// ─── Trade Partner Setup ───────────────────────────────────────

@InputType()
export class SetupTradePartnerInput {
  @Field()
  magmaOfferId: string;

  @Field()
  ambossAssetId: string;

  /**
   * The trade's asset amount in atomic units (UI's display input × 10^precision).
   *
   * - PURCHASE (buying an asset channel): used directly as the Magma order size.
   * - SALE (buying a sats channel): the Magma order size in sats is derived from
   *   this via `assetRate`; this value is also the outbound asset channel size.
   */
  @Field()
  assetAmount: string;

  @Field()
  assetRate: string;

  @Field(() => TapTransactionType)
  transactionType: TapTransactionType;

  @Field()
  swapNodePubkey: string;

  @Field(() => [String], { nullable: true })
  swapNodeSockets?: string[];

  /**
   * Taproot Assets hex asset ID (for ungrouped assets). Used for the sell-side
   * outbound channel — the Amboss marketplace `assetId` is different from the
   * tapd hex ID required by `fundAssetChannel`.
   */
  @Field({ nullable: true })
  tapdAssetId?: string;

  /**
   * Taproot Assets hex group key (for grouped assets). Used for the sell-side
   * outbound channel when the asset has a group key instead of a bare asset ID.
   */
  @Field({ nullable: true })
  tapdGroupKey?: string;

  /**
   * Sats used to open the outbound BTC channel for a PURCHASE. Omit to skip
   * opening the outbound channel (e.g. when the node already has sufficient
   * BTC outbound with the peer). Unused for SALE.
   */
  @Field({ nullable: true })
  satsAmount?: string;
}

@ObjectType()
export class SetupTradePartnerResult {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  magmaOrderId?: string;

  @Field({ nullable: true })
  magmaOrderStatus?: string;

  @Field({ nullable: true })
  magmaOrderAmountSats?: string;

  @Field({ nullable: true })
  magmaOrderAmountAsset?: string;

  @Field({ nullable: true })
  magmaOrderFeeSats?: string;

  @Field({ nullable: true })
  outboundChannelTxid?: string;

  @Field(() => Int, { nullable: true })
  outboundChannelOutputIndex?: number;
}

export type SetupTradePartnerAuto = {
  validate: void;
  nodeInfo: { publicKey: string };
  peer: void;
  magmaOrder: {
    id: string;
    status: string;
    invoice: string;
    amountSats?: string;
    amountAsset?: string;
    feeSats?: number;
  };
  payMagma: void;
  outboundChannel: { txid: string; outputIndex: number } | undefined;
};

// ─── Order Invoice ──────────────────────────────────────────────

@ObjectType()
export class MagmaOrderInvoice {
  @Field({ nullable: true })
  invoice?: string;
}

// ─── Namespace types ─────────────────────────────────────────────

@ObjectType()
export class MagmaOrderQueries {
  @Field(() => MagmaPendingOrders, { nullable: true })
  find_many?: MagmaPendingOrders;

  @Field(() => MagmaOrderInvoice, { nullable: true })
  get_invoice?: MagmaOrderInvoice;
}

@ObjectType()
export class MagmaQueries {
  @Field()
  id: string;
  @Field(() => MagmaOrderQueries)
  orders: MagmaOrderQueries;

  @Field(() => TapTradeOfferList)
  get_tap_offers: TapTradeOfferList;
}

@ObjectType()
export class MagmaMutations {
  @Field(() => CancelMagmaOrderResult)
  cancel_order: CancelMagmaOrderResult;
}

@ObjectType()
export class RailsQueries {
  @Field()
  id: string;
  @Field(() => TapSupportedAssetList)
  get_tap_supported_assets: TapSupportedAssetList;
}
