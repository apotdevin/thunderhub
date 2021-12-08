import { Field, ObjectType } from '@nestjs/graphql';

export type RebalanceResponseType = { rebalance: [any, any, any] };

@ObjectType()
class BosIncrease {
  @Field()
  increased_inbound_on: string;
  @Field()
  liquidity_inbound: string;
  @Field()
  liquidity_inbound_opening: string;
  @Field()
  liquidity_inbound_pending: string;
  @Field()
  liquidity_outbound: string;
  @Field()
  liquidity_outbound_opening: string;
  @Field()
  liquidity_outbound_pending: string;
}

@ObjectType()
class BosDecrease {
  @Field()
  decreased_inbound_on: string;
  @Field()
  liquidity_inbound: string;
  @Field()
  liquidity_inbound_opening: string;
  @Field()
  liquidity_inbound_pending: string;
  @Field()
  liquidity_outbound: string;
  @Field()
  liquidity_outbound_opening: string;
  @Field()
  liquidity_outbound_pending: string;
}

@ObjectType()
class BosResult {
  @Field()
  rebalanced: string;
  @Field()
  rebalance_fees_spent: string;
}

@ObjectType()
export class BosRebalanceResult {
  @Field(() => BosIncrease, { nullable: true })
  increase: BosIncrease;
  @Field(() => BosDecrease, { nullable: true })
  decrease: BosDecrease;
  @Field(() => BosResult, { nullable: true })
  result: BosResult;
}
