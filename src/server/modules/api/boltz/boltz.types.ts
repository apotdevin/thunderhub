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

export type BoltzError = { error: string };

export type BroadcastTransaction = { id: string } | BoltzError;

export type CreateReverseSwap =
  | {
      id: string;
      invoice: string;
      swapTree: {
        claimLeaf: {
          version: number;
          output: string;
        };
        refundLeaf: {
          version: number;
          output: string;
        };
      };
      lockupAddress: string;
      refundPublicKey: string;
      refundAddress: string;
      timeoutBlockHeight: number;
      onchainAmount: number;
      blindingKey: string;
      referralId: string;
    }
  | BoltzError;

export type ReverseSwapPair =
  | {
      [key: string]: {
        [key: string]: {
          hash: string;
          limits: { maximal: number; minimal: number };
          fees: {
            percentage: number;
            minerFees: { claim: number; lockup: number };
          };
        };
      };
    }
  | BoltzError;

export type SwapStatus =
  | {
      status: string;
      zeroConfRejected: true;
      transaction: { id: string; hex: string };
    }
  | BoltzError;

export const isBoltzError = (obj: unknown): obj is BoltzError => {
  return !!(obj as BoltzError).error;
};
