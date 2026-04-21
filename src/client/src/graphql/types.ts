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

export type AccessIds = {
  __typename?: 'AccessIds';
  ids: Array<Scalars['String']['output']>;
};

export type AddNodeInput = {
  litd?: InputMaybe<LitdInput>;
  lnd?: InputMaybe<LndInput>;
  name: Scalars['String']['input'];
};

export type AddNodeResult = {
  __typename?: 'AddNodeResult';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
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
  subscription: AmbossSubscription;
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  message: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type BakeSuperMacaroonInput = {
  read_only?: Scalars['Boolean']['input'];
  /** LITD REST endpoint (e.g. https://host:8443) */
  rest_host: Scalars['String']['input'];
};

export type Balances = {
  __typename?: 'Balances';
  lightning: LightningBalance;
  onchain: OnChainBalance;
};

export type BaseNodeInfo = {
  __typename?: 'BaseNodeInfo';
  alias: Scalars['String']['output'];
  public_key: Scalars['String']['output'];
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

export type CancelMagmaOrderInput = {
  cancellationReason: OrderCancellationReason;
  orderId: Scalars['String']['input'];
};

export type CancelMagmaOrderResult = {
  __typename?: 'CancelMagmaOrderResult';
  success: Scalars['Boolean']['output'];
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
  asset?: Maybe<ChannelAsset>;
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

export type ChannelAsset = {
  __typename?: 'ChannelAsset';
  assetId: Scalars['String']['output'];
  capacity: Scalars['String']['output'];
  groupKey?: Maybe<Scalars['String']['output']>;
  localBalance: Scalars['String']['output'];
  remoteBalance: Scalars['String']['output'];
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

export type CreateInitialUserResult = {
  __typename?: 'CreateInitialUserResult';
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  role: Scalars['String']['output'];
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

export type CurrentNode = {
  __typename?: 'CurrentNode';
  capabilities: NodeCapabilities;
  created_at?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  network?: Maybe<Scalars['String']['output']>;
  socket: Scalars['String']['output'];
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

export type DeleteNodeResult = {
  __typename?: 'DeleteNodeResult';
  success: Scalars['Boolean']['output'];
};

export type EditNodeInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  slug: Scalars['String']['input'];
};

export type EditNodeResult = {
  __typename?: 'EditNodeResult';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
};

export type ExecuteTradeInput = {
  assetAmount: Scalars['String']['input'];
  expiryEpoch?: InputMaybe<Scalars['String']['input']>;
  paymentRequest?: InputMaybe<Scalars['String']['input']>;
  peerPubkey: Scalars['String']['input'];
  rfqId?: InputMaybe<Scalars['String']['input']>;
  satsAmount: Scalars['String']['input'];
  tapdAssetId: Scalars['String']['input'];
  tapdGroupKey?: InputMaybe<Scalars['String']['input']>;
  transactionType: TapTransactionType;
};

export type ExecuteTradeResult = {
  __typename?: 'ExecuteTradeResult';
  feeSats?: Maybe<Scalars['String']['output']>;
  paymentPreimage?: Maybe<Scalars['String']['output']>;
  satsAmount?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
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

export type GetPaymentsType = {
  __typename?: 'GetPaymentsType';
  next?: Maybe<Scalars['String']['output']>;
  payments: Array<PaymentType>;
};

export type GetTapOffersInput = {
  ambossAssetId: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  minAmount?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<TapOfferSortBy>;
  sortDir?: InputMaybe<TapOfferSortDir>;
  transactionType: TapTransactionType;
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

export type LightningQueries = {
  __typename?: 'LightningQueries';
  get_access_ids: AccessIds;
  id: Scalars['String']['output'];
};

export type LitdInput = {
  cert?: InputMaybe<Scalars['String']['input']>;
  macaroon: Scalars['String']['input'];
  socket: Scalars['String']['input'];
};

export type LnUrlRequest = ChannelRequest | PayRequest | WithdrawRequest;

export type LndInput = {
  cert?: InputMaybe<Scalars['String']['input']>;
  macaroon: Scalars['String']['input'];
  socket: Scalars['String']['input'];
};

export type MagmaMutations = {
  __typename?: 'MagmaMutations';
  cancel_order: CancelMagmaOrderResult;
};

export type MagmaMutationsCancel_OrderArgs = {
  input: CancelMagmaOrderInput;
};

export type MagmaOrder = {
  __typename?: 'MagmaOrder';
  amount: MagmaOrderAmount;
  channelId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  destination: MagmaOrderParty;
  fees: MagmaOrderFees;
  id: Scalars['String']['output'];
  paymentStatus?: Maybe<Scalars['String']['output']>;
  source: MagmaOrderParty;
  status: Scalars['String']['output'];
  timeout?: Maybe<Scalars['String']['output']>;
};

export type MagmaOrderAmount = {
  __typename?: 'MagmaOrderAmount';
  sats?: Maybe<Scalars['String']['output']>;
};

export type MagmaOrderFeeAmount = {
  __typename?: 'MagmaOrderFeeAmount';
  sats?: Maybe<Scalars['Int']['output']>;
};

export type MagmaOrderFees = {
  __typename?: 'MagmaOrderFees';
  buyer?: Maybe<MagmaOrderFeeAmount>;
  seller?: Maybe<MagmaOrderFeeAmount>;
};

export type MagmaOrderParty = {
  __typename?: 'MagmaOrderParty';
  alias?: Maybe<Scalars['String']['output']>;
  pubkey?: Maybe<Scalars['String']['output']>;
};

export type MagmaOrderInvoice = {
  __typename?: 'MagmaOrderInvoice';
  invoice?: Maybe<Scalars['String']['output']>;
};

export type MagmaOrderQueries = {
  __typename?: 'MagmaOrderQueries';
  find_many?: Maybe<MagmaPendingOrders>;
  get_invoice: MagmaOrderInvoice;
};

export type MagmaOrderQueriesGet_InvoiceArgs = {
  orderId: Scalars['String']['input'];
};

export type MagmaPendingOrders = {
  __typename?: 'MagmaPendingOrders';
  magmaUrl: Scalars['String']['output'];
  purchases: Array<MagmaOrder>;
  sales: Array<MagmaOrder>;
};

export type MagmaQueries = {
  __typename?: 'MagmaQueries';
  get_tap_offers: TapTradeOfferList;
  id: Scalars['String']['output'];
  orders: MagmaOrderQueries;
};

export type MagmaQueriesGet_Tap_OffersArgs = {
  input: GetTapOffersInput;
};

export type MessageType = {
  __typename?: 'MessageType';
  message?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addPeer: Scalars['Boolean']['output'];
  bakeSuperMacaroon: SuperMacaroon;
  claimBoltzTransaction: Scalars['String']['output'];
  closeChannel: OpenOrCloseChannel;
  createAddress: Scalars['String']['output'];
  createBoltzReverseSwap: CreateBoltzReverseSwapType;
  createInvoice: CreateInvoice;
  createMacaroon: CreateMacaroon;
  executeTrade: ExecuteTradeResult;
  fetchLnUrl: LnUrlRequest;
  keysend: PayInvoice;
  lnUrlAuth: AuthResponse;
  lnUrlChannel: Scalars['String']['output'];
  lnUrlPay: PaySuccess;
  lnUrlWithdraw: Scalars['String']['output'];
  loginAmboss: Scalars['Boolean']['output'];
  logout: Scalars['Boolean']['output'];
  magma: MagmaMutations;
  openChannel: OpenOrCloseChannel;
  pay: Scalars['Boolean']['output'];
  public: PublicMutation;
  purchaseLiquidity: Scalars['Boolean']['output'];
  pushBackup: Scalars['Boolean']['output'];
  removePeer: Scalars['Boolean']['output'];
  removeTwofaSecret: Scalars['Boolean']['output'];
  sendToAddress: ChainAddressSend;
  setupTradePartner: SetupTradePartnerResult;
  taproot_assets: TaprootAssetsMutations;
  team: TeamMutations;
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

export type MutationBakeSuperMacaroonArgs = {
  input: BakeSuperMacaroonInput;
};

export type MutationClaimBoltzTransactionArgs = {
  destination: Scalars['String']['input'];
  fee: Scalars['Float']['input'];
  id: Scalars['String']['input'];
  lockupAddress: Scalars['String']['input'];
  preimage: Scalars['String']['input'];
  privateKey: Scalars['String']['input'];
  redeem: Scalars['String']['input'];
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

export type MutationExecuteTradeArgs = {
  input: ExecuteTradeInput;
};

export type MutationFetchLnUrlArgs = {
  url: Scalars['String']['input'];
};

export type MutationKeysendArgs = {
  destination?: InputMaybe<Scalars['String']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  tokens: Scalars['Float']['input'];
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

export type MutationPurchaseLiquidityArgs = {
  amount_cents: Scalars['String']['input'];
};

export type MutationRemovePeerArgs = {
  publicKey?: InputMaybe<Scalars['String']['input']>;
};

export type MutationRemoveTwofaSecretArgs = {
  token: Scalars['String']['input'];
};

export type MutationSendToAddressArgs = {
  address: Scalars['String']['input'];
  fee?: InputMaybe<Scalars['Float']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  target?: InputMaybe<Scalars['Float']['input']>;
  tokens?: InputMaybe<Scalars['Float']['input']>;
};

export type MutationSetupTradePartnerArgs = {
  input: SetupTradePartnerInput;
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

export type NodeCapabilities = {
  __typename?: 'NodeCapabilities';
  list: Array<Scalars['String']['output']>;
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
  latest_block_height?: Maybe<Scalars['Float']['output']>;
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
  is_recommended?: InputMaybe<Scalars['Boolean']['input']>;
  partner_public_key?: InputMaybe<Scalars['String']['input']>;
};

export type OpenOrCloseChannel = {
  __typename?: 'OpenOrCloseChannel';
  transactionId: Scalars['String']['output'];
  transactionOutputIndex: Scalars['String']['output'];
};

export enum OrderCancellationReason {
  ChannelSizeOutOfBounds = 'CHANNEL_SIZE_OUT_OF_BOUNDS',
  UnableToConnectToNode = 'UNABLE_TO_CONNECT_TO_NODE',
  UnableToPay = 'UNABLE_TO_PAY',
}

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
  asset?: Maybe<ChannelAsset>;
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

export type PublicMutation = {
  __typename?: 'PublicMutation';
  create_initial_user: CreateInitialUserResult;
  get_auth_token: Scalars['Boolean']['output'];
  get_db_session_token: Scalars['Boolean']['output'];
  get_session_token: Scalars['String']['output'];
};

export type PublicMutationCreate_Initial_UserArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type PublicMutationGet_Auth_TokenArgs = {
  cookie?: InputMaybe<Scalars['String']['input']>;
};

export type PublicMutationGet_Db_Session_TokenArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type PublicMutationGet_Session_TokenArgs = {
  id: Scalars['String']['input'];
  password: Scalars['String']['input'];
  token?: InputMaybe<Scalars['String']['input']>;
};

export type PublicQueries = {
  __typename?: 'PublicQueries';
  get_server_accounts: Array<ServerAccount>;
  get_session_info: SessionInfo;
  id: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  getAccount: ServerAccount;
  getAmbossLoginToken: Scalars['String']['output'];
  getAmbossUser?: Maybe<AmbossUser>;
  getBackups: Scalars['String']['output'];
  getBitcoinFees: BitcoinFee;
  getBitcoinPrice: Scalars['String']['output'];
  getBoltzInfo: BoltzInfoType;
  getChainTransactions: Array<ChainTransaction>;
  getChannel: SingleChannel;
  getChannelReport: ChannelReport;
  getChannels: Array<Channel>;
  getClosedChannels: Array<ClosedChannel>;
  getConfigState: ConfigState;
  getForwards: GetForwards;
  getHello: Scalars['String']['output'];
  getInvoiceStatusChange: Scalars['String']['output'];
  getInvoices: GetInvoicesType;
  getLatestVersion: Scalars['String']['output'];
  getLightningAddressInfo: PayRequest;
  getLiquidityPerUsd: Scalars['String']['output'];
  getNetworkInfo: NetworkInfo;
  getNode: Node;
  getNodeBalances: Balances;
  getNodeInfo: NodeInfo;
  getNodeSocialInfo: LightningNodeSocialInfo;
  getPayments: GetPaymentsType;
  getPeers: Array<Peer>;
  getPendingChannels: Array<PendingChannel>;
  getTradeQuote: TradeQuoteResult;
  getTwofaSecret: TwofaResult;
  getUtxos: Array<Utxo>;
  getWalletInfo: Wallet;
  lightning: LightningQueries;
  magma: MagmaQueries;
  node: CurrentNode;
  public: PublicQueries;
  rails: RailsQueries;
  recoverFunds: Scalars['Boolean']['output'];
  signMessage: Scalars['String']['output'];
  taproot_assets: TaprootAssetsQueries;
  user: UserQueries;
  verifyBackup: Scalars['Boolean']['output'];
  verifyBackups: Scalars['Boolean']['output'];
  verifyMessage: Scalars['String']['output'];
};

export type QueryGetAmbossLoginTokenArgs = {
  redirect_url?: InputMaybe<Scalars['String']['input']>;
};

export type QueryGetChannelArgs = {
  id: Scalars['String']['input'];
};

export type QueryGetChannelsArgs = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  partner_public_key?: InputMaybe<Scalars['String']['input']>;
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

export type QueryGetTradeQuoteArgs = {
  input: TradeQuoteInput;
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

export type RailsQueries = {
  __typename?: 'RailsQueries';
  get_tap_supported_assets: TapSupportedAssetList;
  id: Scalars['String']['output'];
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
  hasNode?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  twofaEnabled: Scalars['Boolean']['output'];
  type: Scalars['String']['output'];
};

export type SessionInfo = {
  __typename?: 'SessionInfo';
  loggedIn: Scalars['Boolean']['output'];
  name?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type SetupTradePartnerInput = {
  ambossAssetId: Scalars['String']['input'];
  assetAmount: Scalars['String']['input'];
  assetRate: Scalars['String']['input'];
  magmaOfferId: Scalars['String']['input'];
  satsAmount?: InputMaybe<Scalars['String']['input']>;
  swapNodePubkey: Scalars['String']['input'];
  swapNodeSockets?: InputMaybe<Array<Scalars['String']['input']>>;
  tapdAssetId?: InputMaybe<Scalars['String']['input']>;
  tapdGroupKey?: InputMaybe<Scalars['String']['input']>;
  transactionType: TapTransactionType;
};

export type SetupTradePartnerResult = {
  __typename?: 'SetupTradePartnerResult';
  magmaOrderAmountAsset?: Maybe<Scalars['String']['output']>;
  magmaOrderAmountSats?: Maybe<Scalars['String']['output']>;
  magmaOrderFeeSats?: Maybe<Scalars['String']['output']>;
  magmaOrderId?: Maybe<Scalars['String']['output']>;
  magmaOrderStatus?: Maybe<Scalars['String']['output']>;
  outboundChannelOutputIndex?: Maybe<Scalars['Int']['output']>;
  outboundChannelTxid?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
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

export type SuperMacaroon = {
  __typename?: 'SuperMacaroon';
  base: Scalars['String']['output'];
  hex: Scalars['String']['output'];
};

export type TapAddress = {
  __typename?: 'TapAddress';
  amount: Scalars['String']['output'];
  asset_id: Scalars['String']['output'];
  asset_type: Scalars['String']['output'];
  encoded: Scalars['String']['output'];
  group_key?: Maybe<Scalars['String']['output']>;
  internal_key: Scalars['String']['output'];
  script_key: Scalars['String']['output'];
  taproot_output_key: Scalars['String']['output'];
};

export type TapAsset = {
  __typename?: 'TapAsset';
  amount: Scalars['String']['output'];
  asset_genesis?: Maybe<TapAssetGenesis>;
  is_burn: Scalars['Boolean']['output'];
  is_spent: Scalars['Boolean']['output'];
  lock_time: Scalars['Int']['output'];
  relative_lock_time: Scalars['Int']['output'];
  script_key: Scalars['String']['output'];
  script_version: Scalars['Int']['output'];
};

export type TapAssetBalanceEntry = {
  __typename?: 'TapAssetBalanceEntry';
  asset_id?: Maybe<Scalars['String']['output']>;
  balance: Scalars['String']['output'];
  group_key?: Maybe<Scalars['String']['output']>;
  names?: Maybe<Array<Scalars['String']['output']>>;
};

export type TapAssetChannelBalance = {
  __typename?: 'TapAssetChannelBalance';
  asset_id: Scalars['String']['output'];
  capacity: Scalars['String']['output'];
  channel_point: Scalars['String']['output'];
  group_key?: Maybe<Scalars['String']['output']>;
  local_balance: Scalars['String']['output'];
  partner_public_key: Scalars['String']['output'];
  remote_balance: Scalars['String']['output'];
};

export type TapAssetGenesis = {
  __typename?: 'TapAssetGenesis';
  asset_id: Scalars['String']['output'];
  asset_type: TapAssetType;
  genesis_point: Scalars['String']['output'];
  meta_hash: Scalars['String']['output'];
  name: Scalars['String']['output'];
  output_index: Scalars['Int']['output'];
};

export type TapAssetInvoiceInput = {
  asset_amount: Scalars['String']['input'];
  asset_id?: InputMaybe<Scalars['String']['input']>;
  expiry?: InputMaybe<Scalars['Int']['input']>;
  group_key?: InputMaybe<Scalars['String']['input']>;
  memo?: InputMaybe<Scalars['String']['input']>;
  peer_pubkey?: InputMaybe<Scalars['String']['input']>;
};

export type TapAssetInvoiceResponse = {
  __typename?: 'TapAssetInvoiceResponse';
  add_index: Scalars['String']['output'];
  asset_amount: Scalars['String']['output'];
  asset_id?: Maybe<Scalars['String']['output']>;
  group_key?: Maybe<Scalars['String']['output']>;
  payment_addr: Scalars['String']['output'];
  payment_request: Scalars['String']['output'];
  r_hash: Scalars['String']['output'];
};

export type TapAssetList = {
  __typename?: 'TapAssetList';
  assets: Array<TapAsset>;
};

export type TapAssetPrice = {
  __typename?: 'TapAssetPrice';
  id?: Maybe<Scalars['String']['output']>;
  usd?: Maybe<Scalars['Float']['output']>;
};

export enum TapAssetType {
  Collectible = 'COLLECTIBLE',
  Normal = 'NORMAL',
}

export enum TapBalanceGroupBy {
  AssetId = 'ASSET_ID',
  GroupKey = 'GROUP_KEY',
}

export type TapBalances = {
  __typename?: 'TapBalances';
  balances: Array<TapAssetBalanceEntry>;
};

export type TapFederationServer = {
  __typename?: 'TapFederationServer';
  host: Scalars['String']['output'];
  id: Scalars['Int']['output'];
};

export type TapFederationServerList = {
  __typename?: 'TapFederationServerList';
  node_address?: Maybe<Scalars['String']['output']>;
  servers: Array<TapFederationServer>;
};

export type TapFinalizeBatchResponse = {
  __typename?: 'TapFinalizeBatchResponse';
  batch_key: Scalars['String']['output'];
};

export type TapFundChannelInput = {
  asset_amount: Scalars['String']['input'];
  asset_id?: InputMaybe<Scalars['String']['input']>;
  fee_rate_sat_per_vbyte?: InputMaybe<Scalars['Int']['input']>;
  group_key?: InputMaybe<Scalars['String']['input']>;
  peer_pubkey: Scalars['String']['input'];
  push_sat?: InputMaybe<Scalars['Int']['input']>;
  universe_host?: InputMaybe<Scalars['String']['input']>;
};

export type TapFundChannelResponse = {
  __typename?: 'TapFundChannelResponse';
  output_index: Scalars['Int']['output'];
  txid: Scalars['String']['output'];
};

export type TapMintAssetInput = {
  amount: Scalars['String']['input'];
  asset_type?: TapAssetType;
  group_key?: InputMaybe<Scalars['String']['input']>;
  grouped?: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  precision: Scalars['Int']['input'];
};

export type TapMintResponse = {
  __typename?: 'TapMintResponse';
  batch_key: Scalars['String']['output'];
};

export enum TapOfferSortBy {
  Available = 'AVAILABLE',
  Rate = 'RATE',
}

export enum TapOfferSortDir {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type TapSupportedAsset = {
  __typename?: 'TapSupportedAsset';
  assetId?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  groupKey?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  precision: Scalars['Int']['output'];
  prices?: Maybe<TapAssetPrice>;
  symbol: Scalars['String']['output'];
  universeHost?: Maybe<Scalars['String']['output']>;
};

export type TapSupportedAssetList = {
  __typename?: 'TapSupportedAssetList';
  list: Array<TapSupportedAsset>;
  totalCount: Scalars['Float']['output'];
};

export type TapSyncResult = {
  __typename?: 'TapSyncResult';
  synced_universes: Array<Scalars['String']['output']>;
};

export type TapTradeOffer = {
  __typename?: 'TapTradeOffer';
  available: TapTradeOfferAmount;
  id: Scalars['String']['output'];
  magmaOfferId: Scalars['String']['output'];
  node: TapTradeOfferNode;
  rate: TapTradeOfferAmount;
};

export type TapTradeOfferAmount = {
  __typename?: 'TapTradeOfferAmount';
  displayAmount: Scalars['String']['output'];
  fullAmount: Scalars['String']['output'];
};

export type TapTradeOfferList = {
  __typename?: 'TapTradeOfferList';
  list: Array<TapTradeOffer>;
  totalCount: Scalars['Float']['output'];
};

export type TapTradeOfferNode = {
  __typename?: 'TapTradeOfferNode';
  alias?: Maybe<Scalars['String']['output']>;
  pubkey?: Maybe<Scalars['String']['output']>;
  sockets: Array<Scalars['String']['output']>;
};

export enum TapTransactionType {
  Purchase = 'PURCHASE',
  Sale = 'SALE',
}

export type TapTransfer = {
  __typename?: 'TapTransfer';
  anchor_tx_chain_fees: Scalars['String']['output'];
  anchor_tx_hash: Scalars['String']['output'];
  anchor_tx_height_hint: Scalars['Int']['output'];
  inputs: Array<TapTransferInput>;
  label: Scalars['String']['output'];
  outputs: Array<TapTransferOutput>;
  transfer_timestamp: Scalars['String']['output'];
};

export type TapTransferInput = {
  __typename?: 'TapTransferInput';
  amount: Scalars['String']['output'];
  anchor_point: Scalars['String']['output'];
  asset_id: Scalars['String']['output'];
};

export type TapTransferList = {
  __typename?: 'TapTransferList';
  transfers: Array<TapTransfer>;
};

export type TapTransferOutput = {
  __typename?: 'TapTransferOutput';
  amount: Scalars['String']['output'];
  asset_id: Scalars['String']['output'];
  output_type: Scalars['String']['output'];
  script_key_is_local: Scalars['Boolean']['output'];
};

export type TapUniverseAsset = {
  __typename?: 'TapUniverseAsset';
  asset_id?: Maybe<Scalars['String']['output']>;
  group_key?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  proof_type: Scalars['String']['output'];
  total_supply: Scalars['String']['output'];
};

export type TapUniverseAssetList = {
  __typename?: 'TapUniverseAssetList';
  assets: Array<TapUniverseAsset>;
};

export type TapUniverseInfo = {
  __typename?: 'TapUniverseInfo';
  runtime_id: Scalars['String']['output'];
};

export type TapUniverseStats = {
  __typename?: 'TapUniverseStats';
  num_total_assets: Scalars['Int']['output'];
  num_total_groups: Scalars['Int']['output'];
  num_total_proofs: Scalars['Int']['output'];
  num_total_syncs: Scalars['Int']['output'];
};

export type TaprootAssetsMutations = {
  __typename?: 'TaprootAssetsMutations';
  add_asset_invoice: TapAssetInvoiceResponse;
  add_federation_server: Scalars['Boolean']['output'];
  burn_asset: Scalars['Boolean']['output'];
  cancel_batch: Scalars['Boolean']['output'];
  finalize_batch: TapFinalizeBatchResponse;
  fund_asset_channel: TapFundChannelResponse;
  mint_asset: TapMintResponse;
  new_address: TapAddress;
  remove_federation_server: Scalars['Boolean']['output'];
  send_asset: Scalars['Boolean']['output'];
  sync_universe: TapSyncResult;
};

export type TaprootAssetsMutationsAdd_Asset_InvoiceArgs = {
  input: TapAssetInvoiceInput;
};

export type TaprootAssetsMutationsAdd_Federation_ServerArgs = {
  host: Scalars['String']['input'];
};

export type TaprootAssetsMutationsBurn_AssetArgs = {
  amount: Scalars['String']['input'];
  asset_id: Scalars['String']['input'];
};

export type TaprootAssetsMutationsFund_Asset_ChannelArgs = {
  input: TapFundChannelInput;
};

export type TaprootAssetsMutationsMint_AssetArgs = {
  input: TapMintAssetInput;
};

export type TaprootAssetsMutationsNew_AddressArgs = {
  amt?: InputMaybe<Scalars['String']['input']>;
  asset_id?: InputMaybe<Scalars['String']['input']>;
  group_key?: InputMaybe<Scalars['String']['input']>;
  proof_courier_addr?: InputMaybe<Scalars['String']['input']>;
};

export type TaprootAssetsMutationsRemove_Federation_ServerArgs = {
  host: Scalars['String']['input'];
};

export type TaprootAssetsMutationsSend_AssetArgs = {
  tap_addrs: Array<Scalars['String']['input']>;
};

export type TaprootAssetsMutationsSync_UniverseArgs = {
  host: Scalars['String']['input'];
};

export type TaprootAssetsQueries = {
  __typename?: 'TaprootAssetsQueries';
  decode_address: TapAddress;
  get_asset_channel_balances: Array<TapAssetChannelBalance>;
  get_assets: TapAssetList;
  get_balances: TapBalances;
  get_federation_servers: TapFederationServerList;
  get_transfers: TapTransferList;
  get_universe_assets: TapUniverseAssetList;
  get_universe_info: TapUniverseInfo;
  get_universe_stats: TapUniverseStats;
  id: Scalars['String']['output'];
};

export type TaprootAssetsQueriesDecode_AddressArgs = {
  addr: Scalars['String']['input'];
};

export type TaprootAssetsQueriesGet_Asset_Channel_BalancesArgs = {
  peer_pubkey?: InputMaybe<Scalars['String']['input']>;
};

export type TaprootAssetsQueriesGet_BalancesArgs = {
  group_by?: InputMaybe<TapBalanceGroupBy>;
};

export type TeamMutations = {
  __typename?: 'TeamMutations';
  add_node: AddNodeResult;
  delete_node: DeleteNodeResult;
  edit_node: EditNodeResult;
};

export type TeamMutationsAdd_NodeArgs = {
  input: AddNodeInput;
};

export type TeamMutationsDelete_NodeArgs = {
  slug: Scalars['String']['input'];
};

export type TeamMutationsEdit_NodeArgs = {
  input: EditNodeInput;
};

export type TradeQuoteInput = {
  assetAmount: Scalars['String']['input'];
  expiry?: InputMaybe<Scalars['Float']['input']>;
  peerPubkey: Scalars['String']['input'];
  tapdAssetId: Scalars['String']['input'];
  tapdGroupKey?: InputMaybe<Scalars['String']['input']>;
  transactionType: TapTransactionType;
};

export type TradeQuoteResult = {
  __typename?: 'TradeQuoteResult';
  assetAmount: Scalars['String']['output'];
  expiryEpoch?: Maybe<Scalars['String']['output']>;
  paymentRequest?: Maybe<Scalars['String']['output']>;
  rateFixed?: Maybe<Scalars['String']['output']>;
  rfqId?: Maybe<Scalars['String']['output']>;
  satsAmount: Scalars['String']['output'];
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

export type UserNode = {
  __typename?: 'UserNode';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  network?: Maybe<Scalars['String']['output']>;
  slug: Scalars['String']['output'];
  type?: Maybe<Scalars['String']['output']>;
};

export type UserQueries = {
  __typename?: 'UserQueries';
  get_nodes: Array<UserNode>;
  id: Scalars['String']['output'];
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
