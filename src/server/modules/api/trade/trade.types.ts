import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { TapTransactionType } from '../magma/magma.types';

@InputType()
export class TradeQuoteInput {
  @Field()
  tapdAssetId: string;

  @Field({ nullable: true })
  tapdGroupKey?: string;

  @Field()
  assetAmount: string;

  @Field(() => TapTransactionType)
  transactionType: TapTransactionType;

  @Field()
  peerPubkey: string;

  @Field({ nullable: true })
  expiry?: number;
}

@ObjectType()
export class TradeQuoteResult {
  @Field()
  satsAmount: string;

  @Field()
  assetAmount: string;

  @Field({ nullable: true })
  rateFixed?: string;

  @Field({ nullable: true })
  paymentRequest?: string;

  @Field({ nullable: true })
  rfqId?: string;

  @Field({ nullable: true })
  expiryEpoch?: string;
}

@InputType()
export class ExecuteTradeInput {
  @Field()
  tapdAssetId: string;

  @Field({ nullable: true })
  tapdGroupKey?: string;

  @Field()
  assetAmount: string;

  @Field()
  satsAmount: string;

  @Field(() => TapTransactionType)
  transactionType: TapTransactionType;

  @Field()
  peerPubkey: string;

  @Field({ nullable: true })
  paymentRequest?: string;

  @Field({ nullable: true })
  rfqId?: string;

  @Field({ nullable: true })
  expiryEpoch?: string;
}

@ObjectType()
export class ExecuteTradeResult {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  paymentPreimage?: string;

  @Field({ nullable: true })
  satsAmount?: string;

  @Field({ nullable: true })
  feeSats?: string;
}

export type BtcChannel = {
  id: string;
  capacity: number;
  local_balance: number;
  remote_balance: number;
};

export type TaChannel = BtcChannel & {
  local_reserve: number;
  other_ids: string[];
  partner_scid_alias?: string;
  transaction_id: string;
  transaction_vout: number;
};

export type TaChannelPointAndId = {
  channelPoint: string;
  assetId: string;
  groupKey: string;
};
