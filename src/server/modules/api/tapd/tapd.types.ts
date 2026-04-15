import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

// ─── Enums ──────────────────────────────────────────────────────

export enum TapAssetType {
  NORMAL = 0,
  COLLECTIBLE = 1,
}

registerEnumType(TapAssetType, { name: 'TapAssetType' });

export enum TapBalanceGroupBy {
  GROUP_KEY = 'groupKey',
  ASSET_ID = 'assetId',
}

registerEnumType(TapBalanceGroupBy, { name: 'TapBalanceGroupBy' });

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

  @Field(() => TapAssetType)
  assetType: TapAssetType;

  @Field(() => Int)
  outputIndex: number;
}

// ─── Asset ──────────────────────────────────────────────────────

@ObjectType()
export class TapAsset {
  @Field(() => TapAssetGenesis, { nullable: true })
  assetGenesis?: TapAssetGenesis;

  @Field()
  amount: string;

  @Field(() => Int)
  lockTime: number;

  @Field(() => Int)
  relativeLockTime: number;

  @Field(() => Int)
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

  @Field(() => [String], { nullable: true })
  names?: string[];

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

  @Field()
  assetType: string;

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

  @Field(() => Int)
  anchorTxHeightHint: number;

  @Field()
  anchorTxChainFees: string;

  @Field()
  transferTimestamp: string;

  @Field()
  label: string;

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
  @Field()
  batchKey: string;
}

@ObjectType()
export class TapFinalizeBatchResponse {
  @Field()
  batchKey: string;
}

// ─── Universe ───────────────────────────────────────────────────

@ObjectType()
export class TapUniverseInfo {
  @Field()
  runtimeId: string;
}

@ObjectType()
export class TapUniverseStats {
  @Field(() => Int)
  numTotalAssets: number;

  @Field(() => Int)
  numTotalSyncs: number;

  @Field(() => Int)
  numTotalProofs: number;

  @Field(() => Int)
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

  @Field()
  proofType: string;

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

  @Field(() => Int)
  id: number;
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

@InputType()
export class TapAssetInvoiceInput {
  @Field()
  assetAmount: string;

  @Field({ nullable: true })
  assetId?: string;

  @Field({ nullable: true })
  groupKey?: string;

  @Field({ nullable: true })
  peerPubkey?: string;

  @Field({ nullable: true })
  memo?: string;

  @Field(() => Int, { nullable: true })
  expiry?: number;
}

@InputType()
export class TapMintAssetInput {
  @Field()
  name: string;

  @Field()
  amount: string;

  @Field(() => Int)
  precision: number;

  @Field(() => TapAssetType, { defaultValue: TapAssetType.NORMAL })
  assetType: TapAssetType;

  @Field({ defaultValue: true })
  grouped: boolean;

  @Field({ nullable: true })
  groupKey?: string;
}

@InputType()
export class TapFundChannelInput {
  @Field()
  peerPubkey: string;

  @Field()
  assetAmount: string;

  @Field({ nullable: true })
  groupKey?: string;

  @Field({ nullable: true })
  assetId?: string;

  @Field(() => Int, { nullable: true })
  feeRateSatPerVbyte?: number;

  @Field(() => Int, { nullable: true })
  pushSat?: number;

  @Field({ nullable: true })
  universeHost?: string;
}

@ObjectType()
export class TapAssetInvoiceResponse {
  @Field()
  paymentRequest: string;

  @Field()
  rHash: string;

  @Field()
  addIndex: string;

  @Field()
  paymentAddr: string;

  @Field({ nullable: true })
  assetId?: string;

  @Field({ nullable: true })
  groupKey?: string;

  @Field()
  assetAmount: string;
}

@ObjectType()
export class TapFundChannelResponse {
  @Field()
  txid: string;

  @Field(() => Int)
  outputIndex: number;
}

@ObjectType()
export class TapAssetChannelBalance {
  @Field()
  channelPoint: string;

  @Field()
  partnerPublicKey: string;

  @Field()
  assetId: string;

  @Field({ nullable: true })
  groupKey?: string;

  @Field()
  localBalance: string;

  @Field()
  remoteBalance: string;

  @Field()
  capacity: string;
}
