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
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type AggregatedChannelForwards = {
  __typename?: 'AggregatedChannelForwards';
  channel?: Maybe<Scalars['String']['output']>;
  channel_info?: Maybe<ChannelInfo>;
  id: Scalars['String']['output'];
  incoming: AggregatedSideStats;
  outgoing: AggregatedSideStats;
};

export type AggregatedChannelSideForwards = {
  __typename?: 'AggregatedChannelSideForwards';
  channel?: Maybe<Scalars['String']['output']>;
  channel_info?: Maybe<ChannelInfo>;
  count: Scalars['Float']['output'];
  fee: Scalars['Float']['output'];
  fee_mtokens: Scalars['String']['output'];
  id: Scalars['String']['output'];
  mtokens: Scalars['String']['output'];
  tokens: Scalars['Float']['output'];
};

export type AggregatedRouteForwards = {
  __typename?: 'AggregatedRouteForwards';
  count: Scalars['Float']['output'];
  fee: Scalars['Float']['output'];
  fee_mtokens: Scalars['String']['output'];
  id: Scalars['String']['output'];
  incoming_channel: Scalars['String']['output'];
  incoming_channel_info?: Maybe<ChannelInfo>;
  mtokens: Scalars['String']['output'];
  outgoing_channel: Scalars['String']['output'];
  outgoing_channel_info?: Maybe<ChannelInfo>;
  route: Scalars['String']['output'];
  tokens: Scalars['Float']['output'];
};

export type AggregatedSideStats = {
  __typename?: 'AggregatedSideStats';
  count: Scalars['Float']['output'];
  fee: Scalars['Float']['output'];
  fee_mtokens: Scalars['String']['output'];
  id: Scalars['String']['output'];
  mtokens: Scalars['String']['output'];
  tokens: Scalars['Float']['output'];
};

export type AmbossSubscription = {
  __typename?: 'AmbossSubscription';
  end_date: Scalars['String']['output'];
  subscribed: Scalars['Boolean']['output'];
  upgradable: Scalars['Boolean']['output'];
};

export type AmbossUser = {
  __typename?: 'AmbossUser';
  backups: UserBackupInfo;
  ghost: UserGhostInfo;
  subscription: AmbossSubscription;
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  message: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type Balances = {
  __typename?: 'Balances';
  lightning: LightningBalance;
  onchain: OnChainBalance;
};

export type BaseInvoice = {
  __typename?: 'BaseInvoice';
  id: Scalars['String']['output'];
  request: Scalars['String']['output'];
};

export type BaseNode = {
  __typename?: 'BaseNode';
  _id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  public_key: Scalars['String']['output'];
  socket: Scalars['String']['output'];
};

export type BaseNodeInfo = {
  __typename?: 'BaseNodeInfo';
  alias: Scalars['String']['output'];
  public_key: Scalars['String']['output'];
};

export type BasePoints = {
  __typename?: 'BasePoints';
  alias: Scalars['String']['output'];
  amount: Scalars['Float']['output'];
};

export type BitcoinFee = {
  __typename?: 'BitcoinFee';
  fast: Scalars['Float']['output'];
  halfHour: Scalars['Float']['output'];
  hour: Scalars['Float']['output'];
  minimum: Scalars['Float']['output'];
};

export type BoltzInfoType = {
  __typename?: 'BoltzInfoType';
  feePercent: Scalars['Float']['output'];
  max: Scalars['Float']['output'];
  min: Scalars['Float']['output'];
};

export type BoltzSwap = {
  __typename?: 'BoltzSwap';
  boltz?: Maybe<BoltzSwapStatus>;
  id?: Maybe<Scalars['String']['output']>;
};

export type BoltzSwapStatus = {
  __typename?: 'BoltzSwapStatus';
  status: Scalars['String']['output'];
  transaction?: Maybe<BoltzSwapTransaction>;
};

export type BoltzSwapTransaction = {
  __typename?: 'BoltzSwapTransaction';
  eta?: Maybe<Scalars['Float']['output']>;
  hex?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
};

export type BosDecrease = {
  __typename?: 'BosDecrease';
  decreased_inbound_on: Scalars['String']['output'];
  liquidity_inbound: Scalars['String']['output'];
  liquidity_inbound_opening?: Maybe<Scalars['String']['output']>;
  liquidity_inbound_pending?: Maybe<Scalars['String']['output']>;
  liquidity_outbound: Scalars['String']['output'];
  liquidity_outbound_opening?: Maybe<Scalars['String']['output']>;
  liquidity_outbound_pending?: Maybe<Scalars['String']['output']>;
};

export type BosIncrease = {
  __typename?: 'BosIncrease';
  increased_inbound_on: Scalars['String']['output'];
  liquidity_inbound: Scalars['String']['output'];
  liquidity_inbound_opening?: Maybe<Scalars['String']['output']>;
  liquidity_inbound_pending?: Maybe<Scalars['String']['output']>;
  liquidity_outbound: Scalars['String']['output'];
  liquidity_outbound_opening?: Maybe<Scalars['String']['output']>;
  liquidity_outbound_pending?: Maybe<Scalars['String']['output']>;
};

export type BosRebalanceResult = {
  __typename?: 'BosRebalanceResult';
  decrease?: Maybe<BosDecrease>;
  increase?: Maybe<BosIncrease>;
  result?: Maybe<BosResult>;
};

export type BosResult = {
  __typename?: 'BosResult';
  rebalance_fees_spent: Scalars['String']['output'];
  rebalanced: Scalars['String']['output'];
};

export type ChainAddressSend = {
  __typename?: 'ChainAddressSend';
  confirmationCount: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  isConfirmed: Scalars['Boolean']['output'];
  isOutgoing: Scalars['Boolean']['output'];
  tokens?: Maybe<Scalars['Float']['output']>;
};

export type ChainTransaction = {
  __typename?: 'ChainTransaction';
  block_id?: Maybe<Scalars['String']['output']>;
  confirmation_count?: Maybe<Scalars['Float']['output']>;
  confirmation_height?: Maybe<Scalars['Float']['output']>;
  created_at: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  fee?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  is_confirmed: Scalars['Boolean']['output'];
  is_outgoing: Scalars['Boolean']['output'];
  output_addresses: Array<Scalars['String']['output']>;
  tokens: Scalars['Float']['output'];
  transaction?: Maybe<Scalars['String']['output']>;
};

export type Channel = {
  __typename?: 'Channel';
  capacity: Scalars['Float']['output'];
  channel_age: Scalars['Float']['output'];
  commit_transaction_fee: Scalars['Float']['output'];
  commit_transaction_weight: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  is_active: Scalars['Boolean']['output'];
  is_closing: Scalars['Boolean']['output'];
  is_opening: Scalars['Boolean']['output'];
  is_partner_initiated: Scalars['Boolean']['output'];
  is_private: Scalars['Boolean']['output'];
  local_balance: Scalars['Float']['output'];
  local_reserve: Scalars['Float']['output'];
  partner_fee_info?: Maybe<SingleChannel>;
  partner_node_info: Node;
  partner_public_key: Scalars['String']['output'];
  past_states: Scalars['Float']['output'];
  pending_payments: Array<PendingPayment>;
  pending_resume: PendingResume;
  received: Scalars['Float']['output'];
  remote_balance: Scalars['Float']['output'];
  remote_reserve: Scalars['Float']['output'];
  sent: Scalars['Float']['output'];
  time_offline?: Maybe<Scalars['Float']['output']>;
  time_online?: Maybe<Scalars['Float']['output']>;
  transaction_id: Scalars['String']['output'];
  transaction_vout: Scalars['Float']['output'];
  unsettled_balance: Scalars['Float']['output'];
};

export type ChannelFeeHealth = {
  __typename?: 'ChannelFeeHealth';
  id?: Maybe<Scalars['String']['output']>;
  mySide?: Maybe<FeeHealth>;
  partner?: Maybe<Node>;
  partnerSide?: Maybe<FeeHealth>;
};

export type ChannelHealth = {
  __typename?: 'ChannelHealth';
  averageVolumeNormalized?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  partner?: Maybe<Node>;
  score?: Maybe<Scalars['Float']['output']>;
  volumeNormalized?: Maybe<Scalars['String']['output']>;
};

export type ChannelInfo = {
  __typename?: 'ChannelInfo';
  node1_info: BaseNodeInfo;
  node2_info: BaseNodeInfo;
};

export type ChannelReport = {
  __typename?: 'ChannelReport';
  commit: Scalars['Float']['output'];
  incomingPendingHtlc: Scalars['Float']['output'];
  local: Scalars['Float']['output'];
  maxIn: Scalars['Float']['output'];
  maxOut: Scalars['Float']['output'];
  outgoingPendingHtlc: Scalars['Float']['output'];
  remote: Scalars['Float']['output'];
  totalPendingHtlc: Scalars['Float']['output'];
};

export type ChannelRequest = {
  __typename?: 'ChannelRequest';
  callback?: Maybe<Scalars['String']['output']>;
  k1?: Maybe<Scalars['String']['output']>;
  tag?: Maybe<Scalars['String']['output']>;
  uri?: Maybe<Scalars['String']['output']>;
};

export type ChannelTimeHealth = {
  __typename?: 'ChannelTimeHealth';
  id?: Maybe<Scalars['String']['output']>;
  monitoredDowntime?: Maybe<Scalars['Float']['output']>;
  monitoredTime?: Maybe<Scalars['Float']['output']>;
  monitoredUptime?: Maybe<Scalars['Float']['output']>;
  partner?: Maybe<Node>;
  score?: Maybe<Scalars['Float']['output']>;
  significant?: Maybe<Scalars['Boolean']['output']>;
};

export type ChannelsFeeHealth = {
  __typename?: 'ChannelsFeeHealth';
  channels?: Maybe<Array<ChannelFeeHealth>>;
  score?: Maybe<Scalars['Float']['output']>;
};

export type ChannelsHealth = {
  __typename?: 'ChannelsHealth';
  channels?: Maybe<Array<ChannelHealth>>;
  score?: Maybe<Scalars['Float']['output']>;
};

export type ChannelsTimeHealth = {
  __typename?: 'ChannelsTimeHealth';
  channels?: Maybe<Array<ChannelTimeHealth>>;
  score?: Maybe<Scalars['Float']['output']>;
};

export type ClaimGhostAddress = {
  __typename?: 'ClaimGhostAddress';
  username: Scalars['String']['output'];
};

export type ClosedChannel = {
  __typename?: 'ClosedChannel';
  capacity: Scalars['Float']['output'];
  channel_age?: Maybe<Scalars['Float']['output']>;
  close_confirm_height?: Maybe<Scalars['Float']['output']>;
  close_transaction_id?: Maybe<Scalars['String']['output']>;
  closed_for_blocks?: Maybe<Scalars['Float']['output']>;
  final_local_balance: Scalars['Float']['output'];
  final_time_locked_balance: Scalars['Float']['output'];
  id?: Maybe<Scalars['String']['output']>;
  is_breach_close: Scalars['Boolean']['output'];
  is_cooperative_close: Scalars['Boolean']['output'];
  is_funding_cancel: Scalars['Boolean']['output'];
  is_local_force_close: Scalars['Boolean']['output'];
  is_remote_force_close: Scalars['Boolean']['output'];
  partner_node_info: Node;
  partner_public_key: Scalars['String']['output'];
  transaction_id: Scalars['String']['output'];
  transaction_vout: Scalars['Float']['output'];
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
  backup_state: Scalars['Boolean']['output'];
  channels_push_enabled: Scalars['Boolean']['output'];
  healthcheck_ping_state: Scalars['Boolean']['output'];
  onchain_push_enabled: Scalars['Boolean']['output'];
  private_channels_push_enabled: Scalars['Boolean']['output'];
};

export type CreateBoltzReverseSwapType = {
  __typename?: 'CreateBoltzReverseSwapType';
  decodedInvoice?: Maybe<DecodeInvoice>;
  id: Scalars['String']['output'];
  invoice: Scalars['String']['output'];
  lockupAddress: Scalars['String']['output'];
  minerFeeInvoice?: Maybe<Scalars['String']['output']>;
  onchainAmount: Scalars['Float']['output'];
  preimage?: Maybe<Scalars['String']['output']>;
  preimageHash?: Maybe<Scalars['String']['output']>;
  privateKey?: Maybe<Scalars['String']['output']>;
  publicKey?: Maybe<Scalars['String']['output']>;
  receivingAddress: Scalars['String']['output'];
  redeemScript: Scalars['String']['output'];
  timeoutBlockHeight: Scalars['Float']['output'];
};

export type CreateInvoice = {
  __typename?: 'CreateInvoice';
  chain_address?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  mtokens?: Maybe<Scalars['String']['output']>;
  request: Scalars['String']['output'];
  secret: Scalars['String']['output'];
  tokens?: Maybe<Scalars['Float']['output']>;
};

export type CreateMacaroon = {
  __typename?: 'CreateMacaroon';
  base: Scalars['String']['output'];
  hex: Scalars['String']['output'];
};

export type DecodeInvoice = {
  __typename?: 'DecodeInvoice';
  chain_address?: Maybe<Scalars['String']['output']>;
  cltv_delta?: Maybe<Scalars['Float']['output']>;
  description: Scalars['String']['output'];
  description_hash?: Maybe<Scalars['String']['output']>;
  destination: Scalars['String']['output'];
  destination_node?: Maybe<Node>;
  expires_at: Scalars['String']['output'];
  id: Scalars['String']['output'];
  mtokens: Scalars['String']['output'];
  payment?: Maybe<Scalars['String']['output']>;
  routes: Array<Array<Route>>;
  safe_tokens: Scalars['Float']['output'];
  tokens: Scalars['Float']['output'];
};

export type FeeHealth = {
  __typename?: 'FeeHealth';
  base?: Maybe<Scalars['String']['output']>;
  baseOver?: Maybe<Scalars['Boolean']['output']>;
  baseScore?: Maybe<Scalars['Float']['output']>;
  rate?: Maybe<Scalars['Float']['output']>;
  rateOver?: Maybe<Scalars['Boolean']['output']>;
  rateScore?: Maybe<Scalars['Float']['output']>;
  score?: Maybe<Scalars['Float']['output']>;
};

export type Forward = {
  __typename?: 'Forward';
  created_at: Scalars['String']['output'];
  fee: Scalars['Float']['output'];
  fee_mtokens: Scalars['String']['output'];
  id: Scalars['String']['output'];
  incoming_channel: Scalars['String']['output'];
  mtokens: Scalars['String']['output'];
  outgoing_channel: Scalars['String']['output'];
  tokens: Scalars['Float']['output'];
};

export type GetForwards = {
  __typename?: 'GetForwards';
  by_channel: Array<AggregatedChannelForwards>;
  by_incoming: Array<AggregatedChannelSideForwards>;
  by_outgoing: Array<AggregatedChannelSideForwards>;
  by_route: Array<AggregatedRouteForwards>;
  list: Array<Forward>;
};

export type GetInvoicesType = {
  __typename?: 'GetInvoicesType';
  invoices: Array<InvoiceType>;
  next?: Maybe<Scalars['String']['output']>;
};

export type GetMessages = {
  __typename?: 'GetMessages';
  messages: Array<Message>;
  token?: Maybe<Scalars['String']['output']>;
};

export type GetPaymentsType = {
  __typename?: 'GetPaymentsType';
  next?: Maybe<Scalars['String']['output']>;
  payments: Array<PaymentType>;
};

export type Hops = {
  __typename?: 'Hops';
  channel: Scalars['String']['output'];
  channel_capacity: Scalars['Float']['output'];
  fee_mtokens: Scalars['String']['output'];
  forward_mtokens: Scalars['String']['output'];
  timeout: Scalars['Float']['output'];
};

export type InvoicePayment = {
  __typename?: 'InvoicePayment';
  canceled_at?: Maybe<Scalars['String']['output']>;
  confirmed_at?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['String']['output'];
  created_height: Scalars['Float']['output'];
  in_channel: Scalars['String']['output'];
  is_canceled: Scalars['Boolean']['output'];
  is_confirmed: Scalars['Boolean']['output'];
  is_held: Scalars['Boolean']['output'];
  messages?: Maybe<MessageType>;
  mtokens: Scalars['String']['output'];
  pending_index?: Maybe<Scalars['Float']['output']>;
  timeout: Scalars['Float']['output'];
  tokens: Scalars['Float']['output'];
  total_mtokens?: Maybe<Scalars['String']['output']>;
};

export type InvoiceType = {
  __typename?: 'InvoiceType';
  chain_address?: Maybe<Scalars['String']['output']>;
  confirmed_at?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['String']['output'];
  date: Scalars['String']['output'];
  description: Scalars['String']['output'];
  description_hash?: Maybe<Scalars['String']['output']>;
  expires_at: Scalars['String']['output'];
  id: Scalars['String']['output'];
  is_canceled?: Maybe<Scalars['Boolean']['output']>;
  is_confirmed: Scalars['Boolean']['output'];
  is_held?: Maybe<Scalars['Boolean']['output']>;
  is_private: Scalars['Boolean']['output'];
  is_push?: Maybe<Scalars['Boolean']['output']>;
  payments: Array<InvoicePayment>;
  received: Scalars['Float']['output'];
  received_mtokens: Scalars['String']['output'];
  request?: Maybe<Scalars['String']['output']>;
  secret: Scalars['String']['output'];
  tokens: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type LightningAddress = {
  __typename?: 'LightningAddress';
  lightning_address: Scalars['String']['output'];
  pubkey: Scalars['String']['output'];
};

export type LightningBalance = {
  __typename?: 'LightningBalance';
  active: Scalars['String']['output'];
  commit: Scalars['String']['output'];
  confirmed: Scalars['String']['output'];
  pending: Scalars['String']['output'];
};

export type LightningNodeSocialInfo = {
  __typename?: 'LightningNodeSocialInfo';
  socials?: Maybe<NodeSocial>;
};

export type LnMarketsUserInfo = {
  __typename?: 'LnMarketsUserInfo';
  account_type?: Maybe<Scalars['String']['output']>;
  balance?: Maybe<Scalars['String']['output']>;
  last_ip?: Maybe<Scalars['String']['output']>;
  linkingpublickey?: Maybe<Scalars['String']['output']>;
  uid?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type LnUrlRequest = ChannelRequest | PayRequest | WithdrawRequest;

export type Message = {
  __typename?: 'Message';
  alias?: Maybe<Scalars['String']['output']>;
  contentType?: Maybe<Scalars['String']['output']>;
  date: Scalars['String']['output'];
  id: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
  sender?: Maybe<Scalars['String']['output']>;
  tokens?: Maybe<Scalars['Float']['output']>;
  verified: Scalars['Boolean']['output'];
};

export type MessageType = {
  __typename?: 'MessageType';
  message?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addPeer: Scalars['Boolean']['output'];
  bosRebalance: BosRebalanceResult;
  claimBoltzTransaction: Scalars['String']['output'];
  claimGhostAddress: ClaimGhostAddress;
  closeChannel: OpenOrCloseChannel;
  createAddress: Scalars['String']['output'];
  createBaseInvoice: BaseInvoice;
  createBoltzReverseSwap: CreateBoltzReverseSwapType;
  createInvoice: CreateInvoice;
  createMacaroon: CreateMacaroon;
  createThunderPoints: Scalars['Boolean']['output'];
  fetchLnUrl: LnUrlRequest;
  getAuthToken: Scalars['Boolean']['output'];
  getSessionToken: Scalars['String']['output'];
  keysend: PayInvoice;
  lnMarketsDeposit: Scalars['Boolean']['output'];
  lnMarketsLogin: AuthResponse;
  lnMarketsLogout: Scalars['Boolean']['output'];
  lnMarketsWithdraw: Scalars['Boolean']['output'];
  lnUrlAuth: AuthResponse;
  lnUrlChannel: Scalars['String']['output'];
  lnUrlPay: PaySuccess;
  lnUrlWithdraw: Scalars['String']['output'];
  loginAmboss: Scalars['Boolean']['output'];
  logout: Scalars['Boolean']['output'];
  openChannel: OpenOrCloseChannel;
  pay: Scalars['Boolean']['output'];
  pushBackup: Scalars['Boolean']['output'];
  removePeer: Scalars['Boolean']['output'];
  removeTwofaSecret: Scalars['Boolean']['output'];
  sendMessage: Scalars['Float']['output'];
  sendToAddress: ChainAddressSend;
  toggleConfig: Scalars['Boolean']['output'];
  updateFees: Scalars['Boolean']['output'];
  updateMultipleFees: Scalars['Boolean']['output'];
  updateTwofaSecret: Scalars['Boolean']['output'];
};

export type MutationAddPeerArgs = {
  isTemporary?: InputMaybe<Scalars['Boolean']['input']>;
  publicKey?: InputMaybe<Scalars['String']['input']>;
  socket?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type MutationBosRebalanceArgs = {
  avoid?: InputMaybe<Array<Scalars['String']['input']>>;
  in_through?: InputMaybe<Scalars['String']['input']>;
  max_fee?: InputMaybe<Scalars['Float']['input']>;
  max_fee_rate?: InputMaybe<Scalars['Float']['input']>;
  max_rebalance?: InputMaybe<Scalars['Float']['input']>;
  node?: InputMaybe<Scalars['String']['input']>;
  out_inbound?: InputMaybe<Scalars['Float']['input']>;
  out_through?: InputMaybe<Scalars['String']['input']>;
  timeout_minutes?: InputMaybe<Scalars['Float']['input']>;
};

export type MutationClaimBoltzTransactionArgs = {
  destination: Scalars['String']['input'];
  fee: Scalars['Float']['input'];
  id: Scalars['String']['input'];
  preimage: Scalars['String']['input'];
  privateKey: Scalars['String']['input'];
  redeem: Scalars['String']['input'];
  transaction: Scalars['String']['input'];
};

export type MutationClaimGhostAddressArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
};

export type MutationCloseChannelArgs = {
  forceClose?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['String']['input'];
  targetConfirmations?: InputMaybe<Scalars['Float']['input']>;
  tokensPerVByte?: InputMaybe<Scalars['Float']['input']>;
};

export type MutationCreateAddressArgs = {
  type?: Scalars['String']['input'];
};

export type MutationCreateBaseInvoiceArgs = {
  amount: Scalars['Float']['input'];
};

export type MutationCreateBoltzReverseSwapArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  amount: Scalars['Float']['input'];
};

export type MutationCreateInvoiceArgs = {
  amount: Scalars['Float']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  includePrivate?: InputMaybe<Scalars['Boolean']['input']>;
  secondsUntil?: InputMaybe<Scalars['Float']['input']>;
};

export type MutationCreateMacaroonArgs = {
  permissions: NetworkInfoInput;
};

export type MutationCreateThunderPointsArgs = {
  alias: Scalars['String']['input'];
  id: Scalars['String']['input'];
  public_key: Scalars['String']['input'];
  uris: Array<Scalars['String']['input']>;
};

export type MutationFetchLnUrlArgs = {
  url: Scalars['String']['input'];
};

export type MutationGetAuthTokenArgs = {
  cookie?: InputMaybe<Scalars['String']['input']>;
};

export type MutationGetSessionTokenArgs = {
  id: Scalars['String']['input'];
  password: Scalars['String']['input'];
  token?: InputMaybe<Scalars['String']['input']>;
};

export type MutationKeysendArgs = {
  destination?: InputMaybe<Scalars['String']['input']>;
  tokens: Scalars['Float']['input'];
};

export type MutationLnMarketsDepositArgs = {
  amount: Scalars['Float']['input'];
};

export type MutationLnMarketsWithdrawArgs = {
  amount: Scalars['Float']['input'];
};

export type MutationLnUrlAuthArgs = {
  url: Scalars['String']['input'];
};

export type MutationLnUrlChannelArgs = {
  callback: Scalars['String']['input'];
  k1: Scalars['String']['input'];
  uri: Scalars['String']['input'];
};

export type MutationLnUrlPayArgs = {
  amount: Scalars['Float']['input'];
  callback: Scalars['String']['input'];
  comment?: InputMaybe<Scalars['String']['input']>;
};

export type MutationLnUrlWithdrawArgs = {
  amount: Scalars['Float']['input'];
  callback: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  k1: Scalars['String']['input'];
};

export type MutationOpenChannelArgs = {
  input: OpenChannelParams;
};

export type MutationPayArgs = {
  max_fee: Scalars['Float']['input'];
  max_paths: Scalars['Float']['input'];
  out?: InputMaybe<Array<Scalars['String']['input']>>;
  request: Scalars['String']['input'];
};

export type MutationRemovePeerArgs = {
  publicKey?: InputMaybe<Scalars['String']['input']>;
};

export type MutationRemoveTwofaSecretArgs = {
  token: Scalars['String']['input'];
};

export type MutationSendMessageArgs = {
  maxFee?: InputMaybe<Scalars['Float']['input']>;
  message: Scalars['String']['input'];
  messageType?: InputMaybe<Scalars['String']['input']>;
  publicKey: Scalars['String']['input'];
  tokens?: InputMaybe<Scalars['Float']['input']>;
};

export type MutationSendToAddressArgs = {
  address: Scalars['String']['input'];
  fee?: InputMaybe<Scalars['Float']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  target?: InputMaybe<Scalars['Float']['input']>;
  tokens?: InputMaybe<Scalars['Float']['input']>;
};

export type MutationToggleConfigArgs = {
  field: ConfigFields;
};

export type MutationUpdateFeesArgs = {
  base_fee_tokens?: InputMaybe<Scalars['Float']['input']>;
  cltv_delta?: InputMaybe<Scalars['Float']['input']>;
  fee_rate?: InputMaybe<Scalars['Float']['input']>;
  max_htlc_mtokens?: InputMaybe<Scalars['String']['input']>;
  min_htlc_mtokens?: InputMaybe<Scalars['String']['input']>;
  transaction_id?: InputMaybe<Scalars['String']['input']>;
  transaction_vout?: InputMaybe<Scalars['Float']['input']>;
};

export type MutationUpdateMultipleFeesArgs = {
  channels: Array<UpdateRoutingFeesParams>;
};

export type MutationUpdateTwofaSecretArgs = {
  secret: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type NetworkInfo = {
  __typename?: 'NetworkInfo';
  averageChannelSize: Scalars['Float']['output'];
  channelCount: Scalars['Float']['output'];
  maxChannelSize: Scalars['Float']['output'];
  medianChannelSize: Scalars['Float']['output'];
  minChannelSize: Scalars['Float']['output'];
  nodeCount: Scalars['Float']['output'];
  notRecentlyUpdatedPolicyCount: Scalars['Float']['output'];
  totalCapacity: Scalars['Float']['output'];
};

export type NetworkInfoInput = {
  is_ok_to_adjust_peers: Scalars['Boolean']['input'];
  is_ok_to_create_chain_addresses: Scalars['Boolean']['input'];
  is_ok_to_create_invoices: Scalars['Boolean']['input'];
  is_ok_to_create_macaroons: Scalars['Boolean']['input'];
  is_ok_to_derive_keys: Scalars['Boolean']['input'];
  is_ok_to_get_access_ids: Scalars['Boolean']['input'];
  is_ok_to_get_chain_transactions: Scalars['Boolean']['input'];
  is_ok_to_get_invoices: Scalars['Boolean']['input'];
  is_ok_to_get_payments: Scalars['Boolean']['input'];
  is_ok_to_get_peers: Scalars['Boolean']['input'];
  is_ok_to_get_wallet_info: Scalars['Boolean']['input'];
  is_ok_to_pay: Scalars['Boolean']['input'];
  is_ok_to_revoke_access_ids: Scalars['Boolean']['input'];
  is_ok_to_send_to_chain_addresses: Scalars['Boolean']['input'];
  is_ok_to_sign_bytes: Scalars['Boolean']['input'];
  is_ok_to_sign_messages: Scalars['Boolean']['input'];
  is_ok_to_stop_daemon: Scalars['Boolean']['input'];
  is_ok_to_verify_bytes_signatures: Scalars['Boolean']['input'];
  is_ok_to_verify_messages: Scalars['Boolean']['input'];
};

export type Node = {
  __typename?: 'Node';
  node?: Maybe<NodeType>;
};

export type NodeInfo = {
  __typename?: 'NodeInfo';
  active_channels_count: Scalars['Float']['output'];
  alias: Scalars['String']['output'];
  chains: Array<Scalars['String']['output']>;
  closed_channels_count: Scalars['Float']['output'];
  color: Scalars['String']['output'];
  current_block_hash: Scalars['String']['output'];
  current_block_height: Scalars['Float']['output'];
  is_synced_to_chain: Scalars['Boolean']['output'];
  is_synced_to_graph: Scalars['Boolean']['output'];
  latest_block_at: Scalars['String']['output'];
  peers_count: Scalars['Float']['output'];
  pending_channels_count: Scalars['Float']['output'];
  public_key: Scalars['String']['output'];
  uris: Array<Scalars['String']['output']>;
  version: Scalars['String']['output'];
};

export type NodePolicy = {
  __typename?: 'NodePolicy';
  base_fee_mtokens?: Maybe<Scalars['String']['output']>;
  cltv_delta?: Maybe<Scalars['Float']['output']>;
  fee_rate?: Maybe<Scalars['Float']['output']>;
  is_disabled?: Maybe<Scalars['Boolean']['output']>;
  max_htlc_mtokens?: Maybe<Scalars['String']['output']>;
  min_htlc_mtokens?: Maybe<Scalars['String']['output']>;
  node?: Maybe<Node>;
  updated_at?: Maybe<Scalars['String']['output']>;
};

export type NodeSocial = {
  __typename?: 'NodeSocial';
  info?: Maybe<NodeSocialInfo>;
};

export type NodeSocialInfo = {
  __typename?: 'NodeSocialInfo';
  email?: Maybe<Scalars['String']['output']>;
  private?: Maybe<Scalars['Boolean']['output']>;
  telegram?: Maybe<Scalars['String']['output']>;
  twitter?: Maybe<Scalars['String']['output']>;
  twitter_verified?: Maybe<Scalars['Boolean']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export type NodeType = {
  __typename?: 'NodeType';
  alias: Scalars['String']['output'];
  public_key: Scalars['String']['output'];
};

export type OnChainBalance = {
  __typename?: 'OnChainBalance';
  closing: Scalars['String']['output'];
  confirmed: Scalars['String']['output'];
  pending: Scalars['String']['output'];
};

export type OpenChannelParams = {
  base_fee_mtokens?: InputMaybe<Scalars['String']['input']>;
  chain_fee_tokens_per_vbyte?: InputMaybe<Scalars['Float']['input']>;
  channel_size?: InputMaybe<Scalars['Float']['input']>;
  fee_rate?: InputMaybe<Scalars['Float']['input']>;
  give_tokens?: InputMaybe<Scalars['Float']['input']>;
  is_max_funding?: InputMaybe<Scalars['Boolean']['input']>;
  is_private?: InputMaybe<Scalars['Boolean']['input']>;
  partner_public_key: Scalars['String']['input'];
};

export type OpenOrCloseChannel = {
  __typename?: 'OpenOrCloseChannel';
  transactionId: Scalars['String']['output'];
  transactionOutputIndex: Scalars['String']['output'];
};

export type PayInvoice = {
  __typename?: 'PayInvoice';
  fee: Scalars['Float']['output'];
  fee_mtokens: Scalars['String']['output'];
  hops: Array<Hops>;
  id: Scalars['String']['output'];
  is_confirmed: Scalars['Boolean']['output'];
  is_outgoing: Scalars['Boolean']['output'];
  mtokens: Scalars['String']['output'];
  safe_fee: Scalars['Float']['output'];
  safe_tokens: Scalars['Float']['output'];
  secret: Scalars['String']['output'];
  tokens: Scalars['Float']['output'];
};

export type PayRequest = {
  __typename?: 'PayRequest';
  callback?: Maybe<Scalars['String']['output']>;
  commentAllowed?: Maybe<Scalars['Float']['output']>;
  maxSendable?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['String']['output']>;
  minSendable?: Maybe<Scalars['String']['output']>;
  tag?: Maybe<Scalars['String']['output']>;
};

export type PaySuccess = {
  __typename?: 'PaySuccess';
  ciphertext?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  iv?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  tag?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type PaymentType = {
  __typename?: 'PaymentType';
  created_at: Scalars['String']['output'];
  date: Scalars['String']['output'];
  destination: Scalars['String']['output'];
  destination_node: Node;
  fee: Scalars['Float']['output'];
  fee_mtokens: Scalars['String']['output'];
  hops: Array<Node>;
  id: Scalars['String']['output'];
  index?: Maybe<Scalars['Float']['output']>;
  is_confirmed: Scalars['Boolean']['output'];
  is_outgoing: Scalars['Boolean']['output'];
  mtokens: Scalars['String']['output'];
  request?: Maybe<Scalars['String']['output']>;
  safe_fee: Scalars['Float']['output'];
  safe_tokens?: Maybe<Scalars['Float']['output']>;
  secret: Scalars['String']['output'];
  tokens: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type Peer = {
  __typename?: 'Peer';
  bytes_received: Scalars['Float']['output'];
  bytes_sent: Scalars['Float']['output'];
  is_inbound: Scalars['Boolean']['output'];
  is_sync_peer?: Maybe<Scalars['Boolean']['output']>;
  partner_node_info: Node;
  ping_time: Scalars['Float']['output'];
  public_key: Scalars['String']['output'];
  socket: Scalars['String']['output'];
  tokens_received: Scalars['Float']['output'];
  tokens_sent: Scalars['Float']['output'];
};

export type PendingChannel = {
  __typename?: 'PendingChannel';
  close_transaction_id?: Maybe<Scalars['String']['output']>;
  is_active: Scalars['Boolean']['output'];
  is_closing: Scalars['Boolean']['output'];
  is_opening: Scalars['Boolean']['output'];
  is_timelocked: Scalars['Boolean']['output'];
  local_balance: Scalars['Float']['output'];
  local_reserve: Scalars['Float']['output'];
  partner_node_info: Node;
  partner_public_key: Scalars['String']['output'];
  received: Scalars['Float']['output'];
  remote_balance: Scalars['Float']['output'];
  remote_reserve: Scalars['Float']['output'];
  sent: Scalars['Float']['output'];
  timelock_blocks?: Maybe<Scalars['Float']['output']>;
  timelock_expiration?: Maybe<Scalars['Float']['output']>;
  transaction_fee?: Maybe<Scalars['Float']['output']>;
  transaction_id: Scalars['String']['output'];
  transaction_vout: Scalars['Float']['output'];
};

export type PendingPayment = {
  __typename?: 'PendingPayment';
  id: Scalars['String']['output'];
  is_outgoing: Scalars['Boolean']['output'];
  timeout: Scalars['Float']['output'];
  tokens: Scalars['Float']['output'];
};

export type PendingResume = {
  __typename?: 'PendingResume';
  incoming_amount: Scalars['Float']['output'];
  incoming_tokens: Scalars['Float']['output'];
  outgoing_amount: Scalars['Float']['output'];
  outgoing_tokens: Scalars['Float']['output'];
  total_amount: Scalars['Float']['output'];
  total_tokens: Scalars['Float']['output'];
};

export type Policy = {
  __typename?: 'Policy';
  base_fee_mtokens?: Maybe<Scalars['String']['output']>;
  cltv_delta?: Maybe<Scalars['Float']['output']>;
  fee_rate?: Maybe<Scalars['Float']['output']>;
  is_disabled?: Maybe<Scalars['Boolean']['output']>;
  max_htlc_mtokens?: Maybe<Scalars['String']['output']>;
  min_htlc_mtokens?: Maybe<Scalars['String']['output']>;
  public_key: Scalars['String']['output'];
  updated_at?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  decodeRequest: DecodeInvoice;
  getAccount: ServerAccount;
  getAccountingReport: Scalars['String']['output'];
  getAmbossLoginToken: Scalars['String']['output'];
  getAmbossUser?: Maybe<AmbossUser>;
  getBackups: Scalars['String']['output'];
  getBaseCanConnect: Scalars['Boolean']['output'];
  getBaseNodes: Array<BaseNode>;
  getBasePoints: Array<BasePoints>;
  getBitcoinFees: BitcoinFee;
  getBitcoinPrice: Scalars['String']['output'];
  getBoltzInfo: BoltzInfoType;
  getBoltzSwapStatus: Array<BoltzSwap>;
  getChainTransactions: Array<ChainTransaction>;
  getChannel: SingleChannel;
  getChannelReport: ChannelReport;
  getChannels: Array<Channel>;
  getClosedChannels: Array<ClosedChannel>;
  getConfigState: ConfigState;
  getFeeHealth: ChannelsFeeHealth;
  getForwards: GetForwards;
  getHello: Scalars['String']['output'];
  getInvoiceStatusChange: Scalars['String']['output'];
  getInvoices: GetInvoicesType;
  getLatestVersion: Scalars['String']['output'];
  getLightningAddressInfo: PayRequest;
  getLightningAddresses: Array<LightningAddress>;
  getLnMarketsStatus: Scalars['String']['output'];
  getLnMarketsUrl: Scalars['String']['output'];
  getLnMarketsUserInfo: LnMarketsUserInfo;
  getMessages: GetMessages;
  getNetworkInfo: NetworkInfo;
  getNode: Node;
  getNodeBalances: Balances;
  getNodeInfo: NodeInfo;
  getNodeSocialInfo: LightningNodeSocialInfo;
  getPayments: GetPaymentsType;
  getPeers: Array<Peer>;
  getPendingChannels: Array<PendingChannel>;
  getServerAccounts: Array<ServerAccount>;
  getTimeHealth: ChannelsTimeHealth;
  getTwofaSecret: TwofaResult;
  getUtxos: Array<Utxo>;
  getVolumeHealth: ChannelsHealth;
  getWalletInfo: Wallet;
  recoverFunds: Scalars['Boolean']['output'];
  signMessage: Scalars['String']['output'];
  verifyBackup: Scalars['Boolean']['output'];
  verifyBackups: Scalars['Boolean']['output'];
  verifyMessage: Scalars['String']['output'];
};

export type QueryDecodeRequestArgs = {
  request: Scalars['String']['input'];
};

export type QueryGetAccountingReportArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  fiat?: InputMaybe<Scalars['String']['input']>;
  month?: InputMaybe<Scalars['String']['input']>;
  year?: InputMaybe<Scalars['String']['input']>;
};

export type QueryGetBoltzSwapStatusArgs = {
  ids: Array<Scalars['String']['input']>;
};

export type QueryGetChannelArgs = {
  id: Scalars['String']['input'];
};

export type QueryGetChannelsArgs = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QueryGetForwardsArgs = {
  days: Scalars['Float']['input'];
};

export type QueryGetInvoiceStatusChangeArgs = {
  id: Scalars['String']['input'];
};

export type QueryGetInvoicesArgs = {
  token?: InputMaybe<Scalars['String']['input']>;
};

export type QueryGetLightningAddressInfoArgs = {
  address: Scalars['String']['input'];
};

export type QueryGetMessagesArgs = {
  initialize?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QueryGetNodeArgs = {
  publicKey: Scalars['String']['input'];
  withoutChannels?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QueryGetNodeSocialInfoArgs = {
  pubkey: Scalars['String']['input'];
};

export type QueryGetPaymentsArgs = {
  token?: InputMaybe<Scalars['String']['input']>;
};

export type QueryRecoverFundsArgs = {
  backup: Scalars['String']['input'];
};

export type QuerySignMessageArgs = {
  message: Scalars['String']['input'];
};

export type QueryVerifyBackupArgs = {
  backup: Scalars['String']['input'];
};

export type QueryVerifyBackupsArgs = {
  backup: Scalars['String']['input'];
};

export type QueryVerifyMessageArgs = {
  message: Scalars['String']['input'];
  signature: Scalars['String']['input'];
};

export type Route = {
  __typename?: 'Route';
  base_fee_mtokens?: Maybe<Scalars['String']['output']>;
  channel?: Maybe<Scalars['String']['output']>;
  cltv_delta?: Maybe<Scalars['Float']['output']>;
  fee_rate?: Maybe<Scalars['Float']['output']>;
  public_key: Scalars['String']['output'];
};

export type ServerAccount = {
  __typename?: 'ServerAccount';
  id: Scalars['String']['output'];
  loggedIn: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  twofaEnabled: Scalars['Boolean']['output'];
  type: Scalars['String']['output'];
};

export type SingleChannel = {
  __typename?: 'SingleChannel';
  capacity: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  node_policies?: Maybe<NodePolicy>;
  partner_node_policies?: Maybe<NodePolicy>;
  policies: Array<Policy>;
  transaction_id: Scalars['String']['output'];
  transaction_vout: Scalars['Float']['output'];
  updated_at?: Maybe<Scalars['String']['output']>;
};

export type TwofaResult = {
  __typename?: 'TwofaResult';
  secret: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type UpdateRoutingFeesParams = {
  base_fee_mtokens?: InputMaybe<Scalars['String']['input']>;
  base_fee_tokens?: InputMaybe<Scalars['Float']['input']>;
  cltv_delta?: InputMaybe<Scalars['Float']['input']>;
  fee_rate?: InputMaybe<Scalars['Float']['input']>;
  max_htlc_mtokens?: InputMaybe<Scalars['String']['input']>;
  min_htlc_mtokens?: InputMaybe<Scalars['String']['input']>;
  transaction_id?: InputMaybe<Scalars['String']['input']>;
  transaction_vout?: InputMaybe<Scalars['Float']['input']>;
};

export type UserBackupInfo = {
  __typename?: 'UserBackupInfo';
  last_update?: Maybe<Scalars['String']['output']>;
  last_update_size?: Maybe<Scalars['String']['output']>;
  total_size_saved: Scalars['String']['output'];
};

export type UserGhostInfo = {
  __typename?: 'UserGhostInfo';
  username?: Maybe<Scalars['String']['output']>;
};

export type Utxo = {
  __typename?: 'Utxo';
  address: Scalars['String']['output'];
  address_format: Scalars['String']['output'];
  confirmation_count: Scalars['Float']['output'];
  output_script: Scalars['String']['output'];
  tokens: Scalars['Float']['output'];
  transaction_id: Scalars['String']['output'];
  transaction_vout: Scalars['Float']['output'];
};

export type Wallet = {
  __typename?: 'Wallet';
  build_tags: Array<Scalars['String']['output']>;
  commit_hash: Scalars['String']['output'];
  is_autopilotrpc_enabled: Scalars['Boolean']['output'];
  is_chainrpc_enabled: Scalars['Boolean']['output'];
  is_invoicesrpc_enabled: Scalars['Boolean']['output'];
  is_signrpc_enabled: Scalars['Boolean']['output'];
  is_walletrpc_enabled: Scalars['Boolean']['output'];
  is_watchtowerrpc_enabled: Scalars['Boolean']['output'];
  is_wtclientrpc_enabled: Scalars['Boolean']['output'];
};

export type WithdrawRequest = {
  __typename?: 'WithdrawRequest';
  callback?: Maybe<Scalars['String']['output']>;
  defaultDescription?: Maybe<Scalars['String']['output']>;
  k1?: Maybe<Scalars['String']['output']>;
  maxWithdrawable?: Maybe<Scalars['String']['output']>;
  minWithdrawable?: Maybe<Scalars['String']['output']>;
  tag?: Maybe<Scalars['String']['output']>;
};
