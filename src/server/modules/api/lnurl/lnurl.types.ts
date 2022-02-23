import { createUnionType, Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PayRequest {
  @Field({ nullable: true })
  callback: string;
  @Field({ nullable: true })
  maxSendable: string;
  @Field({ nullable: true })
  minSendable: string;
  @Field({ nullable: true })
  metadata: string;
  @Field({ nullable: true })
  commentAllowed: number;
  @Field({ nullable: true })
  tag: string;
}

@ObjectType()
export class AuthResponse {
  @Field()
  status: string;
  @Field()
  message: string;
}

@ObjectType()
export class WithdrawRequest {
  @Field({ nullable: true })
  callback: string;
  @Field({ nullable: true })
  k1: string;
  @Field({ nullable: true })
  maxWithdrawable: string;
  @Field({ nullable: true })
  defaultDescription: string;
  @Field({ nullable: true })
  minWithdrawable: string;
  @Field({ nullable: true })
  tag: string;
}

@ObjectType()
export class ChannelRequest {
  @Field({ nullable: true })
  tag: string;
  @Field({ nullable: true })
  k1: string;
  @Field({ nullable: true })
  callback: string;
  @Field({ nullable: true })
  uri: string;
}

export const LnUrlRequestUnion = createUnionType({
  name: 'LnUrlRequest',
  types: () => [WithdrawRequest, PayRequest, ChannelRequest],
  resolveType: request => {
    if ('maxSendable' in request) {
      return PayRequest;
    }
    if ('maxWithdrawable' in request) {
      return WithdrawRequest;
    }
    if ('uri' in request) {
      return ChannelRequest;
    }

    return undefined;
  },
});

export type LnUrlPayResponseType = {
  pr?: string;
  successAction?: { tag: string };
  status?: string;
  reason?: string;
};

@ObjectType()
export class PaySuccess {
  @Field({ nullable: true })
  tag: string;
  @Field({ nullable: true })
  description: string;
  @Field({ nullable: true })
  url: string;
  @Field({ nullable: true })
  message: string;
  @Field({ nullable: true })
  ciphertext: string;
  @Field({ nullable: true })
  iv: string;
}
