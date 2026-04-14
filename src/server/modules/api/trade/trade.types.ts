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
