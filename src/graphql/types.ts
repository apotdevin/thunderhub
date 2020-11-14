/* eslint-disable */
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: any;
  /** A time string at UTC, such as 10:15:30Z, compliant with the `full-time` format outlined in section 5.6 of the RFC 3339profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Time: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
};

export type PermissionsType = {
  is_ok_to_adjust_peers?: Maybe<Scalars['Boolean']>;
  is_ok_to_create_chain_addresses?: Maybe<Scalars['Boolean']>;
  is_ok_to_create_invoices?: Maybe<Scalars['Boolean']>;
  is_ok_to_create_macaroons?: Maybe<Scalars['Boolean']>;
  is_ok_to_derive_keys?: Maybe<Scalars['Boolean']>;
  is_ok_to_get_chain_transactions?: Maybe<Scalars['Boolean']>;
  is_ok_to_get_invoices?: Maybe<Scalars['Boolean']>;
  is_ok_to_get_wallet_info?: Maybe<Scalars['Boolean']>;
  is_ok_to_get_payments?: Maybe<Scalars['Boolean']>;
  is_ok_to_get_peers?: Maybe<Scalars['Boolean']>;
  is_ok_to_pay?: Maybe<Scalars['Boolean']>;
  is_ok_to_send_to_chain_addresses?: Maybe<Scalars['Boolean']>;
  is_ok_to_sign_bytes?: Maybe<Scalars['Boolean']>;
  is_ok_to_sign_messages?: Maybe<Scalars['Boolean']>;
  is_ok_to_stop_daemon?: Maybe<Scalars['Boolean']>;
  is_ok_to_verify_bytes_signatures?: Maybe<Scalars['Boolean']>;
  is_ok_to_verify_messages?: Maybe<Scalars['Boolean']>;
};




export type Query = {
  __typename?: 'Query';
  getInvoiceStatusChange?: Maybe<Scalars['String']>;
  getBaseCanConnect: Scalars['Boolean'];
  getBaseNodes: Array<Maybe<BaseNodesType>>;
  getBasePoints: Array<Maybe<BasePointsType>>;
  getAccountingReport: Scalars['String'];
  getVolumeHealth?: Maybe<ChannelsHealth>;
  getTimeHealth?: Maybe<ChannelsTimeHealth>;
  getFeeHealth?: Maybe<ChannelsFeeHealth>;
  getChannelBalance?: Maybe<ChannelBalanceType>;
  getChannels: Array<Maybe<ChannelType>>;
  getClosedChannels?: Maybe<Array<Maybe<ClosedChannelType>>>;
  getPendingChannels?: Maybe<Array<Maybe<PendingChannelType>>>;
  getChannelReport?: Maybe<ChannelReportType>;
  getNetworkInfo?: Maybe<NetworkInfoType>;
  getNodeInfo?: Maybe<NodeInfoType>;
  adminCheck?: Maybe<Scalars['Boolean']>;
  getNode: Node;
  decodeRequest?: Maybe<DecodeType>;
  getWalletInfo?: Maybe<WalletInfoType>;
  getResume?: Maybe<GetResumeType>;
  getForwardsPastDays: Array<Maybe<Forward>>;
  getBitcoinPrice?: Maybe<Scalars['String']>;
  getBitcoinFees?: Maybe<BitcoinFeeType>;
  getForwardChannelsReport?: Maybe<Scalars['String']>;
  getInOut?: Maybe<InOutType>;
  getBackups?: Maybe<Scalars['String']>;
  verifyBackups?: Maybe<Scalars['Boolean']>;
  recoverFunds?: Maybe<Scalars['Boolean']>;
  getRoutes?: Maybe<GetRouteType>;
  getPeers?: Maybe<Array<Maybe<PeerType>>>;
  signMessage?: Maybe<Scalars['String']>;
  verifyMessage?: Maybe<Scalars['String']>;
  getChainBalance?: Maybe<Scalars['Int']>;
  getPendingChainBalance?: Maybe<Scalars['Int']>;
  getChainTransactions?: Maybe<Array<Maybe<GetTransactionsType>>>;
  getUtxos?: Maybe<Array<Maybe<GetUtxosType>>>;
  getMessages?: Maybe<GetMessagesType>;
  getAuthToken: Scalars['Boolean'];
  getSessionToken?: Maybe<Scalars['Boolean']>;
  getServerAccounts?: Maybe<Array<Maybe<ServerAccountType>>>;
  getAccount?: Maybe<ServerAccountType>;
  getLatestVersion?: Maybe<Scalars['String']>;
};


export type QueryGetInvoiceStatusChangeArgs = {
  id: Scalars['String'];
};


export type QueryGetAccountingReportArgs = {
  category?: Maybe<Scalars['String']>;
  currency?: Maybe<Scalars['String']>;
  fiat?: Maybe<Scalars['String']>;
  month?: Maybe<Scalars['String']>;
  year?: Maybe<Scalars['String']>;
};


export type QueryGetChannelsArgs = {
  active?: Maybe<Scalars['Boolean']>;
};


export type QueryGetClosedChannelsArgs = {
  type?: Maybe<Scalars['String']>;
};


export type QueryGetNodeArgs = {
  publicKey: Scalars['String'];
  withoutChannels?: Maybe<Scalars['Boolean']>;
};


export type QueryDecodeRequestArgs = {
  request: Scalars['String'];
};


export type QueryGetResumeArgs = {
  token?: Maybe<Scalars['String']>;
};


export type QueryGetForwardsPastDaysArgs = {
  days: Scalars['Int'];
};


export type QueryGetBitcoinPriceArgs = {
  logger?: Maybe<Scalars['Boolean']>;
  currency?: Maybe<Scalars['String']>;
};


export type QueryGetBitcoinFeesArgs = {
  logger?: Maybe<Scalars['Boolean']>;
};


export type QueryGetForwardChannelsReportArgs = {
  time?: Maybe<Scalars['String']>;
  order?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};


export type QueryGetInOutArgs = {
  time?: Maybe<Scalars['String']>;
};


export type QueryVerifyBackupsArgs = {
  backup: Scalars['String'];
};


export type QueryRecoverFundsArgs = {
  backup: Scalars['String'];
};


export type QueryGetRoutesArgs = {
  outgoing: Scalars['String'];
  incoming: Scalars['String'];
  tokens: Scalars['Int'];
  maxFee?: Maybe<Scalars['Int']>;
};


export type QuerySignMessageArgs = {
  message: Scalars['String'];
};


export type QueryVerifyMessageArgs = {
  message: Scalars['String'];
  signature: Scalars['String'];
};


export type QueryGetMessagesArgs = {
  token?: Maybe<Scalars['String']>;
  initialize?: Maybe<Scalars['Boolean']>;
  lastMessage?: Maybe<Scalars['String']>;
};


export type QueryGetAuthTokenArgs = {
  cookie?: Maybe<Scalars['String']>;
};


export type QueryGetSessionTokenArgs = {
  id?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  lnUrlAuth: AuthResponse;
  lnUrlPay: PaySuccess;
  lnUrlWithdraw: Scalars['String'];
  fetchLnUrl?: Maybe<LnUrlRequest>;
  createBaseInvoice?: Maybe<BaseInvoiceType>;
  createThunderPoints: Scalars['Boolean'];
  closeChannel?: Maybe<CloseChannelType>;
  openChannel?: Maybe<OpenChannelType>;
  updateFees?: Maybe<Scalars['Boolean']>;
  updateMultipleFees?: Maybe<Scalars['Boolean']>;
  keysend?: Maybe<PayType>;
  createInvoice?: Maybe<NewInvoiceType>;
  circularRebalance?: Maybe<Scalars['Boolean']>;
  bosPay?: Maybe<Scalars['Boolean']>;
  bosRebalance?: Maybe<BosRebalanceResultType>;
  payViaRoute?: Maybe<Scalars['Boolean']>;
  createAddress?: Maybe<Scalars['String']>;
  sendToAddress?: Maybe<SendToType>;
  addPeer?: Maybe<Scalars['Boolean']>;
  removePeer?: Maybe<Scalars['Boolean']>;
  sendMessage?: Maybe<Scalars['Int']>;
  logout?: Maybe<Scalars['Boolean']>;
  createMacaroon?: Maybe<Scalars['String']>;
};


export type MutationLnUrlAuthArgs = {
  url: Scalars['String'];
};


export type MutationLnUrlPayArgs = {
  callback: Scalars['String'];
  amount: Scalars['Int'];
  comment?: Maybe<Scalars['String']>;
};


export type MutationLnUrlWithdrawArgs = {
  callback: Scalars['String'];
  amount: Scalars['Int'];
  k1: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};


export type MutationFetchLnUrlArgs = {
  url: Scalars['String'];
};


export type MutationCreateBaseInvoiceArgs = {
  amount: Scalars['Int'];
};


export type MutationCreateThunderPointsArgs = {
  id: Scalars['String'];
  alias: Scalars['String'];
  uris: Array<Scalars['String']>;
  public_key: Scalars['String'];
};


export type MutationCloseChannelArgs = {
  id: Scalars['String'];
  forceClose?: Maybe<Scalars['Boolean']>;
  targetConfirmations?: Maybe<Scalars['Int']>;
  tokensPerVByte?: Maybe<Scalars['Int']>;
};


export type MutationOpenChannelArgs = {
  amount: Scalars['Int'];
  partnerPublicKey: Scalars['String'];
  tokensPerVByte?: Maybe<Scalars['Int']>;
  isPrivate?: Maybe<Scalars['Boolean']>;
  pushTokens?: Maybe<Scalars['Int']>;
};


export type MutationUpdateFeesArgs = {
  transaction_id?: Maybe<Scalars['String']>;
  transaction_vout?: Maybe<Scalars['Int']>;
  base_fee_tokens?: Maybe<Scalars['Float']>;
  fee_rate?: Maybe<Scalars['Int']>;
  cltv_delta?: Maybe<Scalars['Int']>;
  max_htlc_mtokens?: Maybe<Scalars['String']>;
  min_htlc_mtokens?: Maybe<Scalars['String']>;
};


export type MutationUpdateMultipleFeesArgs = {
  channels: Array<ChannelDetailInput>;
};


export type MutationKeysendArgs = {
  destination: Scalars['String'];
  tokens: Scalars['Int'];
};


export type MutationCreateInvoiceArgs = {
  amount: Scalars['Int'];
  description?: Maybe<Scalars['String']>;
  secondsUntil?: Maybe<Scalars['Int']>;
};


export type MutationCircularRebalanceArgs = {
  route: Scalars['String'];
};


export type MutationBosPayArgs = {
  max_fee: Scalars['Int'];
  max_paths: Scalars['Int'];
  message?: Maybe<Scalars['String']>;
  out?: Maybe<Array<Maybe<Scalars['String']>>>;
  request: Scalars['String'];
};


export type MutationBosRebalanceArgs = {
  avoid?: Maybe<Array<Maybe<Scalars['String']>>>;
  in_through?: Maybe<Scalars['String']>;
  is_avoiding_high_inbound?: Maybe<Scalars['Boolean']>;
  max_fee?: Maybe<Scalars['Int']>;
  max_fee_rate?: Maybe<Scalars['Int']>;
  max_rebalance?: Maybe<Scalars['Int']>;
  node?: Maybe<Scalars['String']>;
  out_through?: Maybe<Scalars['String']>;
  target?: Maybe<Scalars['Int']>;
};


export type MutationPayViaRouteArgs = {
  route: Scalars['String'];
  id: Scalars['String'];
};


export type MutationCreateAddressArgs = {
  nested?: Maybe<Scalars['Boolean']>;
};


export type MutationSendToAddressArgs = {
  address: Scalars['String'];
  tokens?: Maybe<Scalars['Int']>;
  fee?: Maybe<Scalars['Int']>;
  target?: Maybe<Scalars['Int']>;
  sendAll?: Maybe<Scalars['Boolean']>;
};


export type MutationAddPeerArgs = {
  url?: Maybe<Scalars['String']>;
  publicKey?: Maybe<Scalars['String']>;
  socket?: Maybe<Scalars['String']>;
  isTemporary?: Maybe<Scalars['Boolean']>;
};


export type MutationRemovePeerArgs = {
  publicKey: Scalars['String'];
};


export type MutationSendMessageArgs = {
  publicKey: Scalars['String'];
  message: Scalars['String'];
  messageType?: Maybe<Scalars['String']>;
  tokens?: Maybe<Scalars['Int']>;
  maxFee?: Maybe<Scalars['Int']>;
};


export type MutationCreateMacaroonArgs = {
  permissions: PermissionsType;
};

export type NodeType = {
  __typename?: 'nodeType';
  alias: Scalars['String'];
  capacity?: Maybe<Scalars['String']>;
  channel_count?: Maybe<Scalars['Int']>;
  color?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['String']>;
  public_key?: Maybe<Scalars['String']>;
};

export type Node = {
  __typename?: 'Node';
  node: NodeType;
};

export type NodeInfoType = {
  __typename?: 'nodeInfoType';
  chains: Array<Scalars['String']>;
  color: Scalars['String'];
  active_channels_count: Scalars['Int'];
  closed_channels_count: Scalars['Int'];
  alias: Scalars['String'];
  current_block_hash: Scalars['String'];
  current_block_height: Scalars['Int'];
  is_synced_to_chain: Scalars['Boolean'];
  is_synced_to_graph: Scalars['Boolean'];
  latest_block_at: Scalars['String'];
  peers_count: Scalars['Int'];
  pending_channels_count: Scalars['Int'];
  public_key: Scalars['String'];
  uris: Array<Scalars['String']>;
  version: Scalars['String'];
};

export type ServerAccountType = {
  __typename?: 'serverAccountType';
  name: Scalars['String'];
  id: Scalars['String'];
  type: Scalars['String'];
  loggedIn: Scalars['Boolean'];
};

export type BitcoinFeeType = {
  __typename?: 'bitcoinFeeType';
  fast?: Maybe<Scalars['Int']>;
  halfHour?: Maybe<Scalars['Int']>;
  hour?: Maybe<Scalars['Int']>;
};

export type PeerType = {
  __typename?: 'peerType';
  bytes_received: Scalars['Int'];
  bytes_sent: Scalars['Int'];
  is_inbound: Scalars['Boolean'];
  is_sync_peer?: Maybe<Scalars['Boolean']>;
  ping_time: Scalars['Int'];
  public_key: Scalars['String'];
  socket: Scalars['String'];
  tokens_received: Scalars['Int'];
  tokens_sent: Scalars['Int'];
  partner_node_info: Node;
};

export type GetUtxosType = {
  __typename?: 'getUtxosType';
  address: Scalars['String'];
  address_format: Scalars['String'];
  confirmation_count: Scalars['Int'];
  output_script: Scalars['String'];
  tokens: Scalars['Int'];
  transaction_id: Scalars['String'];
  transaction_vout: Scalars['Int'];
};

export type SendToType = {
  __typename?: 'sendToType';
  confirmationCount: Scalars['String'];
  id: Scalars['String'];
  isConfirmed: Scalars['Boolean'];
  isOutgoing: Scalars['Boolean'];
  tokens?: Maybe<Scalars['Int']>;
};

export type GetTransactionsType = {
  __typename?: 'getTransactionsType';
  block_id?: Maybe<Scalars['String']>;
  confirmation_count?: Maybe<Scalars['Int']>;
  confirmation_height?: Maybe<Scalars['Int']>;
  created_at: Scalars['String'];
  fee?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  output_addresses: Array<Maybe<Scalars['String']>>;
  tokens: Scalars['Int'];
};

export type GetMessagesType = {
  __typename?: 'getMessagesType';
  token?: Maybe<Scalars['String']>;
  messages: Array<Maybe<MessagesType>>;
};

export type MessagesType = {
  __typename?: 'messagesType';
  date: Scalars['String'];
  id: Scalars['String'];
  verified: Scalars['Boolean'];
  contentType?: Maybe<Scalars['String']>;
  sender?: Maybe<Scalars['String']>;
  alias?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  tokens?: Maybe<Scalars['Int']>;
};

export type InOutType = {
  __typename?: 'InOutType';
  invoices?: Maybe<Scalars['String']>;
  payments?: Maybe<Scalars['String']>;
  confirmedInvoices?: Maybe<Scalars['Int']>;
  unConfirmedInvoices?: Maybe<Scalars['Int']>;
};

export type ChannelReportType = {
  __typename?: 'channelReportType';
  local?: Maybe<Scalars['Int']>;
  remote?: Maybe<Scalars['Int']>;
  maxIn?: Maybe<Scalars['Int']>;
  maxOut?: Maybe<Scalars['Int']>;
  commit?: Maybe<Scalars['Int']>;
  totalPendingHtlc?: Maybe<Scalars['Int']>;
  outgoingPendingHtlc?: Maybe<Scalars['Int']>;
  incomingPendingHtlc?: Maybe<Scalars['Int']>;
};

export type ChannelDetailInput = {
  alias?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  transaction_id?: Maybe<Scalars['String']>;
  transaction_vout?: Maybe<Scalars['Int']>;
  base_fee_tokens?: Maybe<Scalars['Float']>;
  fee_rate?: Maybe<Scalars['Int']>;
  cltv_delta?: Maybe<Scalars['Int']>;
  max_htlc_mtokens?: Maybe<Scalars['String']>;
  min_htlc_mtokens?: Maybe<Scalars['String']>;
};

export type PolicyType = {
  __typename?: 'policyType';
  base_fee_mtokens?: Maybe<Scalars['String']>;
  cltv_delta?: Maybe<Scalars['Int']>;
  fee_rate?: Maybe<Scalars['Int']>;
  is_disabled?: Maybe<Scalars['Boolean']>;
  max_htlc_mtokens?: Maybe<Scalars['String']>;
  min_htlc_mtokens?: Maybe<Scalars['String']>;
  public_key: Scalars['String'];
  updated_at?: Maybe<Scalars['String']>;
};

export type NodePolicyType = {
  __typename?: 'nodePolicyType';
  base_fee_mtokens?: Maybe<Scalars['String']>;
  cltv_delta?: Maybe<Scalars['Int']>;
  fee_rate?: Maybe<Scalars['Int']>;
  is_disabled?: Maybe<Scalars['Boolean']>;
  max_htlc_mtokens?: Maybe<Scalars['String']>;
  min_htlc_mtokens?: Maybe<Scalars['String']>;
  public_key: Scalars['String'];
  updated_at?: Maybe<Scalars['String']>;
  node?: Maybe<Node>;
};

export type SingleChannelType = {
  __typename?: 'singleChannelType';
  capacity: Scalars['Int'];
  id: Scalars['String'];
  policies: Array<PolicyType>;
  transaction_id: Scalars['String'];
  transaction_vout: Scalars['Int'];
  updated_at?: Maybe<Scalars['String']>;
  node_policies?: Maybe<NodePolicyType>;
  partner_node_policies?: Maybe<NodePolicyType>;
};

export type Channel = {
  __typename?: 'Channel';
  channel?: Maybe<SingleChannelType>;
};

export type ChannelBalanceType = {
  __typename?: 'channelBalanceType';
  confirmedBalance: Scalars['Int'];
  pendingBalance: Scalars['Int'];
};

export type PendingPaymentType = {
  __typename?: 'pendingPaymentType';
  id: Scalars['String'];
  is_outgoing: Scalars['Boolean'];
  timeout: Scalars['Int'];
  tokens: Scalars['Int'];
};

export type PendingResumeType = {
  __typename?: 'pendingResumeType';
  incoming_tokens: Scalars['Int'];
  outgoing_tokens: Scalars['Int'];
  incoming_amount: Scalars['Int'];
  outgoing_amount: Scalars['Int'];
  total_tokens: Scalars['Int'];
  total_amount: Scalars['Int'];
};

export type ChannelType = {
  __typename?: 'channelType';
  capacity: Scalars['Int'];
  commit_transaction_fee: Scalars['Int'];
  commit_transaction_weight: Scalars['Int'];
  id: Scalars['String'];
  is_active: Scalars['Boolean'];
  is_closing: Scalars['Boolean'];
  is_opening: Scalars['Boolean'];
  is_partner_initiated: Scalars['Boolean'];
  is_private: Scalars['Boolean'];
  is_static_remote_key?: Maybe<Scalars['Boolean']>;
  local_balance: Scalars['Int'];
  local_reserve: Scalars['Int'];
  partner_public_key: Scalars['String'];
  received: Scalars['Int'];
  remote_balance: Scalars['Int'];
  remote_reserve: Scalars['Int'];
  sent: Scalars['Int'];
  time_offline?: Maybe<Scalars['Int']>;
  time_online?: Maybe<Scalars['Int']>;
  transaction_id: Scalars['String'];
  transaction_vout: Scalars['Int'];
  unsettled_balance: Scalars['Int'];
  partner_node_info: Node;
  partner_fee_info?: Maybe<Channel>;
  channel_age: Scalars['Int'];
  pending_payments: Array<Maybe<PendingPaymentType>>;
  pending_resume: PendingResumeType;
};

export type CloseChannelType = {
  __typename?: 'closeChannelType';
  transactionId?: Maybe<Scalars['String']>;
  transactionOutputIndex?: Maybe<Scalars['String']>;
};

export type ClosedChannelType = {
  __typename?: 'closedChannelType';
  capacity: Scalars['Int'];
  close_confirm_height?: Maybe<Scalars['Int']>;
  close_transaction_id?: Maybe<Scalars['String']>;
  final_local_balance: Scalars['Int'];
  final_time_locked_balance: Scalars['Int'];
  id?: Maybe<Scalars['String']>;
  is_breach_close: Scalars['Boolean'];
  is_cooperative_close: Scalars['Boolean'];
  is_funding_cancel: Scalars['Boolean'];
  is_local_force_close: Scalars['Boolean'];
  is_remote_force_close: Scalars['Boolean'];
  partner_public_key: Scalars['String'];
  transaction_id: Scalars['String'];
  transaction_vout: Scalars['Int'];
  partner_node_info: Node;
  channel_age: Scalars['Int'];
};

export type OpenChannelType = {
  __typename?: 'openChannelType';
  transactionId?: Maybe<Scalars['String']>;
  transactionOutputIndex?: Maybe<Scalars['String']>;
};

export type PendingChannelType = {
  __typename?: 'pendingChannelType';
  close_transaction_id?: Maybe<Scalars['String']>;
  is_active: Scalars['Boolean'];
  is_closing: Scalars['Boolean'];
  is_opening: Scalars['Boolean'];
  local_balance: Scalars['Int'];
  local_reserve: Scalars['Int'];
  partner_public_key: Scalars['String'];
  received: Scalars['Int'];
  remote_balance: Scalars['Int'];
  remote_reserve: Scalars['Int'];
  sent: Scalars['Int'];
  transaction_fee?: Maybe<Scalars['Int']>;
  transaction_id: Scalars['String'];
  transaction_vout: Scalars['Int'];
  partner_node_info: Node;
};

export type WalletInfoType = {
  __typename?: 'walletInfoType';
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

export type DecodeType = {
  __typename?: 'decodeType';
  chain_address?: Maybe<Scalars['String']>;
  cltv_delta?: Maybe<Scalars['Int']>;
  description: Scalars['String'];
  description_hash?: Maybe<Scalars['String']>;
  destination: Scalars['String'];
  expires_at: Scalars['String'];
  id: Scalars['String'];
  mtokens: Scalars['String'];
  payment?: Maybe<Scalars['String']>;
  routes: Array<Maybe<Array<Maybe<RouteType>>>>;
  safe_tokens: Scalars['Int'];
  tokens: Scalars['Int'];
  destination_node: Node;
  probe_route?: Maybe<ProbeRoute>;
};

export type RouteType = {
  __typename?: 'RouteType';
  base_fee_mtokens?: Maybe<Scalars['String']>;
  channel?: Maybe<Scalars['String']>;
  cltv_delta?: Maybe<Scalars['Int']>;
  fee_rate?: Maybe<Scalars['Int']>;
  public_key: Scalars['String'];
};

export type PayType = {
  __typename?: 'payType';
  fee?: Maybe<Scalars['Int']>;
  fee_mtokens?: Maybe<Scalars['String']>;
  hops?: Maybe<Array<Maybe<HopsType>>>;
  id?: Maybe<Scalars['String']>;
  is_confirmed?: Maybe<Scalars['Boolean']>;
  is_outgoing?: Maybe<Scalars['Boolean']>;
  mtokens?: Maybe<Scalars['String']>;
  secret?: Maybe<Scalars['String']>;
  safe_fee?: Maybe<Scalars['Int']>;
  safe_tokens?: Maybe<Scalars['Int']>;
  tokens?: Maybe<Scalars['Int']>;
};

export type HopsType = {
  __typename?: 'hopsType';
  channel?: Maybe<Scalars['String']>;
  channel_capacity?: Maybe<Scalars['Int']>;
  fee_mtokens?: Maybe<Scalars['String']>;
  forward_mtokens?: Maybe<Scalars['String']>;
  timeout?: Maybe<Scalars['Int']>;
};

export type NewInvoiceType = {
  __typename?: 'newInvoiceType';
  chain_address?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  description: Scalars['String'];
  id: Scalars['String'];
  request: Scalars['String'];
  secret: Scalars['String'];
  tokens?: Maybe<Scalars['Int']>;
};

export type NetworkInfoType = {
  __typename?: 'networkInfoType';
  averageChannelSize?: Maybe<Scalars['String']>;
  channelCount?: Maybe<Scalars['Int']>;
  maxChannelSize?: Maybe<Scalars['Int']>;
  medianChannelSize?: Maybe<Scalars['Int']>;
  minChannelSize?: Maybe<Scalars['Int']>;
  nodeCount?: Maybe<Scalars['Int']>;
  notRecentlyUpdatedPolicyCount?: Maybe<Scalars['Int']>;
  totalCapacity?: Maybe<Scalars['String']>;
};

export type Forward = {
  __typename?: 'Forward';
  created_at: Scalars['String'];
  fee: Scalars['Int'];
  fee_mtokens: Scalars['String'];
  incoming_channel: Scalars['String'];
  mtokens: Scalars['String'];
  outgoing_channel: Scalars['String'];
  tokens: Scalars['Int'];
  incoming_node?: Maybe<ForwardNodeType>;
  outgoing_node?: Maybe<ForwardNodeType>;
};

export type ForwardNodeType = {
  __typename?: 'ForwardNodeType';
  alias?: Maybe<Scalars['String']>;
  capacity?: Maybe<Scalars['String']>;
  channel_count?: Maybe<Scalars['Int']>;
  color?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['String']>;
  channel_id?: Maybe<Scalars['String']>;
  public_key?: Maybe<Scalars['String']>;
};

export type PaymentType = {
  __typename?: 'PaymentType';
  created_at: Scalars['String'];
  destination: Scalars['String'];
  destination_node?: Maybe<Node>;
  fee: Scalars['Int'];
  fee_mtokens: Scalars['String'];
  hops: Array<Node>;
  id: Scalars['String'];
  index?: Maybe<Scalars['Int']>;
  is_confirmed: Scalars['Boolean'];
  is_outgoing: Scalars['Boolean'];
  mtokens: Scalars['String'];
  request?: Maybe<Scalars['String']>;
  safe_fee: Scalars['Int'];
  safe_tokens?: Maybe<Scalars['Int']>;
  secret: Scalars['String'];
  tokens: Scalars['Int'];
  type: Scalars['String'];
  date: Scalars['String'];
};

export type InvoiceType = {
  __typename?: 'InvoiceType';
  chain_address?: Maybe<Scalars['String']>;
  confirmed_at?: Maybe<Scalars['String']>;
  created_at: Scalars['String'];
  description: Scalars['String'];
  description_hash?: Maybe<Scalars['String']>;
  expires_at: Scalars['String'];
  id: Scalars['String'];
  is_canceled?: Maybe<Scalars['Boolean']>;
  is_confirmed: Scalars['Boolean'];
  is_held?: Maybe<Scalars['Boolean']>;
  is_private: Scalars['Boolean'];
  is_push?: Maybe<Scalars['Boolean']>;
  received: Scalars['Int'];
  received_mtokens: Scalars['String'];
  request?: Maybe<Scalars['String']>;
  secret: Scalars['String'];
  tokens: Scalars['Int'];
  type: Scalars['String'];
  date: Scalars['String'];
};

export type Transaction = InvoiceType | PaymentType;

export type GetResumeType = {
  __typename?: 'getResumeType';
  token?: Maybe<Scalars['String']>;
  resume?: Maybe<Array<Maybe<Transaction>>>;
};

export type ChannelHealth = {
  __typename?: 'channelHealth';
  id?: Maybe<Scalars['String']>;
  score?: Maybe<Scalars['Int']>;
  volumeNormalized?: Maybe<Scalars['String']>;
  averageVolumeNormalized?: Maybe<Scalars['String']>;
  partner?: Maybe<Node>;
};

export type ChannelsHealth = {
  __typename?: 'channelsHealth';
  score?: Maybe<Scalars['Int']>;
  channels?: Maybe<Array<Maybe<ChannelHealth>>>;
};

export type ChannelTimeHealth = {
  __typename?: 'channelTimeHealth';
  id?: Maybe<Scalars['String']>;
  score?: Maybe<Scalars['Int']>;
  significant?: Maybe<Scalars['Boolean']>;
  monitoredTime?: Maybe<Scalars['Int']>;
  monitoredUptime?: Maybe<Scalars['Int']>;
  monitoredDowntime?: Maybe<Scalars['Int']>;
  partner?: Maybe<Node>;
};

export type ChannelsTimeHealth = {
  __typename?: 'channelsTimeHealth';
  score?: Maybe<Scalars['Int']>;
  channels?: Maybe<Array<Maybe<ChannelTimeHealth>>>;
};

export type FeeHealth = {
  __typename?: 'feeHealth';
  score?: Maybe<Scalars['Int']>;
  rate?: Maybe<Scalars['Int']>;
  base?: Maybe<Scalars['String']>;
  rateScore?: Maybe<Scalars['Int']>;
  baseScore?: Maybe<Scalars['Int']>;
  rateOver?: Maybe<Scalars['Boolean']>;
  baseOver?: Maybe<Scalars['Boolean']>;
};

export type ChannelFeeHealth = {
  __typename?: 'channelFeeHealth';
  id?: Maybe<Scalars['String']>;
  partnerSide?: Maybe<FeeHealth>;
  mySide?: Maybe<FeeHealth>;
  partner?: Maybe<Node>;
};

export type ChannelsFeeHealth = {
  __typename?: 'channelsFeeHealth';
  score?: Maybe<Scalars['Int']>;
  channels?: Maybe<Array<Maybe<ChannelFeeHealth>>>;
};

export type RouteMessageType = {
  __typename?: 'RouteMessageType';
  type: Scalars['String'];
  value: Scalars['String'];
};

export type RouteHopType = {
  __typename?: 'RouteHopType';
  channel: Scalars['String'];
  channel_capacity: Scalars['Int'];
  fee: Scalars['Int'];
  fee_mtokens: Scalars['String'];
  forward: Scalars['Int'];
  forward_mtokens: Scalars['String'];
  public_key: Scalars['String'];
  timeout: Scalars['Int'];
};

export type GetRouteType = {
  __typename?: 'GetRouteType';
  confidence?: Maybe<Scalars['Int']>;
  fee: Scalars['Int'];
  fee_mtokens: Scalars['String'];
  hops: Array<RouteHopType>;
  messages?: Maybe<Array<Maybe<RouteMessageType>>>;
  mtokens: Scalars['String'];
  safe_fee: Scalars['Int'];
  safe_tokens: Scalars['Int'];
  timeout: Scalars['Int'];
  tokens: Scalars['Int'];
};

export type ProbedRouteHop = {
  __typename?: 'probedRouteHop';
  channel: Scalars['String'];
  channel_capacity: Scalars['Int'];
  fee: Scalars['Int'];
  fee_mtokens: Scalars['String'];
  forward: Scalars['Int'];
  forward_mtokens: Scalars['String'];
  public_key: Scalars['String'];
  timeout: Scalars['Int'];
  node: Node;
};

export type ProbedRoute = {
  __typename?: 'probedRoute';
  confidence: Scalars['Int'];
  fee: Scalars['Int'];
  fee_mtokens: Scalars['String'];
  hops: Array<ProbedRouteHop>;
  mtokens: Scalars['String'];
  safe_fee: Scalars['Int'];
  safe_tokens: Scalars['Int'];
  timeout: Scalars['Int'];
  tokens: Scalars['Int'];
};

export type ProbeRoute = {
  __typename?: 'ProbeRoute';
  route?: Maybe<ProbedRoute>;
};

export type BosIncreaseType = {
  __typename?: 'bosIncreaseType';
  increased_inbound_on?: Maybe<Scalars['String']>;
  liquidity_inbound?: Maybe<Scalars['String']>;
  liquidity_inbound_opening?: Maybe<Scalars['String']>;
  liquidity_inbound_pending?: Maybe<Scalars['String']>;
  liquidity_outbound?: Maybe<Scalars['String']>;
  liquidity_outbound_opening?: Maybe<Scalars['String']>;
  liquidity_outbound_pending?: Maybe<Scalars['String']>;
};

export type BosDecreaseType = {
  __typename?: 'bosDecreaseType';
  decreased_inbound_on?: Maybe<Scalars['String']>;
  liquidity_inbound?: Maybe<Scalars['String']>;
  liquidity_inbound_opening?: Maybe<Scalars['String']>;
  liquidity_inbound_pending?: Maybe<Scalars['String']>;
  liquidity_outbound?: Maybe<Scalars['String']>;
  liquidity_outbound_opening?: Maybe<Scalars['String']>;
  liquidity_outbound_pending?: Maybe<Scalars['String']>;
};

export type BosResultType = {
  __typename?: 'bosResultType';
  rebalanced?: Maybe<Scalars['String']>;
  rebalance_fees_spent?: Maybe<Scalars['String']>;
};

export type BosRebalanceResultType = {
  __typename?: 'bosRebalanceResultType';
  increase?: Maybe<BosIncreaseType>;
  decrease?: Maybe<BosDecreaseType>;
  result?: Maybe<BosResultType>;
};

export type BaseNodesType = {
  __typename?: 'baseNodesType';
  _id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  public_key: Scalars['String'];
  socket: Scalars['String'];
};

export type BasePointsType = {
  __typename?: 'basePointsType';
  alias: Scalars['String'];
  amount: Scalars['Int'];
};

export type BaseInvoiceType = {
  __typename?: 'baseInvoiceType';
  id: Scalars['String'];
  request: Scalars['String'];
};

export type WithdrawRequest = {
  __typename?: 'WithdrawRequest';
  callback?: Maybe<Scalars['String']>;
  k1?: Maybe<Scalars['String']>;
  maxWithdrawable?: Maybe<Scalars['String']>;
  defaultDescription?: Maybe<Scalars['String']>;
  minWithdrawable?: Maybe<Scalars['String']>;
  tag?: Maybe<Scalars['String']>;
};

export type PayRequest = {
  __typename?: 'PayRequest';
  callback?: Maybe<Scalars['String']>;
  maxSendable?: Maybe<Scalars['String']>;
  minSendable?: Maybe<Scalars['String']>;
  metadata?: Maybe<Scalars['String']>;
  commentAllowed?: Maybe<Scalars['Int']>;
  tag?: Maybe<Scalars['String']>;
};

export type LnUrlRequest = WithdrawRequest | PayRequest;

export type AuthResponse = {
  __typename?: 'AuthResponse';
  status: Scalars['String'];
  message: Scalars['String'];
};

export type PaySuccess = {
  __typename?: 'PaySuccess';
  tag?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  ciphertext?: Maybe<Scalars['String']>;
  iv?: Maybe<Scalars['String']>;
};
