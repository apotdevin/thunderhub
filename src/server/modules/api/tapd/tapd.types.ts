import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

// ─── Enums ──────────────────────────────────────────────────────

export enum TapAssetType {
  NORMAL = 0,
  COLLECTIBLE = 1,
}

registerEnumType(TapAssetType, { name: 'TapAssetType' });

// ─── Asset Genesis ──────────────────────────────────────────────

@ObjectType()
export class TapAssetGenesis {
  @Field({ nullable: true })
  genesisPoint?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  metaHash?: string;

  @Field({ nullable: true })
  assetId?: string;

  @Field({ nullable: true })
  assetType?: number;

  @Field({ nullable: true })
  outputIndex?: number;
}

// ─── Asset ──────────────────────────────────────────────────────

@ObjectType()
export class TapAsset {
  @Field(() => TapAssetGenesis, { nullable: true })
  assetGenesis?: TapAssetGenesis;

  @Field({ nullable: true })
  amount?: string;

  @Field({ nullable: true })
  lockTime?: number;

  @Field({ nullable: true })
  relativeLockTime?: number;

  @Field({ nullable: true })
  scriptVersion?: number;

  @Field({ nullable: true })
  scriptKey?: string;

  @Field({ nullable: true })
  isSpent?: boolean;

  @Field({ nullable: true })
  isBurn?: boolean;
}

@ObjectType()
export class TapAssetList {
  @Field(() => [TapAsset])
  assets: TapAsset[];
}

// ─── Balances ───────────────────────────────────────────────────

@ObjectType()
export class TapAssetBalanceEntry {
  @Field({ nullable: true })
  assetId?: string;

  @Field({ nullable: true })
  groupKey?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  balance?: string;
}

@ObjectType()
export class TapBalances {
  @Field(() => [TapAssetBalanceEntry])
  balances: TapAssetBalanceEntry[];
}

// ─── Address ────────────────────────────────────────────────────

@ObjectType()
export class TapAddress {
  @Field({ nullable: true })
  encoded?: string;

  @Field({ nullable: true })
  assetId?: string;

  @Field({ nullable: true })
  groupKey?: string;

  @Field({ nullable: true })
  amount?: string;

  @Field({ nullable: true })
  assetType?: string;

  @Field({ nullable: true })
  scriptKey?: string;

  @Field({ nullable: true })
  internalKey?: string;

  @Field({ nullable: true })
  taprootOutputKey?: string;
}

// ─── Transfer ───────────────────────────────────────────────────

@ObjectType()
export class TapTransferInput {
  @Field({ nullable: true })
  anchorPoint?: string;

  @Field({ nullable: true })
  assetId?: string;

  @Field({ nullable: true })
  amount?: string;
}

@ObjectType()
export class TapTransferOutput {
  @Field({ nullable: true })
  assetId?: string;

  @Field({ nullable: true })
  amount?: string;

  @Field({ nullable: true })
  scriptKeyIsLocal?: boolean;

  @Field({ nullable: true })
  outputType?: string;
}

@ObjectType()
export class TapTransfer {
  @Field({ nullable: true })
  anchorTxHash?: string;

  @Field({ nullable: true })
  anchorTxHeightHint?: number;

  @Field({ nullable: true })
  anchorTxChainFees?: string;

  @Field({ nullable: true })
  transferTimestamp?: string;

  @Field({ nullable: true })
  label?: string;

  @Field(() => [TapTransferInput], { nullable: true })
  inputs?: TapTransferInput[];

  @Field(() => [TapTransferOutput], { nullable: true })
  outputs?: TapTransferOutput[];
}

@ObjectType()
export class TapTransferList {
  @Field(() => [TapTransfer])
  transfers: TapTransfer[];
}

// ─── Mint ───────────────────────────────────────────────────────

@ObjectType()
export class TapMintResponse {
  @Field({ nullable: true })
  batchKey?: string;
}

@ObjectType()
export class TapFinalizeBatchResponse {
  @Field({ nullable: true })
  batchKey?: string;
}

// ─── Universe ───────────────────────────────────────────────────

@ObjectType()
export class TapUniverseInfo {
  @Field({ nullable: true })
  numAssets?: number;

  @Field({ nullable: true })
  numSyncs?: number;

  @Field({ nullable: true })
  numProofs?: number;
}

@ObjectType()
export class TapUniverseStats {
  @Field({ nullable: true })
  numTotalAssets?: number;

  @Field({ nullable: true })
  numTotalSyncs?: number;

  @Field({ nullable: true })
  numTotalProofs?: number;

  @Field({ nullable: true })
  numTotalGroups?: number;
}

@ObjectType()
export class TapUniverseAsset {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  assetId?: string;

  @Field({ nullable: true })
  groupKey?: string;

  @Field({ nullable: true })
  proofType?: string;

  @Field({ nullable: true })
  totalSupply?: string;
}

@ObjectType()
export class TapUniverseAssetList {
  @Field(() => [TapUniverseAsset])
  assets: TapUniverseAsset[];
}

@ObjectType()
export class TapFederationServer {
  @Field()
  host: string;

  @Field({ nullable: true })
  id?: number;
}

@ObjectType()
export class TapFederationServerList {
  @Field({ nullable: true })
  nodeAddress?: string;

  @Field(() => [TapFederationServer])
  servers: TapFederationServer[];
}

@ObjectType()
export class TapSyncResult {
  @Field(() => [String])
  syncedUniverses: string[];
}

@ObjectType()
export class TapFundChannelResponse {
  @Field({ nullable: true })
  txid?: string;

  @Field({ nullable: true })
  outputIndex?: number;
}

// ─── Trading Offers ─────────────────────────────────────────────

@ObjectType()
export class TapTradeOfferNode {
  @Field({ nullable: true })
  alias?: string;

  @Field({ nullable: true })
  pubkey?: string;
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
