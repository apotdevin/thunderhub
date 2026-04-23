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
  genesis_point: string;

  @Field()
  name: string;

  @Field()
  meta_hash: string;

  @Field()
  asset_id: string;

  @Field(() => TapAssetType)
  asset_type: TapAssetType;

  @Field(() => Int)
  output_index: number;
}

// ─── Asset ──────────────────────────────────────────────────────

@ObjectType()
export class TapAsset {
  @Field(() => TapAssetGenesis, { nullable: true })
  asset_genesis?: TapAssetGenesis;

  @Field()
  amount: string;

  @Field(() => Int)
  lock_time: number;

  @Field(() => Int)
  relative_lock_time: number;

  @Field(() => Int)
  script_version: number;

  @Field()
  script_key: string;

  @Field()
  is_spent: boolean;

  @Field()
  is_burn: boolean;
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
  asset_id?: string;

  @Field({ nullable: true })
  group_key?: string;

  @Field(() => [String], { nullable: true })
  names?: string[];

  @Field()
  balance: string;

  @Field(() => Int)
  precision: number;
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
  asset_id: string;

  @Field({ nullable: true })
  group_key?: string;

  @Field()
  amount: string;

  @Field()
  asset_type: string;

  @Field()
  script_key: string;

  @Field()
  internal_key: string;

  @Field()
  taproot_output_key: string;
}

// ─── Transfer ───────────────────────────────────────────────────

@ObjectType()
export class TapTransferInput {
  @Field()
  anchor_point: string;

  @Field()
  asset_id: string;

  @Field()
  amount: string;

  @Field(() => Int)
  precision: number;
}

@ObjectType()
export class TapTransferOutput {
  @Field()
  asset_id: string;

  @Field()
  amount: string;

  @Field()
  script_key_is_local: boolean;

  @Field()
  output_type: string;

  @Field(() => Int)
  precision: number;
}

@ObjectType()
export class TapTransfer {
  @Field()
  anchor_tx_hash: string;

  @Field(() => Int)
  anchor_tx_height_hint: number;

  @Field()
  anchor_tx_chain_fees: string;

  @Field()
  transfer_timestamp: string;

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
  batch_key: string;
}

@ObjectType()
export class TapFinalizeBatchResponse {
  @Field()
  batch_key: string;
}

// ─── Daemon Info ───────────────────────────────────────────────

@ObjectType()
export class TapDaemonInfo {
  @Field()
  version: string;

  @Field()
  lnd_version: string;

  @Field()
  network: string;

  @Field()
  lnd_identity_pubkey: string;

  @Field()
  node_alias: string;

  @Field(() => Int)
  block_height: number;

  @Field()
  block_hash: string;

  @Field()
  sync_to_chain: boolean;
}

// ─── Universe ───────────────────────────────────────────────────

@ObjectType()
export class TapUniverseInfo {
  @Field()
  runtime_id: string;
}

@ObjectType()
export class TapUniverseStats {
  @Field(() => Int)
  num_total_assets: number;

  @Field(() => Int)
  num_total_syncs: number;

  @Field(() => Int)
  num_total_proofs: number;

  @Field(() => Int)
  num_total_groups: number;
}

@ObjectType()
export class TapUniverseAsset {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  asset_id?: string;

  @Field({ nullable: true })
  group_key?: string;

  @Field()
  proof_type: string;

  @Field()
  total_supply: string;
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
  node_address?: string;

  @Field(() => [TapFederationServer])
  servers: TapFederationServer[];
}

@ObjectType()
export class TapSyncResult {
  @Field(() => [String])
  synced_universes: string[];
}

@InputType()
export class TapAssetInvoiceInput {
  @Field()
  asset_amount: string;

  @Field({ nullable: true })
  asset_id?: string;

  @Field({ nullable: true })
  group_key?: string;

  @Field({ nullable: true })
  peer_pubkey?: string;

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
  asset_type: TapAssetType;

  @Field({ defaultValue: true })
  grouped: boolean;

  @Field({ nullable: true })
  group_key?: string;
}

@InputType()
export class TapFundChannelInput {
  @Field()
  peer_pubkey: string;

  @Field()
  asset_amount: string;

  @Field({ nullable: true })
  group_key?: string;

  @Field({ nullable: true })
  asset_id?: string;

  @Field(() => Int, { nullable: true })
  fee_rate_sat_per_vbyte?: number;

  @Field(() => Int, { nullable: true })
  push_sat?: number;

  @Field({ nullable: true })
  universe_host?: string;
}

@ObjectType()
export class TapAssetInvoiceResponse {
  @Field()
  payment_request: string;

  @Field()
  r_hash: string;

  @Field()
  add_index: string;

  @Field()
  payment_addr: string;

  @Field({ nullable: true })
  asset_id?: string;

  @Field({ nullable: true })
  group_key?: string;

  @Field()
  asset_amount: string;
}

@ObjectType()
export class TapFundChannelResponse {
  @Field()
  txid: string;

  @Field(() => Int)
  output_index: number;
}

@ObjectType()
export class TapAssetChannelBalance {
  @Field()
  channel_point: string;

  @Field()
  partner_public_key: string;

  @Field()
  asset_id: string;

  @Field({ nullable: true })
  asset_name?: string;

  @Field()
  asset_precision: number;

  @Field({ nullable: true })
  group_key?: string;

  @Field()
  local_balance: string;

  @Field()
  remote_balance: string;

  @Field()
  capacity: string;
}

// ─── Namespace containers ───────────────────────────────────────

@ObjectType()
export class TaprootAssetsQueries {
  @Field()
  id: string;
}

@ObjectType()
export class TaprootAssetsMutations {}
