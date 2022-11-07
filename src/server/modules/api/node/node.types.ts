import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NodeType {
  @Field()
  alias: string;
  @Field()
  public_key: string;
}

@ObjectType()
export class Node {
  @Field(() => NodeType, { nullable: true })
  node: NodeType;
}

@ObjectType()
export class NodeInfo {
  @Field(() => [String])
  chains: string[];
  @Field()
  color: string;
  @Field()
  active_channels_count: number;
  @Field()
  closed_channels_count: number;
  @Field()
  alias: string;
  @Field()
  current_block_hash: string;
  @Field()
  current_block_height: number;
  @Field()
  is_synced_to_chain: boolean;
  @Field()
  is_synced_to_graph: boolean;
  @Field()
  latest_block_at: string;
  @Field()
  peers_count: number;
  @Field()
  pending_channels_count: number;
  @Field()
  public_key: string;
  @Field(() => [String])
  uris: string[];
  @Field()
  version: string;
}

@ObjectType()
export class OnChainBalance {
  @Field()
  confirmed: string;
  @Field()
  pending: string;
  @Field()
  closing: string;
}

@ObjectType()
export class LightningBalance {
  @Field()
  confirmed: string;
  @Field()
  active: string;
  @Field()
  commit: string;
  @Field()
  pending: string;
}

@ObjectType()
export class Balances {
  @Field(() => OnChainBalance)
  onchain: OnChainBalance;
  @Field(() => LightningBalance)
  lightning: LightningBalance;
  @Field({ nullable: true })
  liquid: string;
}
