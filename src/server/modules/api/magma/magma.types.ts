import {
  Field,
  Float,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

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
  assetId: string;

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
  @Field({ nullable: true })
  displayAmount?: string;

  @Field({ nullable: true })
  fullAmount?: string;
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
  assetId: string;

  @Field()
  amount: string;

  @Field()
  assetRate: string;

  @Field(() => Int)
  assetPrecision: number;

  @Field(() => TapTransactionType)
  transactionType: TapTransactionType;

  @Field()
  swapNodePubkey: string;

  @Field(() => [String], { nullable: true })
  swapNodeSockets?: string[];
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
  outboundChannel: { txid: string; outputIndex: number };
};
