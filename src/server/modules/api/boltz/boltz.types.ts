import { Field, ObjectType } from '@nestjs/graphql';
import { DecodeInvoice } from '../invoices/invoices.types';

@ObjectType()
export class BoltzInfoType {
  @Field()
  max: number;
  @Field()
  min: number;
  @Field()
  feePercent: number;
}

@ObjectType()
export class BoltzSwapTransaction {
  @Field({ nullable: true })
  id: string;
  @Field({ nullable: true })
  hex: string;
  @Field({ nullable: true })
  eta: number;
}

@ObjectType()
export class BoltzSwapStatus {
  @Field()
  status: string;
  @Field(() => BoltzSwapTransaction, { nullable: true })
  transaction: BoltzSwapTransaction;
}

@ObjectType()
export class BoltzSwap {
  @Field({ nullable: true })
  id: string;
  @Field(() => BoltzSwapStatus, { nullable: true })
  boltz: BoltzSwapStatus;
}

@ObjectType()
export class CreateBoltzReverseSwapType {
  @Field()
  id: string;
  @Field()
  invoice: string;
  @Field()
  redeemScript: string;
  @Field()
  onchainAmount: number;
  @Field()
  timeoutBlockHeight: number;
  @Field()
  lockupAddress: string;
  @Field({ nullable: true })
  minerFeeInvoice: string;
  @Field(() => DecodeInvoice, { nullable: true })
  decodedInvoice: DecodeInvoice;
  @Field()
  receivingAddress: string;
  @Field({ nullable: true })
  preimage: string;
  @Field({ nullable: true })
  preimageHash: string;
  @Field({ nullable: true })
  privateKey: string;
  @Field({ nullable: true })
  publicKey: string;
}
