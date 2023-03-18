export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AmbossSubscription = {
  __typename?: 'AmbossSubscription';
  end_date: Scalars['String'];
  subscribed: Scalars['Boolean'];
  upgradable: Scalars['Boolean'];
};

export type AmbossUser = {
  __typename?: 'AmbossUser';
  backups: UserBackupInfo;
  subscription: AmbossSubscription;
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  message: Scalars['String'];
  status: Scalars['String'];
};

export type Balances = {
  __typename?: 'Balances';
  lightning: LightningBalance;
  onchain: OnChainBalance;
};

export type BaseInvoice = {
  __typename?: 'BaseInvoice';
  id: Scalars['String'];
  request: Scalars['String'];
};

export type BaseNode = {
  __typename?: 'BaseNode';
  _id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  public_key: Scalars['String'];
  socket: Scalars['String'];
};

export type BasePoints = {
  __typename?: 'BasePoints';
  alias: Scalars['String'];
  amount: Scalars['Float'];
};

export type BitcoinFee = {
  __typename?: 'BitcoinFee';
  fast: Scalars['Float'];
  halfHour: Scalars['Float'];
  hour: Scalars['Float'];
  minimum: Scalars['Float'];
};

export type BoltzInfoType = {
  __typename?: 'BoltzInfoType';
  feePercent: Scalars['Float'];
  max: Scalars['Float'];
  min: Scalars['Float'];
};

export type BoltzSwap = {
  __typename?: 'BoltzSwap';
  boltz?: Maybe<BoltzSwapStatus>;
  id?: Maybe<Scalars['String']>;
};

export type BoltzSwapStatus = {
  __typename?: 'BoltzSwapStatus';
  status: Scalars['String'];
  transaction?: Maybe<BoltzSwapTransaction>;
};

export type BoltzSwapTransaction = {
  __typename?: 'BoltzSwapTransaction';
  eta?: Maybe<Scalars['Float']>;
  hex?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
};

export type BosDecrease = {
  __typename?: 'BosDecrease';
  decreased_inbound_on: Scalars['String'];
  liquidity_inbound: Scalars['String'];
  liquidity_inbound_opening?: Maybe<Scalars['String']>;
  liquidity_inbound_pending?: Maybe<Scalars['String']>;
  liquidity_outbound: Scalars['String'];
  liquidity_outbound_opening?: Maybe<Scalars['String']>;
  liquidity_outbound_pending?: Maybe<Scalars['String']>;
};

export type BosIncrease = {
  __typename?: 'BosIncrease';
  increased_inbound_on: Scalars['String'];
  liquidity_inbound: Scalars['String'];
  liquidity_inbound_opening?: Maybe<Scalars['String']>;
  liquidity_inbound_pending?: Maybe<Scalars['String']>;
  liquidity_outbound: Scalars['String'];
  liquidity_outbound_opening?: Maybe<Scalars['String']>;
  liquidity_outbound_pending?: Maybe<Scalars['String']>;
};

export type BosRebalanceResult = {
  __typename?: 'BosRebalanceResult';
  decrease?: Maybe<BosDecrease>;
  increase?: Maybe<BosIncrease>;
  result?: Maybe<BosResult>;
};

export type BosResult = {
  __typename?: 'BosResult';
  rebalance_fees_spent: Scalars['String'];
  rebalanced: Scalars['String'];
};

export type ChainAddressSend = {
  __typename?: 'ChainAddressSend';
  confirmationCount: Scalars['Float'];
  id: Scalars['String'];
  isConfirmed: Scalars['Boolean'];
  isOutgoing: Scalars['Boolean'];
  tokens?: Maybe<Scalars['Float']>;
};

export type ChainTransaction = {
  __typename?: 'ChainTransaction';
  block_id?: Maybe<Scalars['String']>;
  confirmation_count?: Maybe<Scalars['Float']>;
  confirmation_height?: Maybe<Scalars['Float']>;
  created_at: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  fee?: Maybe<Scalars['Float']>;
  id: Scalars['String'];
  is_confirmed: Scalars['Boolean'];
  is_outgoing: Scalars['Boolean'];
  output_addresses: Array<Scalars['String']>;
  tokens: Scalars['Float'];
  transaction?: Maybe<Scalars['String']>;
};

export type Channel = {
  __typename?: 'Channel';
  capacity: Scalars['Float'];
  channel_age: Scalars['Float'];
  commit_transaction_fee: Scalars['Float'];
  commit_transaction_weight: Scalars['Float'];
  id: Scalars['String'];
  is_active: Scalars['Boolean'];
  is_closing: Scalars['Boolean'];
  is_opening: Scalars['Boolean'];
  is_partner_initiated: Scalars['Boolean'];
  is_private: Scalars['Boolean'];
  local_balance: Scalars['Float'];
  local_reserve: Scalars['Float'];
  partner_fee_info?: Maybe<SingleChannel>;
  partner_node_info: Node;
  partner_public_key: Scalars['String'];
  past_states: Scalars['Float'];
  pending_payments: Array<PendingPayment>;
  pending_resume: PendingResume;
  received: Scalars['Float'];
  remote_balance: Scalars['Float'];
  remote_reserve: Scalars['Float'];
  sent: Scalars['Float'];
  time_offline?: Maybe<Scalars['Float']>;
  time_online?: Maybe<Scalars['Float']>;
  transaction_id: Scalars['String'];
  transaction_vout: Scalars['Float'];
  unsettled_balance: Scalars['Float'];
};

export type ChannelFeeHealth = {
  __typename?: 'ChannelFeeHealth';
  id?: Maybe<Scalars['String']>;
  mySide?: Maybe<FeeHealth>;
  partner?: Maybe<Node>;
  partnerSide?: Maybe<FeeHealth>;
};

export type ChannelHealth = {
  __typename?: 'ChannelHealth';
  averageVolumeNormalized?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  partner?: Maybe<Node>;
  score?: Maybe<Scalars['Float']>;
  volumeNormalized?: Maybe<Scalars['String']>;
};

export type ChannelReport = {
  __typename?: 'ChannelReport';
  commit: Scalars['Float'];
  incomingPendingHtlc: Scalars['Float'];
  local: Scalars['Float'];
  maxIn: Scalars['Float'];
  maxOut: Scalars['Float'];
  outgoingPendingHtlc: Scalars['Float'];
  remote: Scalars['Float'];
  totalPendingHtlc: Scalars['Float'];
};

export type ChannelRequest = {
  __typename?: 'ChannelRequest';
  callback?: Maybe<Scalars['String']>;
  k1?: Maybe<Scalars['String']>;
  tag?: Maybe<Scalars['String']>;
  uri?: Maybe<Scalars['String']>;
};

export type ChannelTimeHealth = {
  __typename?: 'ChannelTimeHealth';
  id?: Maybe<Scalars['String']>;
  monitoredDowntime?: Maybe<Scalars['Float']>;
  monitoredTime?: Maybe<Scalars['Float']>;
  monitoredUptime?: Maybe<Scalars['Float']>;
  partner?: Maybe<Node>;
  score?: Maybe<Scalars['Float']>;
  significant?: Maybe<Scalars['Boolean']>;
};

export type ChannelsFeeHealth = {
  __typename?: 'ChannelsFeeHealth';
  channels?: Maybe<Array<ChannelFeeHealth>>;
  score?: Maybe<Scalars['Float']>;
};

export type ChannelsHealth = {
  __typename?: 'ChannelsHealth';
  channels?: Maybe<Array<ChannelHealth>>;
  score?: Maybe<Scalars['Float']>;
};

export type ChannelsTimeHealth = {
  __typename?: 'ChannelsTimeHealth';
  channels?: Maybe<Array<ChannelTimeHealth>>;
  score?: Maybe<Scalars['Float']>;
};

export type ClosedChannel = {
  __typename?: 'ClosedChannel';
  capacity: Scalars['Float'];
  channel_age?: Maybe<Scalars['Float']>;
  close_confirm_height?: Maybe<Scalars['Float']>;
  close_transaction_id?: Maybe<Scalars['String']>;
  closed_for_blocks?: Maybe<Scalars['Float']>;
  final_local_balance: Scalars['Float'];
  final_time_locked_balance: Scalars['Float'];
  id?: Maybe<Scalars['String']>;
  is_breach_close: Scalars['Boolean'];
  is_cooperative_close: Scalars['Boolean'];
  is_funding_cancel: Scalars['Boolean'];
  is_local_force_close: Scalars['Boolean'];
  is_remote_force_close: Scalars['Boolean'];
  partner_node_info: Node;
  partner_public_key: Scalars['String'];
  transaction_id: Scalars['String'];
  transaction_vout: Scalars['Float'];
};

export enum ConfigFields {
  Backups = 'BACKUPS',
  ChannelsPush = 'CHANNELS_PUSH',
  Healthchecks = 'HEALTHCHECKS',
  OnchainPush = 'ONCHAIN_PUSH',
  PrivateChannelsPush = 'PRIVATE_CHANNELS_PUSH',
}

export type ConfigState = {
  __typename?: 'ConfigState';
  backup_state: Scalars['Boolean'];
  channels_push_enabled: Scalars['Boolean'];
  healthcheck_ping_state: Scalars['Boolean'];
  onchain_push_enabled: Scalars['Boolean'];
  private_channels_push_enabled: Scalars['Boolean'];
};

export type CreateBoltzReverseSwapType = {
  __typename?: 'CreateBoltzReverseSwapType';
  decodedInvoice?: Maybe<DecodeInvoice>;
  id: Scalars['String'];
  invoice: Scalars['String'];
  lockupAddress: Scalars['String'];
  minerFeeInvoice?: Maybe<Scalars['String']>;
  onchainAmount: Scalars['Float'];
  preimage?: Maybe<Scalars['String']>;
  preimageHash?: Maybe<Scalars['String']>;
  privateKey?: Maybe<Scalars['String']>;
  publicKey?: Maybe<Scalars['String']>;
  receivingAddress: Scalars['String'];
  redeemScript: Scalars['String'];
  timeoutBlockHeight: Scalars['Float'];
};

export type CreateInvoice = {
  __typename?: 'CreateInvoice';
  chain_address?: Maybe<Scalars['String']>;
  created_at: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['String'];
  mtokens?: Maybe<Scalars['String']>;
  request: Scalars['String'];
  secret: Scalars['String'];
  tokens?: Maybe<Scalars['Float']>;
};

export type CreateMacaroon = {
  __typename?: 'CreateMacaroon';
  base: Scalars['String'];
  hex: Scalars['String'];
};

export type DecodeInvoice = {
  __typename?: 'DecodeInvoice';
  chain_address?: Maybe<Scalars['String']>;
  cltv_delta?: Maybe<Scalars['Float']>;
  description: Scalars['String'];
  description_hash?: Maybe<Scalars['String']>;
  destination: Scalars['String'];
  destination_node?: Maybe<Node>;
  expires_at: Scalars['String'];
  id: Scalars['String'];
  mtokens: Scalars['String'];
  payment?: Maybe<Scalars['String']>;
  routes: Array<Array<Route>>;
  safe_tokens: Scalars['Float'];
  tokens: Scalars['Float'];
};

export type FeeHealth = {
  __typename?: 'FeeHealth';
  base?: Maybe<Scalars['String']>;
  baseOver?: Maybe<Scalars['Boolean']>;
  baseScore?: Maybe<Scalars['Float']>;
  rate?: Maybe<Scalars['Float']>;
  rateOver?: Maybe<Scalars['Boolean']>;
  rateScore?: Maybe<Scalars['Float']>;
  score?: Maybe<Scalars['Float']>;
};

export type FollowList = {
  __typename?: 'FollowList';
  following: Array<Scalars['String']>;
};

export type FollowPeers = {
  __typename?: 'FollowPeers';
  peers: NostrEvent;
};

export type Forward = {
  __typename?: 'Forward';
  created_at: Scalars['String'];
  fee: Scalars['Float'];
  fee_mtokens: Scalars['String'];
  incoming_channel: Scalars['String'];
  mtokens: Scalars['String'];
  outgoing_channel: Scalars['String'];
  tokens: Scalars['Float'];
};

export type GetInvoicesType = {
  __typename?: 'GetInvoicesType';
  invoices: Array<InvoiceType>;
  next?: Maybe<Scalars['String']>;
};

export type GetMessages = {
  __typename?: 'GetMessages';
  messages: Array<Message>;
  token?: Maybe<Scalars['String']>;
};

export type GetPaymentsType = {
  __typename?: 'GetPaymentsType';
  next?: Maybe<Scalars['String']>;
  payments: Array<PaymentType>;
};

export type Hops = {
  __typename?: 'Hops';
  channel: Scalars['String'];
  channel_capacity: Scalars['Float'];
  fee_mtokens: Scalars['String'];
  forward_mtokens: Scalars['String'];
  timeout: Scalars['Float'];
};

export type InvoicePayment = {
  __typename?: 'InvoicePayment';
  canceled_at?: Maybe<Scalars['String']>;
  confirmed_at?: Maybe<Scalars['String']>;
  created_at: Scalars['String'];
  created_height: Scalars['Float'];
  in_channel: Scalars['String'];
  is_canceled: Scalars['Boolean'];
  is_confirmed: Scalars['Boolean'];
  is_held: Scalars['Boolean'];
  messages?: Maybe<MessageType>;
  mtokens: Scalars['String'];
  pending_index?: Maybe<Scalars['Float']>;
  timeout: Scalars['Float'];
  tokens: Scalars['Float'];
  total_mtokens?: Maybe<Scalars['String']>;
};

export type InvoiceType = {
  __typename?: 'InvoiceType';
  chain_address?: Maybe<Scalars['String']>;
  confirmed_at?: Maybe<Scalars['String']>;
  created_at: Scalars['String'];
  date: Scalars['String'];
  description: Scalars['String'];
  description_hash?: Maybe<Scalars['String']>;
  expires_at: Scalars['String'];
  id: Scalars['String'];
  is_canceled?: Maybe<Scalars['Boolean']>;
  is_confirmed: Scalars['Boolean'];
  is_held?: Maybe<Scalars['Boolean']>;
  is_private: Scalars['Boolean'];
  is_push?: Maybe<Scalars['Boolean']>;
  payments: Array<InvoicePayment>;
  received: Scalars['Float'];
  received_mtokens: Scalars['String'];
  request?: Maybe<Scalars['String']>;
  secret: Scalars['String'];
  tokens: Scalars['String'];
  type: Scalars['String'];
};

export type LightningAddress = {
  __typename?: 'LightningAddress';
  lightning_address: Scalars['String'];
  pubkey: Scalars['String'];
};

export type LightningBalance = {
  __typename?: 'LightningBalance';
  active: Scalars['String'];
  commit: Scalars['String'];
  confirmed: Scalars['String'];
  pending: Scalars['String'];
};

export type LightningNodeSocialInfo = {
  __typename?: 'LightningNodeSocialInfo';
  socials?: Maybe<NodeSocial>;
};

export type LnMarketsUserInfo = {
  __typename?: 'LnMarketsUserInfo';
  account_type?: Maybe<Scalars['String']>;
  balance?: Maybe<Scalars['String']>;
  last_ip?: Maybe<Scalars['String']>;
  linkingpublickey?: Maybe<Scalars['String']>;
  uid?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type LnUrlRequest = ChannelRequest | PayRequest | WithdrawRequest;

export type Message = {
  __typename?: 'Message';
  alias?: Maybe<Scalars['String']>;
  contentType?: Maybe<Scalars['String']>;
  date: Scalars['String'];
  id: Scalars['String'];
  message?: Maybe<Scalars['String']>;
  sender?: Maybe<Scalars['String']>;
  tokens?: Maybe<Scalars['Float']>;
  verified: Scalars['Boolean'];
};

export type MessageType = {
  __typename?: 'MessageType';
  message?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addPeer: Scalars['Boolean'];
  bosRebalance: BosRebalanceResult;
  claimBoltzTransaction: Scalars['String'];
  closeChannel: OpenOrCloseChannel;
  createAddress: Scalars['String'];
  createBaseInvoice: BaseInvoice;
  createBoltzReverseSwap: CreateBoltzReverseSwapType;
  createInvoice: CreateInvoice;
  createMacaroon: CreateMacaroon;
  createThunderPoints: Scalars['Boolean'];
  fetchLnUrl: LnUrlRequest;
  followPeers?: Maybe<FollowPeers>;
  generateNostrProfile: NostrGenerateProfile;
  getAuthToken: Scalars['Boolean'];
  getSessionToken: Scalars['String'];
  keysend: PayInvoice;
  lnMarketsDeposit: Scalars['Boolean'];
  lnMarketsLogin: AuthResponse;
  lnMarketsLogout: Scalars['Boolean'];
  lnMarketsWithdraw: Scalars['Boolean'];
  lnUrlAuth: AuthResponse;
  lnUrlChannel: Scalars['String'];
  lnUrlPay: PaySuccess;
  lnUrlWithdraw: Scalars['String'];
  loginAmboss: Scalars['Boolean'];
  logout: Scalars['Boolean'];
  openChannel: OpenOrCloseChannel;
  pay: Scalars['Boolean'];
  postNostrNote: NostrEvent;
  pushBackup: Scalars['Boolean'];
  removePeer: Scalars['Boolean'];
  removeTwofaSecret: Scalars['Boolean'];
  sendMessage: Scalars['Float'];
  sendToAddress: ChainAddressSend;
  toggleConfig: Scalars['Boolean'];
  updateFees: Scalars['Boolean'];
  updateMultipleFees: Scalars['Boolean'];
  updateTwofaSecret: Scalars['Boolean'];
};

export type MutationAddPeerArgs = {
  isTemporary?: InputMaybe<Scalars['Boolean']>;
  publicKey?: InputMaybe<Scalars['String']>;
  socket?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
};

export type MutationBosRebalanceArgs = {
  avoid?: InputMaybe<Array<Scalars['String']>>;
  in_through?: InputMaybe<Scalars['String']>;
  max_fee?: InputMaybe<Scalars['Float']>;
  max_fee_rate?: InputMaybe<Scalars['Float']>;
  max_rebalance?: InputMaybe<Scalars['Float']>;
  node?: InputMaybe<Scalars['String']>;
  out_inbound?: InputMaybe<Scalars['Float']>;
  out_through?: InputMaybe<Scalars['String']>;
  timeout_minutes?: InputMaybe<Scalars['Float']>;
};

export type MutationClaimBoltzTransactionArgs = {
  destination: Scalars['String'];
  fee: Scalars['Float'];
  preimage: Scalars['String'];
  privateKey: Scalars['String'];
  redeem: Scalars['String'];
  transaction: Scalars['String'];
};

export type MutationCloseChannelArgs = {
  forceClose?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['String'];
  targetConfirmations?: InputMaybe<Scalars['Float']>;
  tokensPerVByte?: InputMaybe<Scalars['Float']>;
};

export type MutationCreateAddressArgs = {
  type?: InputMaybe<Scalars['String']>;
};

export type MutationCreateBaseInvoiceArgs = {
  amount: Scalars['Float'];
};

export type MutationCreateBoltzReverseSwapArgs = {
  address?: InputMaybe<Scalars['String']>;
  amount: Scalars['Float'];
};

export type MutationCreateInvoiceArgs = {
  amount: Scalars['Float'];
  description?: InputMaybe<Scalars['String']>;
  includePrivate?: InputMaybe<Scalars['Boolean']>;
  secondsUntil?: InputMaybe<Scalars['Float']>;
};

export type MutationCreateMacaroonArgs = {
  permissions: NetworkInfoInput;
};

export type MutationCreateThunderPointsArgs = {
  alias: Scalars['String'];
  id: Scalars['String'];
  public_key: Scalars['String'];
  uris: Array<Scalars['String']>;
};

export type MutationFetchLnUrlArgs = {
  url: Scalars['String'];
};

export type MutationFollowPeersArgs = {
  privateKey: Scalars['String'];
};

export type MutationGenerateNostrProfileArgs = {
  privateKey: Scalars['String'];
};

export type MutationGetAuthTokenArgs = {
  cookie?: InputMaybe<Scalars['String']>;
};

export type MutationGetSessionTokenArgs = {
  id: Scalars['String'];
  password: Scalars['String'];
  token?: InputMaybe<Scalars['String']>;
};

export type MutationKeysendArgs = {
  destination?: InputMaybe<Scalars['String']>;
  tokens: Scalars['Float'];
};

export type MutationLnMarketsDepositArgs = {
  amount: Scalars['Float'];
};

export type MutationLnMarketsWithdrawArgs = {
  amount: Scalars['Float'];
};

export type MutationLnUrlAuthArgs = {
  url: Scalars['String'];
};

export type MutationLnUrlChannelArgs = {
  callback: Scalars['String'];
  k1: Scalars['String'];
  uri: Scalars['String'];
};

export type MutationLnUrlPayArgs = {
  amount: Scalars['Float'];
  callback: Scalars['String'];
  comment?: InputMaybe<Scalars['String']>;
};

export type MutationLnUrlWithdrawArgs = {
  amount: Scalars['Float'];
  callback: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  k1: Scalars['String'];
};

export type MutationOpenChannelArgs = {
  amount: Scalars['Float'];
  isPrivate?: InputMaybe<Scalars['Boolean']>;
  partnerPublicKey: Scalars['String'];
  pushTokens?: InputMaybe<Scalars['Float']>;
  tokensPerVByte?: InputMaybe<Scalars['Float']>;
};

export type MutationPayArgs = {
  max_fee: Scalars['Float'];
  max_paths: Scalars['Float'];
  out?: InputMaybe<Array<Scalars['String']>>;
  request: Scalars['String'];
};

export type MutationPostNostrNoteArgs = {
  note: Scalars['String'];
  privateKey: Scalars['String'];
};

export type MutationRemovePeerArgs = {
  publicKey?: InputMaybe<Scalars['String']>;
};

export type MutationRemoveTwofaSecretArgs = {
  token: Scalars['String'];
};

export type MutationSendMessageArgs = {
  maxFee?: InputMaybe<Scalars['Float']>;
  message: Scalars['String'];
  messageType?: InputMaybe<Scalars['String']>;
  publicKey: Scalars['String'];
  tokens?: InputMaybe<Scalars['Float']>;
};

export type MutationSendToAddressArgs = {
  address: Scalars['String'];
  fee?: InputMaybe<Scalars['Float']>;
  sendAll?: InputMaybe<Scalars['Boolean']>;
  target?: InputMaybe<Scalars['Float']>;
  tokens?: InputMaybe<Scalars['Float']>;
};

export type MutationToggleConfigArgs = {
  field: ConfigFields;
};

export type MutationUpdateFeesArgs = {
  base_fee_tokens?: InputMaybe<Scalars['Float']>;
  cltv_delta?: InputMaybe<Scalars['Float']>;
  fee_rate?: InputMaybe<Scalars['Float']>;
  max_htlc_mtokens?: InputMaybe<Scalars['String']>;
  min_htlc_mtokens?: InputMaybe<Scalars['String']>;
  transaction_id?: InputMaybe<Scalars['String']>;
  transaction_vout?: InputMaybe<Scalars['Float']>;
};

export type MutationUpdateMultipleFeesArgs = {
  channels: Array<UpdateRoutingFeesParams>;
};

export type MutationUpdateTwofaSecretArgs = {
  secret: Scalars['String'];
  token: Scalars['String'];
};

export type NetworkInfo = {
  __typename?: 'NetworkInfo';
  averageChannelSize: Scalars['Float'];
  channelCount: Scalars['Float'];
  maxChannelSize: Scalars['Float'];
  medianChannelSize: Scalars['Float'];
  minChannelSize: Scalars['Float'];
  nodeCount: Scalars['Float'];
  notRecentlyUpdatedPolicyCount: Scalars['Float'];
  totalCapacity: Scalars['Float'];
};

export type NetworkInfoInput = {
  is_ok_to_adjust_peers: Scalars['Boolean'];
  is_ok_to_create_chain_addresses: Scalars['Boolean'];
  is_ok_to_create_invoices: Scalars['Boolean'];
  is_ok_to_create_macaroons: Scalars['Boolean'];
  is_ok_to_derive_keys: Scalars['Boolean'];
  is_ok_to_get_access_ids: Scalars['Boolean'];
  is_ok_to_get_chain_transactions: Scalars['Boolean'];
  is_ok_to_get_invoices: Scalars['Boolean'];
  is_ok_to_get_payments: Scalars['Boolean'];
  is_ok_to_get_peers: Scalars['Boolean'];
  is_ok_to_get_wallet_info: Scalars['Boolean'];
  is_ok_to_pay: Scalars['Boolean'];
  is_ok_to_revoke_access_ids: Scalars['Boolean'];
  is_ok_to_send_to_chain_addresses: Scalars['Boolean'];
  is_ok_to_sign_bytes: Scalars['Boolean'];
  is_ok_to_sign_messages: Scalars['Boolean'];
  is_ok_to_stop_daemon: Scalars['Boolean'];
  is_ok_to_verify_bytes_signatures: Scalars['Boolean'];
  is_ok_to_verify_messages: Scalars['Boolean'];
};

export type Node = {
  __typename?: 'Node';
  node?: Maybe<NodeType>;
};

export type NodeInfo = {
  __typename?: 'NodeInfo';
  active_channels_count: Scalars['Float'];
  alias: Scalars['String'];
  chains: Array<Scalars['String']>;
  closed_channels_count: Scalars['Float'];
  color: Scalars['String'];
  current_block_hash: Scalars['String'];
  current_block_height: Scalars['Float'];
  is_synced_to_chain: Scalars['Boolean'];
  is_synced_to_graph: Scalars['Boolean'];
  latest_block_at: Scalars['String'];
  peers_count: Scalars['Float'];
  pending_channels_count: Scalars['Float'];
  public_key: Scalars['String'];
  uris: Array<Scalars['String']>;
  version: Scalars['String'];
};

export type NodePolicy = {
  __typename?: 'NodePolicy';
  base_fee_mtokens?: Maybe<Scalars['String']>;
  cltv_delta?: Maybe<Scalars['Float']>;
  fee_rate?: Maybe<Scalars['Float']>;
  is_disabled?: Maybe<Scalars['Boolean']>;
  max_htlc_mtokens?: Maybe<Scalars['String']>;
  min_htlc_mtokens?: Maybe<Scalars['String']>;
  node?: Maybe<Node>;
  updated_at?: Maybe<Scalars['String']>;
};

export type NodeSocial = {
  __typename?: 'NodeSocial';
  info?: Maybe<NodeSocialInfo>;
};

export type NodeSocialInfo = {
  __typename?: 'NodeSocialInfo';
  email?: Maybe<Scalars['String']>;
  private?: Maybe<Scalars['Boolean']>;
  telegram?: Maybe<Scalars['String']>;
  twitter?: Maybe<Scalars['String']>;
  twitter_verified?: Maybe<Scalars['Boolean']>;
  website?: Maybe<Scalars['String']>;
};

export type NodeType = {
  __typename?: 'NodeType';
  alias: Scalars['String'];
  public_key: Scalars['String'];
};

export type NostrEvent = {
  __typename?: 'NostrEvent';
  content: Scalars['String'];
  created_at: Scalars['Float'];
  id: Scalars['String'];
  kind: Scalars['Float'];
  pubkey: Scalars['String'];
  sig: Scalars['String'];
  tags: Array<Array<Scalars['String']>>;
};

export type NostrFeed = {
  __typename?: 'NostrFeed';
  feed: Array<NostrEvent>;
};

export type NostrGenerateProfile = {
  __typename?: 'NostrGenerateProfile';
  announcement: NostrEvent;
  profile: NostrEvent;
};

export type NostrKeys = {
  __typename?: 'NostrKeys';
  privkey: Scalars['String'];
  pubkey: Scalars['String'];
};

export type NostrProfile = {
  __typename?: 'NostrProfile';
  attestation: NostrEvent;
  profile: NostrEvent;
};

export type NostrRelays = {
  __typename?: 'NostrRelays';
  urls: Array<Scalars['String']>;
};

export type OnChainBalance = {
  __typename?: 'OnChainBalance';
  closing: Scalars['String'];
  confirmed: Scalars['String'];
  pending: Scalars['String'];
};

export type OpenOrCloseChannel = {
  __typename?: 'OpenOrCloseChannel';
  transactionId: Scalars['String'];
  transactionOutputIndex: Scalars['String'];
};

export type PayInvoice = {
  __typename?: 'PayInvoice';
  fee: Scalars['Float'];
  fee_mtokens: Scalars['String'];
  hops: Array<Hops>;
  id: Scalars['String'];
  is_confirmed: Scalars['Boolean'];
  is_outgoing: Scalars['Boolean'];
  mtokens: Scalars['String'];
  safe_fee: Scalars['Float'];
  safe_tokens: Scalars['Float'];
  secret: Scalars['String'];
  tokens: Scalars['Float'];
};

export type PayRequest = {
  __typename?: 'PayRequest';
  callback?: Maybe<Scalars['String']>;
  commentAllowed?: Maybe<Scalars['Float']>;
  maxSendable?: Maybe<Scalars['String']>;
  metadata?: Maybe<Scalars['String']>;
  minSendable?: Maybe<Scalars['String']>;
  tag?: Maybe<Scalars['String']>;
};

export type PaySuccess = {
  __typename?: 'PaySuccess';
  ciphertext?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  iv?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  tag?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type PaymentType = {
  __typename?: 'PaymentType';
  created_at: Scalars['String'];
  date: Scalars['String'];
  destination: Scalars['String'];
  destination_node: Node;
  fee: Scalars['Float'];
  fee_mtokens: Scalars['String'];
  hops: Array<Node>;
  id: Scalars['String'];
  index?: Maybe<Scalars['Float']>;
  is_confirmed: Scalars['Boolean'];
  is_outgoing: Scalars['Boolean'];
  mtokens: Scalars['String'];
  request?: Maybe<Scalars['String']>;
  safe_fee: Scalars['Float'];
  safe_tokens?: Maybe<Scalars['Float']>;
  secret: Scalars['String'];
  tokens: Scalars['String'];
  type: Scalars['String'];
};

export type Peer = {
  __typename?: 'Peer';
  bytes_received: Scalars['Float'];
  bytes_sent: Scalars['Float'];
  is_inbound: Scalars['Boolean'];
  is_sync_peer?: Maybe<Scalars['Boolean']>;
  partner_node_info: Node;
  ping_time: Scalars['Float'];
  public_key: Scalars['String'];
  socket: Scalars['String'];
  tokens_received: Scalars['Float'];
  tokens_sent: Scalars['Float'];
};

export type PendingChannel = {
  __typename?: 'PendingChannel';
  close_transaction_id?: Maybe<Scalars['String']>;
  is_active: Scalars['Boolean'];
  is_closing: Scalars['Boolean'];
  is_opening: Scalars['Boolean'];
  is_timelocked: Scalars['Boolean'];
  local_balance: Scalars['Float'];
  local_reserve: Scalars['Float'];
  partner_node_info: Node;
  partner_public_key: Scalars['String'];
  received: Scalars['Float'];
  remote_balance: Scalars['Float'];
  remote_reserve: Scalars['Float'];
  sent: Scalars['Float'];
  timelock_blocks?: Maybe<Scalars['Float']>;
  timelock_expiration?: Maybe<Scalars['Float']>;
  transaction_fee?: Maybe<Scalars['Float']>;
  transaction_id: Scalars['String'];
  transaction_vout: Scalars['Float'];
};

export type PendingPayment = {
  __typename?: 'PendingPayment';
  id: Scalars['String'];
  is_outgoing: Scalars['Boolean'];
  timeout: Scalars['Float'];
  tokens: Scalars['Float'];
};

export type PendingResume = {
  __typename?: 'PendingResume';
  incoming_amount: Scalars['Float'];
  incoming_tokens: Scalars['Float'];
  outgoing_amount: Scalars['Float'];
  outgoing_tokens: Scalars['Float'];
  total_amount: Scalars['Float'];
  total_tokens: Scalars['Float'];
};

export type Policy = {
  __typename?: 'Policy';
  base_fee_mtokens?: Maybe<Scalars['String']>;
  cltv_delta?: Maybe<Scalars['Float']>;
  fee_rate?: Maybe<Scalars['Float']>;
  is_disabled?: Maybe<Scalars['Boolean']>;
  max_htlc_mtokens?: Maybe<Scalars['String']>;
  min_htlc_mtokens?: Maybe<Scalars['String']>;
  public_key: Scalars['String'];
  updated_at?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  decodeRequest: DecodeInvoice;
  getAccount: ServerAccount;
  getAccountingReport: Scalars['String'];
  getAmbossLoginToken: Scalars['String'];
  getAmbossUser?: Maybe<AmbossUser>;
  getBackups: Scalars['String'];
  getBaseCanConnect: Scalars['Boolean'];
  getBaseNodes: Array<BaseNode>;
  getBasePoints: Array<BasePoints>;
  getBitcoinFees: BitcoinFee;
  getBitcoinPrice: Scalars['String'];
  getBoltzInfo: BoltzInfoType;
  getBoltzSwapStatus: Array<BoltzSwap>;
  getChainTransactions: Array<ChainTransaction>;
  getChannel: SingleChannel;
  getChannelReport: ChannelReport;
  getChannels: Array<Channel>;
  getClosedChannels: Array<ClosedChannel>;
  getConfigState: ConfigState;
  getFeeHealth: ChannelsFeeHealth;
  getFollowList: FollowList;
  getForwards: Array<Forward>;
  getHello: Scalars['String'];
  getInvoiceStatusChange: Scalars['String'];
  getInvoices: GetInvoicesType;
  getLatestVersion: Scalars['String'];
  getLightningAddressInfo: PayRequest;
  getLightningAddresses: Array<LightningAddress>;
  getLnMarketsStatus: Scalars['String'];
  getLnMarketsUrl: Scalars['String'];
  getLnMarketsUserInfo: LnMarketsUserInfo;
  getMessages: GetMessages;
  getNetworkInfo: NetworkInfo;
  getNode: Node;
  getNodeBalances: Balances;
  getNodeInfo: NodeInfo;
  getNodeSocialInfo: LightningNodeSocialInfo;
  getNostrFeed: NostrFeed;
  getNostrKeys: NostrKeys;
  getNostrProfile: NostrProfile;
  getNostrRelays: NostrRelays;
  getPayments: GetPaymentsType;
  getPeers: Array<Peer>;
  getPendingChannels: Array<PendingChannel>;
  getServerAccounts: Array<ServerAccount>;
  getTimeHealth: ChannelsTimeHealth;
  getTwofaSecret: TwofaResult;
  getUtxos: Array<Utxo>;
  getVolumeHealth: ChannelsHealth;
  getWalletInfo: Wallet;
  recoverFunds: Scalars['Boolean'];
  signMessage: Scalars['String'];
  verifyBackup: Scalars['Boolean'];
  verifyBackups: Scalars['Boolean'];
  verifyMessage: Scalars['String'];
};

export type QueryDecodeRequestArgs = {
  request: Scalars['String'];
};

export type QueryGetAccountingReportArgs = {
  category?: InputMaybe<Scalars['String']>;
  currency?: InputMaybe<Scalars['String']>;
  fiat?: InputMaybe<Scalars['String']>;
  month?: InputMaybe<Scalars['String']>;
  year?: InputMaybe<Scalars['String']>;
};

export type QueryGetBoltzSwapStatusArgs = {
  ids: Array<Scalars['String']>;
};

export type QueryGetChannelArgs = {
  id: Scalars['String'];
};

export type QueryGetChannelsArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
};

export type QueryGetFollowListArgs = {
  myPubkey: Scalars['String'];
};

export type QueryGetForwardsArgs = {
  days: Scalars['Float'];
};

export type QueryGetInvoiceStatusChangeArgs = {
  id: Scalars['String'];
};

export type QueryGetInvoicesArgs = {
  token?: InputMaybe<Scalars['String']>;
};

export type QueryGetLightningAddressInfoArgs = {
  address: Scalars['String'];
};

export type QueryGetMessagesArgs = {
  initialize?: InputMaybe<Scalars['Boolean']>;
};

export type QueryGetNodeArgs = {
  publicKey: Scalars['String'];
  withoutChannels?: InputMaybe<Scalars['Boolean']>;
};

export type QueryGetNodeSocialInfoArgs = {
  pubkey: Scalars['String'];
};

export type QueryGetNostrFeedArgs = {
  myPubkey: Scalars['String'];
};

export type QueryGetNostrProfileArgs = {
  pubkey: Scalars['String'];
};

export type QueryGetPaymentsArgs = {
  token?: InputMaybe<Scalars['String']>;
};

export type QueryRecoverFundsArgs = {
  backup: Scalars['String'];
};

export type QuerySignMessageArgs = {
  message: Scalars['String'];
};

export type QueryVerifyBackupArgs = {
  backup: Scalars['String'];
};

export type QueryVerifyBackupsArgs = {
  backup: Scalars['String'];
};

export type QueryVerifyMessageArgs = {
  message: Scalars['String'];
  signature: Scalars['String'];
};

export type Route = {
  __typename?: 'Route';
  base_fee_mtokens?: Maybe<Scalars['String']>;
  channel?: Maybe<Scalars['String']>;
  cltv_delta?: Maybe<Scalars['Float']>;
  fee_rate?: Maybe<Scalars['Float']>;
  public_key: Scalars['String'];
};

export type ServerAccount = {
  __typename?: 'ServerAccount';
  id: Scalars['String'];
  loggedIn: Scalars['Boolean'];
  name: Scalars['String'];
  twofaEnabled: Scalars['Boolean'];
  type: Scalars['String'];
};

export type SingleChannel = {
  __typename?: 'SingleChannel';
  capacity: Scalars['Float'];
  id: Scalars['String'];
  node_policies?: Maybe<NodePolicy>;
  partner_node_policies?: Maybe<NodePolicy>;
  policies: Array<Policy>;
  transaction_id: Scalars['String'];
  transaction_vout: Scalars['Float'];
  updated_at?: Maybe<Scalars['String']>;
};

export type TwofaResult = {
  __typename?: 'TwofaResult';
  secret: Scalars['String'];
  url: Scalars['String'];
};

export type UpdateRoutingFeesParams = {
  base_fee_mtokens?: InputMaybe<Scalars['String']>;
  base_fee_tokens?: InputMaybe<Scalars['Float']>;
  cltv_delta?: InputMaybe<Scalars['Float']>;
  fee_rate?: InputMaybe<Scalars['Float']>;
  max_htlc_mtokens?: InputMaybe<Scalars['String']>;
  min_htlc_mtokens?: InputMaybe<Scalars['String']>;
  transaction_id?: InputMaybe<Scalars['String']>;
  transaction_vout?: InputMaybe<Scalars['Float']>;
};

export type UserBackupInfo = {
  __typename?: 'UserBackupInfo';
  available_size: Scalars['String'];
  last_update?: Maybe<Scalars['String']>;
  last_update_size?: Maybe<Scalars['String']>;
  remaining_size: Scalars['String'];
  total_size_saved: Scalars['String'];
};

export type Utxo = {
  __typename?: 'Utxo';
  address: Scalars['String'];
  address_format: Scalars['String'];
  confirmation_count: Scalars['Float'];
  output_script: Scalars['String'];
  tokens: Scalars['Float'];
  transaction_id: Scalars['String'];
  transaction_vout: Scalars['Float'];
};

export type Wallet = {
  __typename?: 'Wallet';
  build_tags: Array<Scalars['String']>;
  commit_hash: Scalars['String'];
  is_autopilotrpc_enabled: Scalars['Boolean'];
  is_chainrpc_enabled: Scalars['Boolean'];
  is_invoicesrpc_enabled: Scalars['Boolean'];
  is_signrpc_enabled: Scalars['Boolean'];
  is_walletrpc_enabled: Scalars['Boolean'];
  is_watchtowerrpc_enabled: Scalars['Boolean'];
  is_wtclientrpc_enabled: Scalars['Boolean'];
};

export type WithdrawRequest = {
  __typename?: 'WithdrawRequest';
  callback?: Maybe<Scalars['String']>;
  defaultDescription?: Maybe<Scalars['String']>;
  k1?: Maybe<Scalars['String']>;
  maxWithdrawable?: Maybe<Scalars['String']>;
  minWithdrawable?: Maybe<Scalars['String']>;
  tag?: Maybe<Scalars['String']>;
};
