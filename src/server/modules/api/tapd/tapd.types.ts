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
  @Field()
  genesisPoint: string;

  @Field()
  name: string;

  @Field()
  metaHash: string;

  @Field()
  assetId: string;

  @Field()
  assetType: number;

  @Field()
  outputIndex: number;
}

// ─── Asset ──────────────────────────────────────────────────────

@ObjectType()
export class TapAsset {
  @Field(() => TapAssetGenesis, { nullable: true })
  assetGenesis?: TapAssetGenesis;

  @Field()
  amount: string;

  @Field()
  lockTime: number;

  @Field()
  relativeLockTime: number;

  @Field()
  scriptVersion: number;

  @Field()
  scriptKey: string;

  @Field()
  isSpent: boolean;

  @Field()
  isBurn: boolean;
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

  @Field()
  balance: string;
}

@ObjectType()
export class TapBalances {
  @Field(() => [TapAssetBalanceEntry])
  balances: TapAssetBalanceEntry[];
}

// ─── Address ────────────────────────────────────────────────────

@ObjectType()
export class TapAddress {
  @Field()
  encoded: string;

  @Field()
  assetId: string;

  @Field({ nullable: true })
  groupKey?: string;

  @Field()
  amount: string;

  @Field({ nullable: true })
  assetType?: string;

  @Field()
  scriptKey: string;

  @Field()
  internalKey: string;

  @Field()
  taprootOutputKey: string;
}

// ─── Transfer ───────────────────────────────────────────────────

@ObjectType()
export class TapTransferInput {
  @Field()
  anchorPoint: string;

  @Field()
  assetId: string;

  @Field()
  amount: string;
}

@ObjectType()
export class TapTransferOutput {
  @Field()
  assetId: string;

  @Field()
  amount: string;

  @Field()
  scriptKeyIsLocal: boolean;

  @Field()
  outputType: string;
}

@ObjectType()
export class TapTransfer {
  @Field()
  anchorTxHash: string;

  @Field()
  anchorTxHeightHint: number;

  @Field()
  anchorTxChainFees: string;

  @Field()
  transferTimestamp: string;

  @Field({ nullable: true })
  label?: string;

  @Field(() => [TapTransferInput])
  inputs: TapTransferInput[];

  @Field(() => [TapTransferOutput])
  outputs: TapTransferOutput[];
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
  @Field()
  runtimeId: string;
}

@ObjectType()
export class TapUniverseStats {
  @Field()
  numTotalAssets: number;

  @Field()
  numTotalSyncs: number;

  @Field()
  numTotalProofs: number;

  @Field()
  numTotalGroups: number;
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

  @Field()
  totalSupply: string;
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
  @Field()
  txid: string;

  @Field()
  outputIndex: number;
}
