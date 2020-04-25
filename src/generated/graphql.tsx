import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
};

export type Query = {
  __typename?: 'Query';
  getChannelBalance?: Maybe<ChannelBalanceType>;
  getChannels?: Maybe<Array<Maybe<ChannelType>>>;
  getClosedChannels?: Maybe<Array<Maybe<ClosedChannelType>>>;
  getPendingChannels?: Maybe<Array<Maybe<PendingChannelType>>>;
  getChannelFees?: Maybe<Array<Maybe<ChannelFeeType>>>;
  getChannelReport?: Maybe<ChannelReportType>;
  getNetworkInfo?: Maybe<NetworkInfoType>;
  getNodeInfo?: Maybe<NodeInfoType>;
  adminCheck?: Maybe<Scalars['Boolean']>;
  getNode?: Maybe<PartnerNodeType>;
  decodeRequest?: Maybe<DecodeType>;
  getResume?: Maybe<GetResumeType>;
  getForwards?: Maybe<GetForwardType>;
  getBitcoinPrice?: Maybe<Scalars['String']>;
  getBitcoinFees?: Maybe<BitcoinFeeType>;
  getForwardReport?: Maybe<Scalars['String']>;
  getForwardChannelsReport?: Maybe<Scalars['String']>;
  getInOut?: Maybe<InOutType>;
  getBackups?: Maybe<Scalars['String']>;
  verifyBackups?: Maybe<Scalars['Boolean']>;
  recoverFunds?: Maybe<Scalars['Boolean']>;
  getRoutes?: Maybe<Scalars['String']>;
  getPeers?: Maybe<Array<Maybe<PeerType>>>;
  signMessage?: Maybe<Scalars['String']>;
  verifyMessage?: Maybe<Scalars['String']>;
  getChainBalance?: Maybe<Scalars['Int']>;
  getPendingChainBalance?: Maybe<Scalars['Int']>;
  getChainTransactions?: Maybe<Array<Maybe<GetTransactionsType>>>;
  getUtxos?: Maybe<Array<Maybe<GetUtxosType>>>;
  getOffers?: Maybe<Array<Maybe<HodlOfferType>>>;
  getCountries?: Maybe<Array<Maybe<HodlCountryType>>>;
  getCurrencies?: Maybe<Array<Maybe<HodlCurrencyType>>>;
  getMessages?: Maybe<GetMessagesType>;
};

export type QueryGetChannelBalanceArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
};

export type QueryGetChannelsArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  active?: Maybe<Scalars['Boolean']>;
};

export type QueryGetClosedChannelsArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  type?: Maybe<Scalars['String']>;
};

export type QueryGetPendingChannelsArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
};

export type QueryGetChannelFeesArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
};

export type QueryGetChannelReportArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
};

export type QueryGetNetworkInfoArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
};

export type QueryGetNodeInfoArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
};

export type QueryAdminCheckArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
};

export type QueryGetNodeArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  publicKey: Scalars['String'];
  withoutChannels?: Maybe<Scalars['Boolean']>;
};

export type QueryDecodeRequestArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  request: Scalars['String'];
};

export type QueryGetResumeArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  token?: Maybe<Scalars['String']>;
};

export type QueryGetForwardsArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  time?: Maybe<Scalars['String']>;
};

export type QueryGetBitcoinPriceArgs = {
  logger?: Maybe<Scalars['Boolean']>;
  currency?: Maybe<Scalars['String']>;
};

export type QueryGetBitcoinFeesArgs = {
  logger?: Maybe<Scalars['Boolean']>;
};

export type QueryGetForwardReportArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  time?: Maybe<Scalars['String']>;
};

export type QueryGetForwardChannelsReportArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  time?: Maybe<Scalars['String']>;
  order?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type QueryGetInOutArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  time?: Maybe<Scalars['String']>;
};

export type QueryGetBackupsArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
};

export type QueryVerifyBackupsArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  backup: Scalars['String'];
};

export type QueryRecoverFundsArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  backup: Scalars['String'];
};

export type QueryGetRoutesArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  outgoing: Scalars['String'];
  incoming: Scalars['String'];
  tokens: Scalars['Int'];
  maxFee?: Maybe<Scalars['Int']>;
};

export type QueryGetPeersArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
};

export type QuerySignMessageArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  message: Scalars['String'];
};

export type QueryVerifyMessageArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  message: Scalars['String'];
  signature: Scalars['String'];
};

export type QueryGetChainBalanceArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
};

export type QueryGetPendingChainBalanceArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
};

export type QueryGetChainTransactionsArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
};

export type QueryGetUtxosArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
};

export type QueryGetOffersArgs = {
  filter?: Maybe<Scalars['String']>;
};

export type QueryGetMessagesArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  token?: Maybe<Scalars['String']>;
  initialize?: Maybe<Scalars['Boolean']>;
  lastMessage?: Maybe<Scalars['String']>;
};

export type ChannelBalanceType = {
  __typename?: 'channelBalanceType';
  confirmedBalance?: Maybe<Scalars['Int']>;
  pendingBalance?: Maybe<Scalars['Int']>;
};

export type AuthType = {
  host?: Maybe<Scalars['String']>;
  macaroon?: Maybe<Scalars['String']>;
  cert?: Maybe<Scalars['String']>;
};

export type ChannelType = {
  __typename?: 'channelType';
  capacity?: Maybe<Scalars['Int']>;
  commit_transaction_fee?: Maybe<Scalars['Int']>;
  commit_transaction_weight?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['String']>;
  is_active?: Maybe<Scalars['Boolean']>;
  is_closing?: Maybe<Scalars['Boolean']>;
  is_opening?: Maybe<Scalars['Boolean']>;
  is_partner_initiated?: Maybe<Scalars['Boolean']>;
  is_private?: Maybe<Scalars['Boolean']>;
  is_static_remote_key?: Maybe<Scalars['Boolean']>;
  local_balance?: Maybe<Scalars['Int']>;
  local_reserve?: Maybe<Scalars['Int']>;
  partner_public_key?: Maybe<Scalars['String']>;
  received?: Maybe<Scalars['Int']>;
  remote_balance?: Maybe<Scalars['Int']>;
  remote_reserve?: Maybe<Scalars['Int']>;
  sent?: Maybe<Scalars['Int']>;
  time_offline?: Maybe<Scalars['Int']>;
  time_online?: Maybe<Scalars['Int']>;
  transaction_id?: Maybe<Scalars['String']>;
  transaction_vout?: Maybe<Scalars['Int']>;
  unsettled_balance?: Maybe<Scalars['Int']>;
  partner_node_info?: Maybe<PartnerNodeType>;
};

export type PartnerNodeType = {
  __typename?: 'partnerNodeType';
  alias?: Maybe<Scalars['String']>;
  capacity?: Maybe<Scalars['String']>;
  channel_count?: Maybe<Scalars['Int']>;
  color?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['String']>;
};

export type ClosedChannelType = {
  __typename?: 'closedChannelType';
  capacity?: Maybe<Scalars['Int']>;
  close_confirm_height?: Maybe<Scalars['Int']>;
  close_transaction_id?: Maybe<Scalars['String']>;
  final_local_balance?: Maybe<Scalars['Int']>;
  final_time_locked_balance?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['String']>;
  is_breach_close?: Maybe<Scalars['Boolean']>;
  is_cooperative_close?: Maybe<Scalars['Boolean']>;
  is_funding_cancel?: Maybe<Scalars['Boolean']>;
  is_local_force_close?: Maybe<Scalars['Boolean']>;
  is_remote_force_close?: Maybe<Scalars['Boolean']>;
  partner_public_key?: Maybe<Scalars['String']>;
  transaction_id?: Maybe<Scalars['String']>;
  transaction_vout?: Maybe<Scalars['Int']>;
  partner_node_info?: Maybe<PartnerNodeType>;
};

export type PendingChannelType = {
  __typename?: 'pendingChannelType';
  close_transaction_id?: Maybe<Scalars['String']>;
  is_active?: Maybe<Scalars['Boolean']>;
  is_closing?: Maybe<Scalars['Boolean']>;
  is_opening?: Maybe<Scalars['Boolean']>;
  local_balance?: Maybe<Scalars['Int']>;
  local_reserve?: Maybe<Scalars['Int']>;
  partner_public_key?: Maybe<Scalars['String']>;
  received?: Maybe<Scalars['Int']>;
  remote_balance?: Maybe<Scalars['Int']>;
  remote_reserve?: Maybe<Scalars['Int']>;
  sent?: Maybe<Scalars['Int']>;
  transaction_fee?: Maybe<Scalars['Int']>;
  transaction_id?: Maybe<Scalars['String']>;
  transaction_vout?: Maybe<Scalars['Int']>;
  partner_node_info?: Maybe<PartnerNodeType>;
};

export type ChannelFeeType = {
  __typename?: 'channelFeeType';
  alias?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  baseFee?: Maybe<Scalars['Int']>;
  feeRate?: Maybe<Scalars['Int']>;
  transactionId?: Maybe<Scalars['String']>;
  transactionVout?: Maybe<Scalars['Int']>;
  public_key?: Maybe<Scalars['String']>;
};

export type ChannelReportType = {
  __typename?: 'channelReportType';
  local?: Maybe<Scalars['Int']>;
  remote?: Maybe<Scalars['Int']>;
  maxIn?: Maybe<Scalars['Int']>;
  maxOut?: Maybe<Scalars['Int']>;
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

export type NodeInfoType = {
  __typename?: 'nodeInfoType';
  chains?: Maybe<Array<Maybe<Scalars['String']>>>;
  color?: Maybe<Scalars['String']>;
  active_channels_count?: Maybe<Scalars['Int']>;
  closed_channels_count?: Maybe<Scalars['Int']>;
  alias?: Maybe<Scalars['String']>;
  current_block_hash?: Maybe<Scalars['String']>;
  current_block_height?: Maybe<Scalars['Boolean']>;
  is_synced_to_chain?: Maybe<Scalars['Boolean']>;
  is_synced_to_graph?: Maybe<Scalars['Boolean']>;
  latest_block_at?: Maybe<Scalars['String']>;
  peers_count?: Maybe<Scalars['Int']>;
  pending_channels_count?: Maybe<Scalars['Int']>;
  public_key?: Maybe<Scalars['String']>;
  uris?: Maybe<Array<Maybe<Scalars['String']>>>;
  version?: Maybe<Scalars['String']>;
};

export type DecodeType = {
  __typename?: 'decodeType';
  chain_address?: Maybe<Scalars['String']>;
  cltv_delta?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  description_hash?: Maybe<Scalars['String']>;
  destination?: Maybe<Scalars['String']>;
  expires_at?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  mtokens?: Maybe<Scalars['String']>;
  routes?: Maybe<Array<Maybe<DecodeRoutesType>>>;
  safe_tokens?: Maybe<Scalars['Int']>;
  tokens?: Maybe<Scalars['Int']>;
};

export type DecodeRoutesType = {
  __typename?: 'DecodeRoutesType';
  base_fee_mtokens?: Maybe<Scalars['String']>;
  channel?: Maybe<Scalars['String']>;
  cltv_delta?: Maybe<Scalars['Int']>;
  fee_rate?: Maybe<Scalars['Int']>;
  public_key?: Maybe<Scalars['String']>;
};

export type GetResumeType = {
  __typename?: 'getResumeType';
  token?: Maybe<Scalars['String']>;
  resume?: Maybe<Scalars['String']>;
};

export type GetForwardType = {
  __typename?: 'getForwardType';
  token?: Maybe<Scalars['String']>;
  forwards?: Maybe<Array<Maybe<ForwardType>>>;
};

export type ForwardType = {
  __typename?: 'forwardType';
  created_at?: Maybe<Scalars['String']>;
  fee?: Maybe<Scalars['Int']>;
  fee_mtokens?: Maybe<Scalars['String']>;
  incoming_channel?: Maybe<Scalars['String']>;
  incoming_alias?: Maybe<Scalars['String']>;
  incoming_color?: Maybe<Scalars['String']>;
  mtokens?: Maybe<Scalars['String']>;
  outgoing_channel?: Maybe<Scalars['String']>;
  outgoing_alias?: Maybe<Scalars['String']>;
  outgoing_color?: Maybe<Scalars['String']>;
  tokens?: Maybe<Scalars['Int']>;
};

export type BitcoinFeeType = {
  __typename?: 'bitcoinFeeType';
  fast?: Maybe<Scalars['Int']>;
  halfHour?: Maybe<Scalars['Int']>;
  hour?: Maybe<Scalars['Int']>;
};

export type InOutType = {
  __typename?: 'InOutType';
  invoices?: Maybe<Scalars['String']>;
  payments?: Maybe<Scalars['String']>;
  confirmedInvoices?: Maybe<Scalars['Int']>;
  unConfirmedInvoices?: Maybe<Scalars['Int']>;
};

export type PeerType = {
  __typename?: 'peerType';
  bytes_received?: Maybe<Scalars['Int']>;
  bytes_sent?: Maybe<Scalars['Int']>;
  is_inbound?: Maybe<Scalars['Boolean']>;
  is_sync_peer?: Maybe<Scalars['Boolean']>;
  ping_time?: Maybe<Scalars['Int']>;
  public_key?: Maybe<Scalars['String']>;
  socket?: Maybe<Scalars['String']>;
  tokens_received?: Maybe<Scalars['Int']>;
  tokens_sent?: Maybe<Scalars['Int']>;
  partner_node_info?: Maybe<PartnerNodeType>;
};

export type GetTransactionsType = {
  __typename?: 'getTransactionsType';
  block_id?: Maybe<Scalars['String']>;
  confirmation_count?: Maybe<Scalars['Int']>;
  confirmation_height?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['String']>;
  fee?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['String']>;
  output_addresses?: Maybe<Array<Maybe<Scalars['String']>>>;
  tokens?: Maybe<Scalars['Int']>;
};

export type GetUtxosType = {
  __typename?: 'getUtxosType';
  address?: Maybe<Scalars['String']>;
  address_format?: Maybe<Scalars['String']>;
  confirmation_count?: Maybe<Scalars['Int']>;
  output_script?: Maybe<Scalars['String']>;
  tokens?: Maybe<Scalars['Int']>;
  transaction_id?: Maybe<Scalars['String']>;
  transaction_vout?: Maybe<Scalars['Int']>;
};

export type HodlOfferType = {
  __typename?: 'hodlOfferType';
  id?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
  asset_code?: Maybe<Scalars['String']>;
  searchable?: Maybe<Scalars['Boolean']>;
  country?: Maybe<Scalars['String']>;
  country_code?: Maybe<Scalars['String']>;
  working_now?: Maybe<Scalars['Boolean']>;
  side?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  currency_code?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['String']>;
  min_amount?: Maybe<Scalars['String']>;
  max_amount?: Maybe<Scalars['String']>;
  first_trade_limit?: Maybe<Scalars['String']>;
  fee?: Maybe<HodlOfferFeeType>;
  balance?: Maybe<Scalars['String']>;
  payment_window_minutes?: Maybe<Scalars['Int']>;
  confirmations?: Maybe<Scalars['Int']>;
  payment_method_instructions?: Maybe<Array<Maybe<HodlOfferPaymentType>>>;
  trader?: Maybe<HodlOfferTraderType>;
};

export type HodlOfferFeeType = {
  __typename?: 'hodlOfferFeeType';
  author_fee_rate?: Maybe<Scalars['String']>;
};

export type HodlOfferPaymentType = {
  __typename?: 'hodlOfferPaymentType';
  id?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
  payment_method_id?: Maybe<Scalars['String']>;
  payment_method_type?: Maybe<Scalars['String']>;
  payment_method_name?: Maybe<Scalars['String']>;
};

export type HodlOfferTraderType = {
  __typename?: 'hodlOfferTraderType';
  login?: Maybe<Scalars['String']>;
  online_status?: Maybe<Scalars['String']>;
  rating?: Maybe<Scalars['String']>;
  trades_count?: Maybe<Scalars['Int']>;
  url?: Maybe<Scalars['String']>;
  verified?: Maybe<Scalars['Boolean']>;
  verified_by?: Maybe<Scalars['String']>;
  strong_hodler?: Maybe<Scalars['Boolean']>;
  country?: Maybe<Scalars['String']>;
  country_code?: Maybe<Scalars['String']>;
  average_payment_time_minutes?: Maybe<Scalars['Int']>;
  average_release_time_minutes?: Maybe<Scalars['Int']>;
  days_since_last_trade?: Maybe<Scalars['Int']>;
};

export type HodlCountryType = {
  __typename?: 'hodlCountryType';
  code?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  native_name?: Maybe<Scalars['String']>;
  currency_code?: Maybe<Scalars['String']>;
  currency_name?: Maybe<Scalars['String']>;
};

export type HodlCurrencyType = {
  __typename?: 'hodlCurrencyType';
  code?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type GetMessagesType = {
  __typename?: 'getMessagesType';
  token?: Maybe<Scalars['String']>;
  messages?: Maybe<Array<Maybe<MessagesType>>>;
};

export type MessagesType = {
  __typename?: 'messagesType';
  date?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  contentType?: Maybe<Scalars['String']>;
  sender?: Maybe<Scalars['String']>;
  alias?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  closeChannel?: Maybe<CloseChannelType>;
  openChannel?: Maybe<OpenChannelType>;
  updateFees?: Maybe<Scalars['Boolean']>;
  parsePayment?: Maybe<ParsePaymentType>;
  pay?: Maybe<PayType>;
  createInvoice?: Maybe<InvoiceType>;
  payViaRoute?: Maybe<Scalars['Boolean']>;
  createAddress?: Maybe<Scalars['String']>;
  sendToAddress?: Maybe<SendToType>;
  addPeer?: Maybe<Scalars['Boolean']>;
  removePeer?: Maybe<Scalars['Boolean']>;
  sendMessage?: Maybe<Scalars['Boolean']>;
};

export type MutationCloseChannelArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  forceClose?: Maybe<Scalars['Boolean']>;
  targetConfirmations?: Maybe<Scalars['Int']>;
  tokensPerVByte?: Maybe<Scalars['Int']>;
};

export type MutationOpenChannelArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  amount: Scalars['Int'];
  partnerPublicKey: Scalars['String'];
  tokensPerVByte?: Maybe<Scalars['Int']>;
  isPrivate?: Maybe<Scalars['Boolean']>;
};

export type MutationUpdateFeesArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  transactionId?: Maybe<Scalars['String']>;
  transactionVout?: Maybe<Scalars['Int']>;
  baseFee?: Maybe<Scalars['Int']>;
  feeRate?: Maybe<Scalars['Int']>;
};

export type MutationParsePaymentArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  request: Scalars['String'];
};

export type MutationPayArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  request: Scalars['String'];
  tokens?: Maybe<Scalars['Int']>;
};

export type MutationCreateInvoiceArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  amount: Scalars['Int'];
};

export type MutationPayViaRouteArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  route: Scalars['String'];
};

export type MutationCreateAddressArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  nested?: Maybe<Scalars['Boolean']>;
};

export type MutationSendToAddressArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  address: Scalars['String'];
  tokens?: Maybe<Scalars['Int']>;
  fee?: Maybe<Scalars['Int']>;
  target?: Maybe<Scalars['Int']>;
  sendAll?: Maybe<Scalars['Boolean']>;
};

export type MutationAddPeerArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  publicKey: Scalars['String'];
  socket: Scalars['String'];
  isTemporary?: Maybe<Scalars['Boolean']>;
};

export type MutationRemovePeerArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  publicKey: Scalars['String'];
};

export type MutationSendMessageArgs = {
  auth: AuthType;
  logger?: Maybe<Scalars['Boolean']>;
  publicKey: Scalars['String'];
  message: Scalars['String'];
  messageType?: Maybe<Scalars['String']>;
  tokens?: Maybe<Scalars['Int']>;
};

export type CloseChannelType = {
  __typename?: 'closeChannelType';
  transactionId?: Maybe<Scalars['String']>;
  transactionOutputIndex?: Maybe<Scalars['String']>;
};

export type OpenChannelType = {
  __typename?: 'openChannelType';
  transactionId?: Maybe<Scalars['String']>;
  transactionOutputIndex?: Maybe<Scalars['String']>;
};

export type ParsePaymentType = {
  __typename?: 'parsePaymentType';
  chainAddresses?: Maybe<Array<Maybe<Scalars['String']>>>;
  cltvDelta?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  descriptionHash?: Maybe<Scalars['String']>;
  destination?: Maybe<Scalars['String']>;
  expiresAt?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['String']>;
  isExpired?: Maybe<Scalars['Boolean']>;
  mTokens?: Maybe<Scalars['String']>;
  network?: Maybe<Scalars['String']>;
  routes?: Maybe<Array<Maybe<PaymentRouteType>>>;
  tokens?: Maybe<Scalars['Int']>;
};

export type PaymentRouteType = {
  __typename?: 'PaymentRouteType';
  mTokenFee?: Maybe<Scalars['String']>;
  channel?: Maybe<Scalars['String']>;
  cltvDelta?: Maybe<Scalars['Int']>;
  feeRate?: Maybe<Scalars['Int']>;
  publicKey?: Maybe<Scalars['String']>;
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

export type InvoiceType = {
  __typename?: 'invoiceType';
  chainAddress?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  request?: Maybe<Scalars['String']>;
  secret?: Maybe<Scalars['String']>;
  tokens?: Maybe<Scalars['Int']>;
};

export type SendToType = {
  __typename?: 'sendToType';
  confirmationCount?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  isConfirmed?: Maybe<Scalars['Boolean']>;
  isOutgoing?: Maybe<Scalars['Boolean']>;
  tokens?: Maybe<Scalars['Int']>;
};

export type GetCountriesQueryVariables = {};

export type GetCountriesQuery = { __typename?: 'Query' } & {
  getCountries?: Maybe<
    Array<
      Maybe<
        { __typename?: 'hodlCountryType' } & Pick<
          HodlCountryType,
          'code' | 'name' | 'native_name' | 'currency_code' | 'currency_name'
        >
      >
    >
  >;
};

export type GetCurrenciesQueryVariables = {};

export type GetCurrenciesQuery = { __typename?: 'Query' } & {
  getCurrencies?: Maybe<
    Array<
      Maybe<
        { __typename?: 'hodlCurrencyType' } & Pick<
          HodlCurrencyType,
          'code' | 'name' | 'type'
        >
      >
    >
  >;
};

export type GetOffersQueryVariables = {
  filter?: Maybe<Scalars['String']>;
};

export type GetOffersQuery = { __typename?: 'Query' } & {
  getOffers?: Maybe<
    Array<
      Maybe<
        { __typename?: 'hodlOfferType' } & Pick<
          HodlOfferType,
          | 'id'
          | 'asset_code'
          | 'country'
          | 'country_code'
          | 'working_now'
          | 'side'
          | 'title'
          | 'description'
          | 'currency_code'
          | 'price'
          | 'min_amount'
          | 'max_amount'
          | 'first_trade_limit'
          | 'balance'
          | 'payment_window_minutes'
          | 'confirmations'
        > & {
            fee?: Maybe<
              { __typename?: 'hodlOfferFeeType' } & Pick<
                HodlOfferFeeType,
                'author_fee_rate'
              >
            >;
            payment_method_instructions?: Maybe<
              Array<
                Maybe<
                  { __typename?: 'hodlOfferPaymentType' } & Pick<
                    HodlOfferPaymentType,
                    | 'id'
                    | 'version'
                    | 'payment_method_id'
                    | 'payment_method_type'
                    | 'payment_method_name'
                  >
                >
              >
            >;
            trader?: Maybe<
              { __typename?: 'hodlOfferTraderType' } & Pick<
                HodlOfferTraderType,
                | 'login'
                | 'online_status'
                | 'rating'
                | 'trades_count'
                | 'url'
                | 'verified'
                | 'verified_by'
                | 'strong_hodler'
                | 'country'
                | 'country_code'
                | 'average_payment_time_minutes'
                | 'average_release_time_minutes'
                | 'days_since_last_trade'
              >
            >;
          }
      >
    >
  >;
};

export type CloseChannelMutationVariables = {
  id: Scalars['String'];
  auth: AuthType;
  forceClose?: Maybe<Scalars['Boolean']>;
  target?: Maybe<Scalars['Int']>;
  tokens?: Maybe<Scalars['Int']>;
};

export type CloseChannelMutation = { __typename?: 'Mutation' } & {
  closeChannel?: Maybe<
    { __typename?: 'closeChannelType' } & Pick<
      CloseChannelType,
      'transactionId' | 'transactionOutputIndex'
    >
  >;
};

export type OpenChannelMutationVariables = {
  amount: Scalars['Int'];
  partnerPublicKey: Scalars['String'];
  auth: AuthType;
  tokensPerVByte?: Maybe<Scalars['Int']>;
  isPrivate?: Maybe<Scalars['Boolean']>;
};

export type OpenChannelMutation = { __typename?: 'Mutation' } & {
  openChannel?: Maybe<
    { __typename?: 'openChannelType' } & Pick<
      OpenChannelType,
      'transactionId' | 'transactionOutputIndex'
    >
  >;
};

export type PayInvoiceMutationVariables = {
  request: Scalars['String'];
  auth: AuthType;
  tokens?: Maybe<Scalars['Int']>;
};

export type PayInvoiceMutation = { __typename?: 'Mutation' } & {
  pay?: Maybe<{ __typename?: 'payType' } & Pick<PayType, 'is_confirmed'>>;
};

export type CreateInvoiceMutationVariables = {
  amount: Scalars['Int'];
  auth: AuthType;
};

export type CreateInvoiceMutation = { __typename?: 'Mutation' } & {
  createInvoice?: Maybe<
    { __typename?: 'invoiceType' } & Pick<InvoiceType, 'request'>
  >;
};

export type CreateAddressMutationVariables = {
  nested?: Maybe<Scalars['Boolean']>;
  auth: AuthType;
};

export type CreateAddressMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'createAddress'
>;

export type PayAddressMutationVariables = {
  auth: AuthType;
  address: Scalars['String'];
  tokens?: Maybe<Scalars['Int']>;
  fee?: Maybe<Scalars['Int']>;
  target?: Maybe<Scalars['Int']>;
  sendAll?: Maybe<Scalars['Boolean']>;
};

export type PayAddressMutation = { __typename?: 'Mutation' } & {
  sendToAddress?: Maybe<
    { __typename?: 'sendToType' } & Pick<
      SendToType,
      'confirmationCount' | 'id' | 'isConfirmed' | 'isOutgoing' | 'tokens'
    >
  >;
};

export type UpdateFeesMutationVariables = {
  auth: AuthType;
  transactionId?: Maybe<Scalars['String']>;
  transactionVout?: Maybe<Scalars['Int']>;
  baseFee?: Maybe<Scalars['Int']>;
  feeRate?: Maybe<Scalars['Int']>;
};

export type UpdateFeesMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'updateFees'
>;

export type PayViaRouteMutationVariables = {
  auth: AuthType;
  route: Scalars['String'];
};

export type PayViaRouteMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'payViaRoute'
>;

export type RemovePeerMutationVariables = {
  auth: AuthType;
  publicKey: Scalars['String'];
};

export type RemovePeerMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'removePeer'
>;

export type AddPeerMutationVariables = {
  auth: AuthType;
  publicKey: Scalars['String'];
  socket: Scalars['String'];
  isTemporary?: Maybe<Scalars['Boolean']>;
};

export type AddPeerMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'addPeer'
>;

export type SendMessageMutationVariables = {
  auth: AuthType;
  publicKey: Scalars['String'];
  message: Scalars['String'];
  tokens?: Maybe<Scalars['Int']>;
};

export type SendMessageMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'sendMessage'
>;

export type GetNetworkInfoQueryVariables = {
  auth: AuthType;
};

export type GetNetworkInfoQuery = { __typename?: 'Query' } & {
  getNetworkInfo?: Maybe<
    { __typename?: 'networkInfoType' } & Pick<
      NetworkInfoType,
      | 'averageChannelSize'
      | 'channelCount'
      | 'maxChannelSize'
      | 'medianChannelSize'
      | 'minChannelSize'
      | 'nodeCount'
      | 'notRecentlyUpdatedPolicyCount'
      | 'totalCapacity'
    >
  >;
};

export type GetCanConnectQueryVariables = {
  auth: AuthType;
};

export type GetCanConnectQuery = { __typename?: 'Query' } & {
  getNodeInfo?: Maybe<
    { __typename?: 'nodeInfoType' } & Pick<
      NodeInfoType,
      | 'chains'
      | 'color'
      | 'active_channels_count'
      | 'closed_channels_count'
      | 'alias'
      | 'is_synced_to_chain'
      | 'peers_count'
      | 'pending_channels_count'
      | 'version'
    >
  >;
};

export type GetCanAdminQueryVariables = {
  auth: AuthType;
};

export type GetCanAdminQuery = { __typename?: 'Query' } & Pick<
  Query,
  'adminCheck'
>;

export type GetNodeInfoQueryVariables = {
  auth: AuthType;
};

export type GetNodeInfoQuery = { __typename?: 'Query' } & Pick<
  Query,
  'getChainBalance' | 'getPendingChainBalance'
> & {
    getNodeInfo?: Maybe<
      { __typename?: 'nodeInfoType' } & Pick<
        NodeInfoType,
        | 'chains'
        | 'color'
        | 'active_channels_count'
        | 'closed_channels_count'
        | 'alias'
        | 'is_synced_to_chain'
        | 'peers_count'
        | 'pending_channels_count'
        | 'version'
      >
    >;
    getChannelBalance?: Maybe<
      { __typename?: 'channelBalanceType' } & Pick<
        ChannelBalanceType,
        'confirmedBalance' | 'pendingBalance'
      >
    >;
  };

export type GetChannelAmountInfoQueryVariables = {
  auth: AuthType;
};

export type GetChannelAmountInfoQuery = { __typename?: 'Query' } & {
  getNodeInfo?: Maybe<
    { __typename?: 'nodeInfoType' } & Pick<
      NodeInfoType,
      | 'active_channels_count'
      | 'closed_channels_count'
      | 'pending_channels_count'
    >
  >;
};

export type GetChannelsQueryVariables = {
  auth: AuthType;
  active?: Maybe<Scalars['Boolean']>;
};

export type GetChannelsQuery = { __typename?: 'Query' } & {
  getChannels?: Maybe<
    Array<
      Maybe<
        { __typename?: 'channelType' } & Pick<
          ChannelType,
          | 'capacity'
          | 'commit_transaction_fee'
          | 'commit_transaction_weight'
          | 'id'
          | 'is_active'
          | 'is_closing'
          | 'is_opening'
          | 'is_partner_initiated'
          | 'is_private'
          | 'is_static_remote_key'
          | 'local_balance'
          | 'local_reserve'
          | 'partner_public_key'
          | 'received'
          | 'remote_balance'
          | 'remote_reserve'
          | 'sent'
          | 'time_offline'
          | 'time_online'
          | 'transaction_id'
          | 'transaction_vout'
          | 'unsettled_balance'
        > & {
            partner_node_info?: Maybe<
              { __typename?: 'partnerNodeType' } & Pick<
                PartnerNodeType,
                'alias' | 'capacity' | 'channel_count' | 'color' | 'updated_at'
              >
            >;
          }
      >
    >
  >;
};

export type GetNodeQueryVariables = {
  auth: AuthType;
  publicKey: Scalars['String'];
  withoutChannels?: Maybe<Scalars['Boolean']>;
};

export type GetNodeQuery = { __typename?: 'Query' } & {
  getNode?: Maybe<
    { __typename?: 'partnerNodeType' } & Pick<
      PartnerNodeType,
      'alias' | 'capacity' | 'channel_count' | 'color' | 'updated_at'
    >
  >;
};

export type DecodeRequestQueryVariables = {
  auth: AuthType;
  request: Scalars['String'];
};

export type DecodeRequestQuery = { __typename?: 'Query' } & {
  decodeRequest?: Maybe<
    { __typename?: 'decodeType' } & Pick<
      DecodeType,
      | 'chain_address'
      | 'cltv_delta'
      | 'description'
      | 'description_hash'
      | 'destination'
      | 'expires_at'
      | 'id'
      | 'tokens'
    > & {
        routes?: Maybe<
          Array<
            Maybe<
              { __typename?: 'DecodeRoutesType' } & Pick<
                DecodeRoutesType,
                | 'base_fee_mtokens'
                | 'channel'
                | 'cltv_delta'
                | 'fee_rate'
                | 'public_key'
              >
            >
          >
        >;
      }
  >;
};

export type GetPendingChannelsQueryVariables = {
  auth: AuthType;
};

export type GetPendingChannelsQuery = { __typename?: 'Query' } & {
  getPendingChannels?: Maybe<
    Array<
      Maybe<
        { __typename?: 'pendingChannelType' } & Pick<
          PendingChannelType,
          | 'close_transaction_id'
          | 'is_active'
          | 'is_closing'
          | 'is_opening'
          | 'local_balance'
          | 'local_reserve'
          | 'partner_public_key'
          | 'received'
          | 'remote_balance'
          | 'remote_reserve'
          | 'sent'
          | 'transaction_fee'
          | 'transaction_id'
          | 'transaction_vout'
        > & {
            partner_node_info?: Maybe<
              { __typename?: 'partnerNodeType' } & Pick<
                PartnerNodeType,
                'alias' | 'capacity' | 'channel_count' | 'color' | 'updated_at'
              >
            >;
          }
      >
    >
  >;
};

export type GetClosedChannelsQueryVariables = {
  auth: AuthType;
};

export type GetClosedChannelsQuery = { __typename?: 'Query' } & {
  getClosedChannels?: Maybe<
    Array<
      Maybe<
        { __typename?: 'closedChannelType' } & Pick<
          ClosedChannelType,
          | 'capacity'
          | 'close_confirm_height'
          | 'close_transaction_id'
          | 'final_local_balance'
          | 'final_time_locked_balance'
          | 'id'
          | 'is_breach_close'
          | 'is_cooperative_close'
          | 'is_funding_cancel'
          | 'is_local_force_close'
          | 'is_remote_force_close'
          | 'partner_public_key'
          | 'transaction_id'
          | 'transaction_vout'
        > & {
            partner_node_info?: Maybe<
              { __typename?: 'partnerNodeType' } & Pick<
                PartnerNodeType,
                'alias' | 'capacity' | 'channel_count' | 'color' | 'updated_at'
              >
            >;
          }
      >
    >
  >;
};

export type GetResumeQueryVariables = {
  auth: AuthType;
  token?: Maybe<Scalars['String']>;
};

export type GetResumeQuery = { __typename?: 'Query' } & {
  getResume?: Maybe<
    { __typename?: 'getResumeType' } & Pick<GetResumeType, 'token' | 'resume'>
  >;
};

export type GetBitcoinPriceQueryVariables = {};

export type GetBitcoinPriceQuery = { __typename?: 'Query' } & Pick<
  Query,
  'getBitcoinPrice'
>;

export type GetBitcoinFeesQueryVariables = {};

export type GetBitcoinFeesQuery = { __typename?: 'Query' } & {
  getBitcoinFees?: Maybe<
    { __typename?: 'bitcoinFeeType' } & Pick<
      BitcoinFeeType,
      'fast' | 'halfHour' | 'hour'
    >
  >;
};

export type GetForwardReportQueryVariables = {
  time?: Maybe<Scalars['String']>;
  auth: AuthType;
};

export type GetForwardReportQuery = { __typename?: 'Query' } & Pick<
  Query,
  'getForwardReport'
>;

export type GetLiquidReportQueryVariables = {
  auth: AuthType;
};

export type GetLiquidReportQuery = { __typename?: 'Query' } & {
  getChannelReport?: Maybe<
    { __typename?: 'channelReportType' } & Pick<
      ChannelReportType,
      'local' | 'remote' | 'maxIn' | 'maxOut'
    >
  >;
};

export type GetForwardChannelsReportQueryVariables = {
  time?: Maybe<Scalars['String']>;
  order?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  auth: AuthType;
};

export type GetForwardChannelsReportQuery = { __typename?: 'Query' } & Pick<
  Query,
  'getForwardChannelsReport'
>;

export type GetInOutQueryVariables = {
  auth: AuthType;
  time?: Maybe<Scalars['String']>;
};

export type GetInOutQuery = { __typename?: 'Query' } & {
  getInOut?: Maybe<
    { __typename?: 'InOutType' } & Pick<
      InOutType,
      'invoices' | 'payments' | 'confirmedInvoices' | 'unConfirmedInvoices'
    >
  >;
};

export type GetChainTransactionsQueryVariables = {
  auth: AuthType;
};

export type GetChainTransactionsQuery = { __typename?: 'Query' } & {
  getChainTransactions?: Maybe<
    Array<
      Maybe<
        { __typename?: 'getTransactionsType' } & Pick<
          GetTransactionsType,
          | 'block_id'
          | 'confirmation_count'
          | 'confirmation_height'
          | 'created_at'
          | 'fee'
          | 'id'
          | 'output_addresses'
          | 'tokens'
        >
      >
    >
  >;
};

export type GetForwardsQueryVariables = {
  auth: AuthType;
  time?: Maybe<Scalars['String']>;
};

export type GetForwardsQuery = { __typename?: 'Query' } & {
  getForwards?: Maybe<
    { __typename?: 'getForwardType' } & Pick<GetForwardType, 'token'> & {
        forwards?: Maybe<
          Array<
            Maybe<
              { __typename?: 'forwardType' } & Pick<
                ForwardType,
                | 'created_at'
                | 'fee'
                | 'fee_mtokens'
                | 'incoming_channel'
                | 'incoming_alias'
                | 'incoming_color'
                | 'mtokens'
                | 'outgoing_channel'
                | 'outgoing_alias'
                | 'outgoing_color'
                | 'tokens'
              >
            >
          >
        >;
      }
  >;
};

export type GetCanConnectInfoQueryVariables = {
  auth: AuthType;
};

export type GetCanConnectInfoQuery = { __typename?: 'Query' } & {
  getNodeInfo?: Maybe<
    { __typename?: 'nodeInfoType' } & Pick<NodeInfoType, 'public_key' | 'uris'>
  >;
};

export type GetBackupsQueryVariables = {
  auth: AuthType;
};

export type GetBackupsQuery = { __typename?: 'Query' } & Pick<
  Query,
  'getBackups'
>;

export type VerifyBackupsQueryVariables = {
  auth: AuthType;
  backup: Scalars['String'];
};

export type VerifyBackupsQuery = { __typename?: 'Query' } & Pick<
  Query,
  'verifyBackups'
>;

export type SignMessageQueryVariables = {
  auth: AuthType;
  message: Scalars['String'];
};

export type SignMessageQuery = { __typename?: 'Query' } & Pick<
  Query,
  'signMessage'
>;

export type VerifyMessageQueryVariables = {
  auth: AuthType;
  message: Scalars['String'];
  signature: Scalars['String'];
};

export type VerifyMessageQuery = { __typename?: 'Query' } & Pick<
  Query,
  'verifyMessage'
>;

export type RecoverFundsQueryVariables = {
  auth: AuthType;
  backup: Scalars['String'];
};

export type RecoverFundsQuery = { __typename?: 'Query' } & Pick<
  Query,
  'recoverFunds'
>;

export type ChannelFeesQueryVariables = {
  auth: AuthType;
};

export type ChannelFeesQuery = { __typename?: 'Query' } & {
  getChannelFees?: Maybe<
    Array<
      Maybe<
        { __typename?: 'channelFeeType' } & Pick<
          ChannelFeeType,
          | 'alias'
          | 'color'
          | 'baseFee'
          | 'feeRate'
          | 'transactionId'
          | 'transactionVout'
          | 'public_key'
        >
      >
    >
  >;
};

export type GetRoutesQueryVariables = {
  auth: AuthType;
  outgoing: Scalars['String'];
  incoming: Scalars['String'];
  tokens: Scalars['Int'];
  maxFee?: Maybe<Scalars['Int']>;
};

export type GetRoutesQuery = { __typename?: 'Query' } & Pick<
  Query,
  'getRoutes'
>;

export type GetPeersQueryVariables = {
  auth: AuthType;
};

export type GetPeersQuery = { __typename?: 'Query' } & {
  getPeers?: Maybe<
    Array<
      Maybe<
        { __typename?: 'peerType' } & Pick<
          PeerType,
          | 'bytes_received'
          | 'bytes_sent'
          | 'is_inbound'
          | 'is_sync_peer'
          | 'ping_time'
          | 'public_key'
          | 'socket'
          | 'tokens_received'
          | 'tokens_sent'
        > & {
            partner_node_info?: Maybe<
              { __typename?: 'partnerNodeType' } & Pick<
                PartnerNodeType,
                'alias' | 'capacity' | 'channel_count' | 'color' | 'updated_at'
              >
            >;
          }
      >
    >
  >;
};

export type GetUtxosQueryVariables = {
  auth: AuthType;
};

export type GetUtxosQuery = { __typename?: 'Query' } & {
  getUtxos?: Maybe<
    Array<
      Maybe<
        { __typename?: 'getUtxosType' } & Pick<
          GetUtxosType,
          | 'address'
          | 'address_format'
          | 'confirmation_count'
          | 'output_script'
          | 'tokens'
          | 'transaction_id'
          | 'transaction_vout'
        >
      >
    >
  >;
};

export type GetMessagesQueryVariables = {
  auth: AuthType;
  initialize?: Maybe<Scalars['Boolean']>;
  lastMessage?: Maybe<Scalars['String']>;
};

export type GetMessagesQuery = { __typename?: 'Query' } & {
  getMessages?: Maybe<
    { __typename?: 'getMessagesType' } & Pick<GetMessagesType, 'token'> & {
        messages?: Maybe<
          Array<
            Maybe<
              { __typename?: 'messagesType' } & Pick<
                MessagesType,
                'date' | 'contentType' | 'alias' | 'message' | 'id' | 'sender'
              >
            >
          >
        >;
      }
  >;
};

export const GetCountriesDocument = gql`
  query GetCountries {
    getCountries {
      code
      name
      native_name
      currency_code
      currency_name
    }
  }
`;

/**
 * __useGetCountriesQuery__
 *
 * To run a query within a React component, call `useGetCountriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCountriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCountriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCountriesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetCountriesQuery,
    GetCountriesQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetCountriesQuery,
    GetCountriesQueryVariables
  >(GetCountriesDocument, baseOptions);
}
export function useGetCountriesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetCountriesQuery,
    GetCountriesQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetCountriesQuery,
    GetCountriesQueryVariables
  >(GetCountriesDocument, baseOptions);
}
export type GetCountriesQueryHookResult = ReturnType<
  typeof useGetCountriesQuery
>;
export type GetCountriesLazyQueryHookResult = ReturnType<
  typeof useGetCountriesLazyQuery
>;
export type GetCountriesQueryResult = ApolloReactCommon.QueryResult<
  GetCountriesQuery,
  GetCountriesQueryVariables
>;
export const GetCurrenciesDocument = gql`
  query GetCurrencies {
    getCurrencies {
      code
      name
      type
    }
  }
`;

/**
 * __useGetCurrenciesQuery__
 *
 * To run a query within a React component, call `useGetCurrenciesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrenciesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrenciesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrenciesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetCurrenciesQuery,
    GetCurrenciesQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetCurrenciesQuery,
    GetCurrenciesQueryVariables
  >(GetCurrenciesDocument, baseOptions);
}
export function useGetCurrenciesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetCurrenciesQuery,
    GetCurrenciesQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetCurrenciesQuery,
    GetCurrenciesQueryVariables
  >(GetCurrenciesDocument, baseOptions);
}
export type GetCurrenciesQueryHookResult = ReturnType<
  typeof useGetCurrenciesQuery
>;
export type GetCurrenciesLazyQueryHookResult = ReturnType<
  typeof useGetCurrenciesLazyQuery
>;
export type GetCurrenciesQueryResult = ApolloReactCommon.QueryResult<
  GetCurrenciesQuery,
  GetCurrenciesQueryVariables
>;
export const GetOffersDocument = gql`
  query GetOffers($filter: String) {
    getOffers(filter: $filter) {
      id
      asset_code
      country
      country_code
      working_now
      side
      title
      description
      currency_code
      price
      min_amount
      max_amount
      first_trade_limit
      fee {
        author_fee_rate
      }
      balance
      payment_window_minutes
      confirmations
      payment_method_instructions {
        id
        version
        payment_method_id
        payment_method_type
        payment_method_name
      }
      trader {
        login
        online_status
        rating
        trades_count
        url
        verified
        verified_by
        strong_hodler
        country
        country_code
        average_payment_time_minutes
        average_release_time_minutes
        days_since_last_trade
      }
    }
  }
`;

/**
 * __useGetOffersQuery__
 *
 * To run a query within a React component, call `useGetOffersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOffersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOffersQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetOffersQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetOffersQuery,
    GetOffersQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetOffersQuery, GetOffersQueryVariables>(
    GetOffersDocument,
    baseOptions
  );
}
export function useGetOffersLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetOffersQuery,
    GetOffersQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<GetOffersQuery, GetOffersQueryVariables>(
    GetOffersDocument,
    baseOptions
  );
}
export type GetOffersQueryHookResult = ReturnType<typeof useGetOffersQuery>;
export type GetOffersLazyQueryHookResult = ReturnType<
  typeof useGetOffersLazyQuery
>;
export type GetOffersQueryResult = ApolloReactCommon.QueryResult<
  GetOffersQuery,
  GetOffersQueryVariables
>;
export const CloseChannelDocument = gql`
  mutation CloseChannel(
    $id: String!
    $auth: authType!
    $forceClose: Boolean
    $target: Int
    $tokens: Int
  ) {
    closeChannel(
      id: $id
      forceClose: $forceClose
      targetConfirmations: $target
      tokensPerVByte: $tokens
      auth: $auth
    ) {
      transactionId
      transactionOutputIndex
    }
  }
`;
export type CloseChannelMutationFn = ApolloReactCommon.MutationFunction<
  CloseChannelMutation,
  CloseChannelMutationVariables
>;

/**
 * __useCloseChannelMutation__
 *
 * To run a mutation, you first call `useCloseChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCloseChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [closeChannelMutation, { data, loading, error }] = useCloseChannelMutation({
 *   variables: {
 *      id: // value for 'id'
 *      auth: // value for 'auth'
 *      forceClose: // value for 'forceClose'
 *      target: // value for 'target'
 *      tokens: // value for 'tokens'
 *   },
 * });
 */
export function useCloseChannelMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CloseChannelMutation,
    CloseChannelMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CloseChannelMutation,
    CloseChannelMutationVariables
  >(CloseChannelDocument, baseOptions);
}
export type CloseChannelMutationHookResult = ReturnType<
  typeof useCloseChannelMutation
>;
export type CloseChannelMutationResult = ApolloReactCommon.MutationResult<
  CloseChannelMutation
>;
export type CloseChannelMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CloseChannelMutation,
  CloseChannelMutationVariables
>;
export const OpenChannelDocument = gql`
  mutation OpenChannel(
    $amount: Int!
    $partnerPublicKey: String!
    $auth: authType!
    $tokensPerVByte: Int
    $isPrivate: Boolean
  ) {
    openChannel(
      amount: $amount
      partnerPublicKey: $partnerPublicKey
      auth: $auth
      tokensPerVByte: $tokensPerVByte
      isPrivate: $isPrivate
    ) {
      transactionId
      transactionOutputIndex
    }
  }
`;
export type OpenChannelMutationFn = ApolloReactCommon.MutationFunction<
  OpenChannelMutation,
  OpenChannelMutationVariables
>;

/**
 * __useOpenChannelMutation__
 *
 * To run a mutation, you first call `useOpenChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOpenChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [openChannelMutation, { data, loading, error }] = useOpenChannelMutation({
 *   variables: {
 *      amount: // value for 'amount'
 *      partnerPublicKey: // value for 'partnerPublicKey'
 *      auth: // value for 'auth'
 *      tokensPerVByte: // value for 'tokensPerVByte'
 *      isPrivate: // value for 'isPrivate'
 *   },
 * });
 */
export function useOpenChannelMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    OpenChannelMutation,
    OpenChannelMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    OpenChannelMutation,
    OpenChannelMutationVariables
  >(OpenChannelDocument, baseOptions);
}
export type OpenChannelMutationHookResult = ReturnType<
  typeof useOpenChannelMutation
>;
export type OpenChannelMutationResult = ApolloReactCommon.MutationResult<
  OpenChannelMutation
>;
export type OpenChannelMutationOptions = ApolloReactCommon.BaseMutationOptions<
  OpenChannelMutation,
  OpenChannelMutationVariables
>;
export const PayInvoiceDocument = gql`
  mutation PayInvoice($request: String!, $auth: authType!, $tokens: Int) {
    pay(request: $request, auth: $auth, tokens: $tokens) {
      is_confirmed
    }
  }
`;
export type PayInvoiceMutationFn = ApolloReactCommon.MutationFunction<
  PayInvoiceMutation,
  PayInvoiceMutationVariables
>;

/**
 * __usePayInvoiceMutation__
 *
 * To run a mutation, you first call `usePayInvoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePayInvoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [payInvoiceMutation, { data, loading, error }] = usePayInvoiceMutation({
 *   variables: {
 *      request: // value for 'request'
 *      auth: // value for 'auth'
 *      tokens: // value for 'tokens'
 *   },
 * });
 */
export function usePayInvoiceMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    PayInvoiceMutation,
    PayInvoiceMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    PayInvoiceMutation,
    PayInvoiceMutationVariables
  >(PayInvoiceDocument, baseOptions);
}
export type PayInvoiceMutationHookResult = ReturnType<
  typeof usePayInvoiceMutation
>;
export type PayInvoiceMutationResult = ApolloReactCommon.MutationResult<
  PayInvoiceMutation
>;
export type PayInvoiceMutationOptions = ApolloReactCommon.BaseMutationOptions<
  PayInvoiceMutation,
  PayInvoiceMutationVariables
>;
export const CreateInvoiceDocument = gql`
  mutation CreateInvoice($amount: Int!, $auth: authType!) {
    createInvoice(amount: $amount, auth: $auth) {
      request
    }
  }
`;
export type CreateInvoiceMutationFn = ApolloReactCommon.MutationFunction<
  CreateInvoiceMutation,
  CreateInvoiceMutationVariables
>;

/**
 * __useCreateInvoiceMutation__
 *
 * To run a mutation, you first call `useCreateInvoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInvoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInvoiceMutation, { data, loading, error }] = useCreateInvoiceMutation({
 *   variables: {
 *      amount: // value for 'amount'
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useCreateInvoiceMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateInvoiceMutation,
    CreateInvoiceMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreateInvoiceMutation,
    CreateInvoiceMutationVariables
  >(CreateInvoiceDocument, baseOptions);
}
export type CreateInvoiceMutationHookResult = ReturnType<
  typeof useCreateInvoiceMutation
>;
export type CreateInvoiceMutationResult = ApolloReactCommon.MutationResult<
  CreateInvoiceMutation
>;
export type CreateInvoiceMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateInvoiceMutation,
  CreateInvoiceMutationVariables
>;
export const CreateAddressDocument = gql`
  mutation CreateAddress($nested: Boolean, $auth: authType!) {
    createAddress(nested: $nested, auth: $auth)
  }
`;
export type CreateAddressMutationFn = ApolloReactCommon.MutationFunction<
  CreateAddressMutation,
  CreateAddressMutationVariables
>;

/**
 * __useCreateAddressMutation__
 *
 * To run a mutation, you first call `useCreateAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAddressMutation, { data, loading, error }] = useCreateAddressMutation({
 *   variables: {
 *      nested: // value for 'nested'
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useCreateAddressMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateAddressMutation,
    CreateAddressMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreateAddressMutation,
    CreateAddressMutationVariables
  >(CreateAddressDocument, baseOptions);
}
export type CreateAddressMutationHookResult = ReturnType<
  typeof useCreateAddressMutation
>;
export type CreateAddressMutationResult = ApolloReactCommon.MutationResult<
  CreateAddressMutation
>;
export type CreateAddressMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateAddressMutation,
  CreateAddressMutationVariables
>;
export const PayAddressDocument = gql`
  mutation PayAddress(
    $auth: authType!
    $address: String!
    $tokens: Int
    $fee: Int
    $target: Int
    $sendAll: Boolean
  ) {
    sendToAddress(
      auth: $auth
      address: $address
      tokens: $tokens
      fee: $fee
      target: $target
      sendAll: $sendAll
    ) {
      confirmationCount
      id
      isConfirmed
      isOutgoing
      tokens
    }
  }
`;
export type PayAddressMutationFn = ApolloReactCommon.MutationFunction<
  PayAddressMutation,
  PayAddressMutationVariables
>;

/**
 * __usePayAddressMutation__
 *
 * To run a mutation, you first call `usePayAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePayAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [payAddressMutation, { data, loading, error }] = usePayAddressMutation({
 *   variables: {
 *      auth: // value for 'auth'
 *      address: // value for 'address'
 *      tokens: // value for 'tokens'
 *      fee: // value for 'fee'
 *      target: // value for 'target'
 *      sendAll: // value for 'sendAll'
 *   },
 * });
 */
export function usePayAddressMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    PayAddressMutation,
    PayAddressMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    PayAddressMutation,
    PayAddressMutationVariables
  >(PayAddressDocument, baseOptions);
}
export type PayAddressMutationHookResult = ReturnType<
  typeof usePayAddressMutation
>;
export type PayAddressMutationResult = ApolloReactCommon.MutationResult<
  PayAddressMutation
>;
export type PayAddressMutationOptions = ApolloReactCommon.BaseMutationOptions<
  PayAddressMutation,
  PayAddressMutationVariables
>;
export const UpdateFeesDocument = gql`
  mutation UpdateFees(
    $auth: authType!
    $transactionId: String
    $transactionVout: Int
    $baseFee: Int
    $feeRate: Int
  ) {
    updateFees(
      auth: $auth
      transactionId: $transactionId
      transactionVout: $transactionVout
      baseFee: $baseFee
      feeRate: $feeRate
    )
  }
`;
export type UpdateFeesMutationFn = ApolloReactCommon.MutationFunction<
  UpdateFeesMutation,
  UpdateFeesMutationVariables
>;

/**
 * __useUpdateFeesMutation__
 *
 * To run a mutation, you first call `useUpdateFeesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFeesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFeesMutation, { data, loading, error }] = useUpdateFeesMutation({
 *   variables: {
 *      auth: // value for 'auth'
 *      transactionId: // value for 'transactionId'
 *      transactionVout: // value for 'transactionVout'
 *      baseFee: // value for 'baseFee'
 *      feeRate: // value for 'feeRate'
 *   },
 * });
 */
export function useUpdateFeesMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateFeesMutation,
    UpdateFeesMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    UpdateFeesMutation,
    UpdateFeesMutationVariables
  >(UpdateFeesDocument, baseOptions);
}
export type UpdateFeesMutationHookResult = ReturnType<
  typeof useUpdateFeesMutation
>;
export type UpdateFeesMutationResult = ApolloReactCommon.MutationResult<
  UpdateFeesMutation
>;
export type UpdateFeesMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateFeesMutation,
  UpdateFeesMutationVariables
>;
export const PayViaRouteDocument = gql`
  mutation PayViaRoute($auth: authType!, $route: String!) {
    payViaRoute(auth: $auth, route: $route)
  }
`;
export type PayViaRouteMutationFn = ApolloReactCommon.MutationFunction<
  PayViaRouteMutation,
  PayViaRouteMutationVariables
>;

/**
 * __usePayViaRouteMutation__
 *
 * To run a mutation, you first call `usePayViaRouteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePayViaRouteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [payViaRouteMutation, { data, loading, error }] = usePayViaRouteMutation({
 *   variables: {
 *      auth: // value for 'auth'
 *      route: // value for 'route'
 *   },
 * });
 */
export function usePayViaRouteMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    PayViaRouteMutation,
    PayViaRouteMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    PayViaRouteMutation,
    PayViaRouteMutationVariables
  >(PayViaRouteDocument, baseOptions);
}
export type PayViaRouteMutationHookResult = ReturnType<
  typeof usePayViaRouteMutation
>;
export type PayViaRouteMutationResult = ApolloReactCommon.MutationResult<
  PayViaRouteMutation
>;
export type PayViaRouteMutationOptions = ApolloReactCommon.BaseMutationOptions<
  PayViaRouteMutation,
  PayViaRouteMutationVariables
>;
export const RemovePeerDocument = gql`
  mutation RemovePeer($auth: authType!, $publicKey: String!) {
    removePeer(auth: $auth, publicKey: $publicKey)
  }
`;
export type RemovePeerMutationFn = ApolloReactCommon.MutationFunction<
  RemovePeerMutation,
  RemovePeerMutationVariables
>;

/**
 * __useRemovePeerMutation__
 *
 * To run a mutation, you first call `useRemovePeerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemovePeerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removePeerMutation, { data, loading, error }] = useRemovePeerMutation({
 *   variables: {
 *      auth: // value for 'auth'
 *      publicKey: // value for 'publicKey'
 *   },
 * });
 */
export function useRemovePeerMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RemovePeerMutation,
    RemovePeerMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    RemovePeerMutation,
    RemovePeerMutationVariables
  >(RemovePeerDocument, baseOptions);
}
export type RemovePeerMutationHookResult = ReturnType<
  typeof useRemovePeerMutation
>;
export type RemovePeerMutationResult = ApolloReactCommon.MutationResult<
  RemovePeerMutation
>;
export type RemovePeerMutationOptions = ApolloReactCommon.BaseMutationOptions<
  RemovePeerMutation,
  RemovePeerMutationVariables
>;
export const AddPeerDocument = gql`
  mutation AddPeer(
    $auth: authType!
    $publicKey: String!
    $socket: String!
    $isTemporary: Boolean
  ) {
    addPeer(
      auth: $auth
      publicKey: $publicKey
      socket: $socket
      isTemporary: $isTemporary
    )
  }
`;
export type AddPeerMutationFn = ApolloReactCommon.MutationFunction<
  AddPeerMutation,
  AddPeerMutationVariables
>;

/**
 * __useAddPeerMutation__
 *
 * To run a mutation, you first call `useAddPeerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPeerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPeerMutation, { data, loading, error }] = useAddPeerMutation({
 *   variables: {
 *      auth: // value for 'auth'
 *      publicKey: // value for 'publicKey'
 *      socket: // value for 'socket'
 *      isTemporary: // value for 'isTemporary'
 *   },
 * });
 */
export function useAddPeerMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AddPeerMutation,
    AddPeerMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    AddPeerMutation,
    AddPeerMutationVariables
  >(AddPeerDocument, baseOptions);
}
export type AddPeerMutationHookResult = ReturnType<typeof useAddPeerMutation>;
export type AddPeerMutationResult = ApolloReactCommon.MutationResult<
  AddPeerMutation
>;
export type AddPeerMutationOptions = ApolloReactCommon.BaseMutationOptions<
  AddPeerMutation,
  AddPeerMutationVariables
>;
export const SendMessageDocument = gql`
  mutation SendMessage(
    $auth: authType!
    $publicKey: String!
    $message: String!
    $tokens: Int
  ) {
    sendMessage(
      auth: $auth
      publicKey: $publicKey
      message: $message
      tokens: $tokens
    )
  }
`;
export type SendMessageMutationFn = ApolloReactCommon.MutationFunction<
  SendMessageMutation,
  SendMessageMutationVariables
>;

/**
 * __useSendMessageMutation__
 *
 * To run a mutation, you first call `useSendMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMessageMutation, { data, loading, error }] = useSendMessageMutation({
 *   variables: {
 *      auth: // value for 'auth'
 *      publicKey: // value for 'publicKey'
 *      message: // value for 'message'
 *      tokens: // value for 'tokens'
 *   },
 * });
 */
export function useSendMessageMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SendMessageMutation,
    SendMessageMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    SendMessageMutation,
    SendMessageMutationVariables
  >(SendMessageDocument, baseOptions);
}
export type SendMessageMutationHookResult = ReturnType<
  typeof useSendMessageMutation
>;
export type SendMessageMutationResult = ApolloReactCommon.MutationResult<
  SendMessageMutation
>;
export type SendMessageMutationOptions = ApolloReactCommon.BaseMutationOptions<
  SendMessageMutation,
  SendMessageMutationVariables
>;
export const GetNetworkInfoDocument = gql`
  query GetNetworkInfo($auth: authType!) {
    getNetworkInfo(auth: $auth) {
      averageChannelSize
      channelCount
      maxChannelSize
      medianChannelSize
      minChannelSize
      nodeCount
      notRecentlyUpdatedPolicyCount
      totalCapacity
    }
  }
`;

/**
 * __useGetNetworkInfoQuery__
 *
 * To run a query within a React component, call `useGetNetworkInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNetworkInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNetworkInfoQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetNetworkInfoQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetNetworkInfoQuery,
    GetNetworkInfoQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetNetworkInfoQuery,
    GetNetworkInfoQueryVariables
  >(GetNetworkInfoDocument, baseOptions);
}
export function useGetNetworkInfoLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetNetworkInfoQuery,
    GetNetworkInfoQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetNetworkInfoQuery,
    GetNetworkInfoQueryVariables
  >(GetNetworkInfoDocument, baseOptions);
}
export type GetNetworkInfoQueryHookResult = ReturnType<
  typeof useGetNetworkInfoQuery
>;
export type GetNetworkInfoLazyQueryHookResult = ReturnType<
  typeof useGetNetworkInfoLazyQuery
>;
export type GetNetworkInfoQueryResult = ApolloReactCommon.QueryResult<
  GetNetworkInfoQuery,
  GetNetworkInfoQueryVariables
>;
export const GetCanConnectDocument = gql`
  query GetCanConnect($auth: authType!) {
    getNodeInfo(auth: $auth) {
      chains
      color
      active_channels_count
      closed_channels_count
      alias
      is_synced_to_chain
      peers_count
      pending_channels_count
      version
    }
  }
`;

/**
 * __useGetCanConnectQuery__
 *
 * To run a query within a React component, call `useGetCanConnectQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCanConnectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCanConnectQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetCanConnectQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetCanConnectQuery,
    GetCanConnectQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetCanConnectQuery,
    GetCanConnectQueryVariables
  >(GetCanConnectDocument, baseOptions);
}
export function useGetCanConnectLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetCanConnectQuery,
    GetCanConnectQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetCanConnectQuery,
    GetCanConnectQueryVariables
  >(GetCanConnectDocument, baseOptions);
}
export type GetCanConnectQueryHookResult = ReturnType<
  typeof useGetCanConnectQuery
>;
export type GetCanConnectLazyQueryHookResult = ReturnType<
  typeof useGetCanConnectLazyQuery
>;
export type GetCanConnectQueryResult = ApolloReactCommon.QueryResult<
  GetCanConnectQuery,
  GetCanConnectQueryVariables
>;
export const GetCanAdminDocument = gql`
  query GetCanAdmin($auth: authType!) {
    adminCheck(auth: $auth)
  }
`;

/**
 * __useGetCanAdminQuery__
 *
 * To run a query within a React component, call `useGetCanAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCanAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCanAdminQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetCanAdminQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetCanAdminQuery,
    GetCanAdminQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetCanAdminQuery, GetCanAdminQueryVariables>(
    GetCanAdminDocument,
    baseOptions
  );
}
export function useGetCanAdminLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetCanAdminQuery,
    GetCanAdminQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetCanAdminQuery,
    GetCanAdminQueryVariables
  >(GetCanAdminDocument, baseOptions);
}
export type GetCanAdminQueryHookResult = ReturnType<typeof useGetCanAdminQuery>;
export type GetCanAdminLazyQueryHookResult = ReturnType<
  typeof useGetCanAdminLazyQuery
>;
export type GetCanAdminQueryResult = ApolloReactCommon.QueryResult<
  GetCanAdminQuery,
  GetCanAdminQueryVariables
>;
export const GetNodeInfoDocument = gql`
  query GetNodeInfo($auth: authType!) {
    getNodeInfo(auth: $auth) {
      chains
      color
      active_channels_count
      closed_channels_count
      alias
      is_synced_to_chain
      peers_count
      pending_channels_count
      version
    }
    getChainBalance(auth: $auth)
    getPendingChainBalance(auth: $auth)
    getChannelBalance(auth: $auth) {
      confirmedBalance
      pendingBalance
    }
  }
`;

/**
 * __useGetNodeInfoQuery__
 *
 * To run a query within a React component, call `useGetNodeInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNodeInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNodeInfoQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetNodeInfoQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetNodeInfoQuery,
    GetNodeInfoQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetNodeInfoQuery, GetNodeInfoQueryVariables>(
    GetNodeInfoDocument,
    baseOptions
  );
}
export function useGetNodeInfoLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetNodeInfoQuery,
    GetNodeInfoQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetNodeInfoQuery,
    GetNodeInfoQueryVariables
  >(GetNodeInfoDocument, baseOptions);
}
export type GetNodeInfoQueryHookResult = ReturnType<typeof useGetNodeInfoQuery>;
export type GetNodeInfoLazyQueryHookResult = ReturnType<
  typeof useGetNodeInfoLazyQuery
>;
export type GetNodeInfoQueryResult = ApolloReactCommon.QueryResult<
  GetNodeInfoQuery,
  GetNodeInfoQueryVariables
>;
export const GetChannelAmountInfoDocument = gql`
  query GetChannelAmountInfo($auth: authType!) {
    getNodeInfo(auth: $auth) {
      active_channels_count
      closed_channels_count
      pending_channels_count
    }
  }
`;

/**
 * __useGetChannelAmountInfoQuery__
 *
 * To run a query within a React component, call `useGetChannelAmountInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelAmountInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelAmountInfoQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetChannelAmountInfoQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetChannelAmountInfoQuery,
    GetChannelAmountInfoQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetChannelAmountInfoQuery,
    GetChannelAmountInfoQueryVariables
  >(GetChannelAmountInfoDocument, baseOptions);
}
export function useGetChannelAmountInfoLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetChannelAmountInfoQuery,
    GetChannelAmountInfoQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetChannelAmountInfoQuery,
    GetChannelAmountInfoQueryVariables
  >(GetChannelAmountInfoDocument, baseOptions);
}
export type GetChannelAmountInfoQueryHookResult = ReturnType<
  typeof useGetChannelAmountInfoQuery
>;
export type GetChannelAmountInfoLazyQueryHookResult = ReturnType<
  typeof useGetChannelAmountInfoLazyQuery
>;
export type GetChannelAmountInfoQueryResult = ApolloReactCommon.QueryResult<
  GetChannelAmountInfoQuery,
  GetChannelAmountInfoQueryVariables
>;
export const GetChannelsDocument = gql`
  query GetChannels($auth: authType!, $active: Boolean) {
    getChannels(auth: $auth, active: $active) {
      capacity
      commit_transaction_fee
      commit_transaction_weight
      id
      is_active
      is_closing
      is_opening
      is_partner_initiated
      is_private
      is_static_remote_key
      local_balance
      local_reserve
      partner_public_key
      received
      remote_balance
      remote_reserve
      sent
      time_offline
      time_online
      transaction_id
      transaction_vout
      unsettled_balance
      partner_node_info {
        alias
        capacity
        channel_count
        color
        updated_at
      }
    }
  }
`;

/**
 * __useGetChannelsQuery__
 *
 * To run a query within a React component, call `useGetChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelsQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *      active: // value for 'active'
 *   },
 * });
 */
export function useGetChannelsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetChannelsQuery,
    GetChannelsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetChannelsQuery, GetChannelsQueryVariables>(
    GetChannelsDocument,
    baseOptions
  );
}
export function useGetChannelsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetChannelsQuery,
    GetChannelsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetChannelsQuery,
    GetChannelsQueryVariables
  >(GetChannelsDocument, baseOptions);
}
export type GetChannelsQueryHookResult = ReturnType<typeof useGetChannelsQuery>;
export type GetChannelsLazyQueryHookResult = ReturnType<
  typeof useGetChannelsLazyQuery
>;
export type GetChannelsQueryResult = ApolloReactCommon.QueryResult<
  GetChannelsQuery,
  GetChannelsQueryVariables
>;
export const GetNodeDocument = gql`
  query GetNode(
    $auth: authType!
    $publicKey: String!
    $withoutChannels: Boolean
  ) {
    getNode(
      auth: $auth
      publicKey: $publicKey
      withoutChannels: $withoutChannels
    ) {
      alias
      capacity
      channel_count
      color
      updated_at
    }
  }
`;

/**
 * __useGetNodeQuery__
 *
 * To run a query within a React component, call `useGetNodeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNodeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNodeQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *      publicKey: // value for 'publicKey'
 *      withoutChannels: // value for 'withoutChannels'
 *   },
 * });
 */
export function useGetNodeQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetNodeQuery,
    GetNodeQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetNodeQuery, GetNodeQueryVariables>(
    GetNodeDocument,
    baseOptions
  );
}
export function useGetNodeLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetNodeQuery,
    GetNodeQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<GetNodeQuery, GetNodeQueryVariables>(
    GetNodeDocument,
    baseOptions
  );
}
export type GetNodeQueryHookResult = ReturnType<typeof useGetNodeQuery>;
export type GetNodeLazyQueryHookResult = ReturnType<typeof useGetNodeLazyQuery>;
export type GetNodeQueryResult = ApolloReactCommon.QueryResult<
  GetNodeQuery,
  GetNodeQueryVariables
>;
export const DecodeRequestDocument = gql`
  query DecodeRequest($auth: authType!, $request: String!) {
    decodeRequest(auth: $auth, request: $request) {
      chain_address
      cltv_delta
      description
      description_hash
      destination
      expires_at
      id
      routes {
        base_fee_mtokens
        channel
        cltv_delta
        fee_rate
        public_key
      }
      tokens
    }
  }
`;

/**
 * __useDecodeRequestQuery__
 *
 * To run a query within a React component, call `useDecodeRequestQuery` and pass it any options that fit your needs.
 * When your component renders, `useDecodeRequestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDecodeRequestQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useDecodeRequestQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    DecodeRequestQuery,
    DecodeRequestQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    DecodeRequestQuery,
    DecodeRequestQueryVariables
  >(DecodeRequestDocument, baseOptions);
}
export function useDecodeRequestLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    DecodeRequestQuery,
    DecodeRequestQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    DecodeRequestQuery,
    DecodeRequestQueryVariables
  >(DecodeRequestDocument, baseOptions);
}
export type DecodeRequestQueryHookResult = ReturnType<
  typeof useDecodeRequestQuery
>;
export type DecodeRequestLazyQueryHookResult = ReturnType<
  typeof useDecodeRequestLazyQuery
>;
export type DecodeRequestQueryResult = ApolloReactCommon.QueryResult<
  DecodeRequestQuery,
  DecodeRequestQueryVariables
>;
export const GetPendingChannelsDocument = gql`
  query GetPendingChannels($auth: authType!) {
    getPendingChannels(auth: $auth) {
      close_transaction_id
      is_active
      is_closing
      is_opening
      local_balance
      local_reserve
      partner_public_key
      received
      remote_balance
      remote_reserve
      sent
      transaction_fee
      transaction_id
      transaction_vout
      partner_node_info {
        alias
        capacity
        channel_count
        color
        updated_at
      }
    }
  }
`;

/**
 * __useGetPendingChannelsQuery__
 *
 * To run a query within a React component, call `useGetPendingChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPendingChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPendingChannelsQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetPendingChannelsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetPendingChannelsQuery,
    GetPendingChannelsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetPendingChannelsQuery,
    GetPendingChannelsQueryVariables
  >(GetPendingChannelsDocument, baseOptions);
}
export function useGetPendingChannelsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetPendingChannelsQuery,
    GetPendingChannelsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetPendingChannelsQuery,
    GetPendingChannelsQueryVariables
  >(GetPendingChannelsDocument, baseOptions);
}
export type GetPendingChannelsQueryHookResult = ReturnType<
  typeof useGetPendingChannelsQuery
>;
export type GetPendingChannelsLazyQueryHookResult = ReturnType<
  typeof useGetPendingChannelsLazyQuery
>;
export type GetPendingChannelsQueryResult = ApolloReactCommon.QueryResult<
  GetPendingChannelsQuery,
  GetPendingChannelsQueryVariables
>;
export const GetClosedChannelsDocument = gql`
  query GetClosedChannels($auth: authType!) {
    getClosedChannels(auth: $auth) {
      capacity
      close_confirm_height
      close_transaction_id
      final_local_balance
      final_time_locked_balance
      id
      is_breach_close
      is_cooperative_close
      is_funding_cancel
      is_local_force_close
      is_remote_force_close
      partner_public_key
      transaction_id
      transaction_vout
      partner_node_info {
        alias
        capacity
        channel_count
        color
        updated_at
      }
    }
  }
`;

/**
 * __useGetClosedChannelsQuery__
 *
 * To run a query within a React component, call `useGetClosedChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClosedChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClosedChannelsQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetClosedChannelsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetClosedChannelsQuery,
    GetClosedChannelsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetClosedChannelsQuery,
    GetClosedChannelsQueryVariables
  >(GetClosedChannelsDocument, baseOptions);
}
export function useGetClosedChannelsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetClosedChannelsQuery,
    GetClosedChannelsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetClosedChannelsQuery,
    GetClosedChannelsQueryVariables
  >(GetClosedChannelsDocument, baseOptions);
}
export type GetClosedChannelsQueryHookResult = ReturnType<
  typeof useGetClosedChannelsQuery
>;
export type GetClosedChannelsLazyQueryHookResult = ReturnType<
  typeof useGetClosedChannelsLazyQuery
>;
export type GetClosedChannelsQueryResult = ApolloReactCommon.QueryResult<
  GetClosedChannelsQuery,
  GetClosedChannelsQueryVariables
>;
export const GetResumeDocument = gql`
  query GetResume($auth: authType!, $token: String) {
    getResume(auth: $auth, token: $token) {
      token
      resume
    }
  }
`;

/**
 * __useGetResumeQuery__
 *
 * To run a query within a React component, call `useGetResumeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetResumeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetResumeQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *      token: // value for 'token'
 *   },
 * });
 */
export function useGetResumeQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetResumeQuery,
    GetResumeQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetResumeQuery, GetResumeQueryVariables>(
    GetResumeDocument,
    baseOptions
  );
}
export function useGetResumeLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetResumeQuery,
    GetResumeQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<GetResumeQuery, GetResumeQueryVariables>(
    GetResumeDocument,
    baseOptions
  );
}
export type GetResumeQueryHookResult = ReturnType<typeof useGetResumeQuery>;
export type GetResumeLazyQueryHookResult = ReturnType<
  typeof useGetResumeLazyQuery
>;
export type GetResumeQueryResult = ApolloReactCommon.QueryResult<
  GetResumeQuery,
  GetResumeQueryVariables
>;
export const GetBitcoinPriceDocument = gql`
  query GetBitcoinPrice {
    getBitcoinPrice
  }
`;

/**
 * __useGetBitcoinPriceQuery__
 *
 * To run a query within a React component, call `useGetBitcoinPriceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBitcoinPriceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBitcoinPriceQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBitcoinPriceQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetBitcoinPriceQuery,
    GetBitcoinPriceQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetBitcoinPriceQuery,
    GetBitcoinPriceQueryVariables
  >(GetBitcoinPriceDocument, baseOptions);
}
export function useGetBitcoinPriceLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetBitcoinPriceQuery,
    GetBitcoinPriceQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetBitcoinPriceQuery,
    GetBitcoinPriceQueryVariables
  >(GetBitcoinPriceDocument, baseOptions);
}
export type GetBitcoinPriceQueryHookResult = ReturnType<
  typeof useGetBitcoinPriceQuery
>;
export type GetBitcoinPriceLazyQueryHookResult = ReturnType<
  typeof useGetBitcoinPriceLazyQuery
>;
export type GetBitcoinPriceQueryResult = ApolloReactCommon.QueryResult<
  GetBitcoinPriceQuery,
  GetBitcoinPriceQueryVariables
>;
export const GetBitcoinFeesDocument = gql`
  query GetBitcoinFees {
    getBitcoinFees {
      fast
      halfHour
      hour
    }
  }
`;

/**
 * __useGetBitcoinFeesQuery__
 *
 * To run a query within a React component, call `useGetBitcoinFeesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBitcoinFeesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBitcoinFeesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBitcoinFeesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetBitcoinFeesQuery,
    GetBitcoinFeesQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetBitcoinFeesQuery,
    GetBitcoinFeesQueryVariables
  >(GetBitcoinFeesDocument, baseOptions);
}
export function useGetBitcoinFeesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetBitcoinFeesQuery,
    GetBitcoinFeesQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetBitcoinFeesQuery,
    GetBitcoinFeesQueryVariables
  >(GetBitcoinFeesDocument, baseOptions);
}
export type GetBitcoinFeesQueryHookResult = ReturnType<
  typeof useGetBitcoinFeesQuery
>;
export type GetBitcoinFeesLazyQueryHookResult = ReturnType<
  typeof useGetBitcoinFeesLazyQuery
>;
export type GetBitcoinFeesQueryResult = ApolloReactCommon.QueryResult<
  GetBitcoinFeesQuery,
  GetBitcoinFeesQueryVariables
>;
export const GetForwardReportDocument = gql`
  query GetForwardReport($time: String, $auth: authType!) {
    getForwardReport(time: $time, auth: $auth)
  }
`;

/**
 * __useGetForwardReportQuery__
 *
 * To run a query within a React component, call `useGetForwardReportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetForwardReportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetForwardReportQuery({
 *   variables: {
 *      time: // value for 'time'
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetForwardReportQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetForwardReportQuery,
    GetForwardReportQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetForwardReportQuery,
    GetForwardReportQueryVariables
  >(GetForwardReportDocument, baseOptions);
}
export function useGetForwardReportLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetForwardReportQuery,
    GetForwardReportQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetForwardReportQuery,
    GetForwardReportQueryVariables
  >(GetForwardReportDocument, baseOptions);
}
export type GetForwardReportQueryHookResult = ReturnType<
  typeof useGetForwardReportQuery
>;
export type GetForwardReportLazyQueryHookResult = ReturnType<
  typeof useGetForwardReportLazyQuery
>;
export type GetForwardReportQueryResult = ApolloReactCommon.QueryResult<
  GetForwardReportQuery,
  GetForwardReportQueryVariables
>;
export const GetLiquidReportDocument = gql`
  query GetLiquidReport($auth: authType!) {
    getChannelReport(auth: $auth) {
      local
      remote
      maxIn
      maxOut
    }
  }
`;

/**
 * __useGetLiquidReportQuery__
 *
 * To run a query within a React component, call `useGetLiquidReportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLiquidReportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLiquidReportQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetLiquidReportQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetLiquidReportQuery,
    GetLiquidReportQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetLiquidReportQuery,
    GetLiquidReportQueryVariables
  >(GetLiquidReportDocument, baseOptions);
}
export function useGetLiquidReportLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetLiquidReportQuery,
    GetLiquidReportQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetLiquidReportQuery,
    GetLiquidReportQueryVariables
  >(GetLiquidReportDocument, baseOptions);
}
export type GetLiquidReportQueryHookResult = ReturnType<
  typeof useGetLiquidReportQuery
>;
export type GetLiquidReportLazyQueryHookResult = ReturnType<
  typeof useGetLiquidReportLazyQuery
>;
export type GetLiquidReportQueryResult = ApolloReactCommon.QueryResult<
  GetLiquidReportQuery,
  GetLiquidReportQueryVariables
>;
export const GetForwardChannelsReportDocument = gql`
  query GetForwardChannelsReport(
    $time: String
    $order: String
    $type: String
    $auth: authType!
  ) {
    getForwardChannelsReport(
      time: $time
      order: $order
      auth: $auth
      type: $type
    )
  }
`;

/**
 * __useGetForwardChannelsReportQuery__
 *
 * To run a query within a React component, call `useGetForwardChannelsReportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetForwardChannelsReportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetForwardChannelsReportQuery({
 *   variables: {
 *      time: // value for 'time'
 *      order: // value for 'order'
 *      type: // value for 'type'
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetForwardChannelsReportQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetForwardChannelsReportQuery,
    GetForwardChannelsReportQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetForwardChannelsReportQuery,
    GetForwardChannelsReportQueryVariables
  >(GetForwardChannelsReportDocument, baseOptions);
}
export function useGetForwardChannelsReportLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetForwardChannelsReportQuery,
    GetForwardChannelsReportQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetForwardChannelsReportQuery,
    GetForwardChannelsReportQueryVariables
  >(GetForwardChannelsReportDocument, baseOptions);
}
export type GetForwardChannelsReportQueryHookResult = ReturnType<
  typeof useGetForwardChannelsReportQuery
>;
export type GetForwardChannelsReportLazyQueryHookResult = ReturnType<
  typeof useGetForwardChannelsReportLazyQuery
>;
export type GetForwardChannelsReportQueryResult = ApolloReactCommon.QueryResult<
  GetForwardChannelsReportQuery,
  GetForwardChannelsReportQueryVariables
>;
export const GetInOutDocument = gql`
  query GetInOut($auth: authType!, $time: String) {
    getInOut(auth: $auth, time: $time) {
      invoices
      payments
      confirmedInvoices
      unConfirmedInvoices
    }
  }
`;

/**
 * __useGetInOutQuery__
 *
 * To run a query within a React component, call `useGetInOutQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInOutQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInOutQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *      time: // value for 'time'
 *   },
 * });
 */
export function useGetInOutQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetInOutQuery,
    GetInOutQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetInOutQuery, GetInOutQueryVariables>(
    GetInOutDocument,
    baseOptions
  );
}
export function useGetInOutLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetInOutQuery,
    GetInOutQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<GetInOutQuery, GetInOutQueryVariables>(
    GetInOutDocument,
    baseOptions
  );
}
export type GetInOutQueryHookResult = ReturnType<typeof useGetInOutQuery>;
export type GetInOutLazyQueryHookResult = ReturnType<
  typeof useGetInOutLazyQuery
>;
export type GetInOutQueryResult = ApolloReactCommon.QueryResult<
  GetInOutQuery,
  GetInOutQueryVariables
>;
export const GetChainTransactionsDocument = gql`
  query GetChainTransactions($auth: authType!) {
    getChainTransactions(auth: $auth) {
      block_id
      confirmation_count
      confirmation_height
      created_at
      fee
      id
      output_addresses
      tokens
    }
  }
`;

/**
 * __useGetChainTransactionsQuery__
 *
 * To run a query within a React component, call `useGetChainTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChainTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChainTransactionsQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetChainTransactionsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetChainTransactionsQuery,
    GetChainTransactionsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetChainTransactionsQuery,
    GetChainTransactionsQueryVariables
  >(GetChainTransactionsDocument, baseOptions);
}
export function useGetChainTransactionsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetChainTransactionsQuery,
    GetChainTransactionsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetChainTransactionsQuery,
    GetChainTransactionsQueryVariables
  >(GetChainTransactionsDocument, baseOptions);
}
export type GetChainTransactionsQueryHookResult = ReturnType<
  typeof useGetChainTransactionsQuery
>;
export type GetChainTransactionsLazyQueryHookResult = ReturnType<
  typeof useGetChainTransactionsLazyQuery
>;
export type GetChainTransactionsQueryResult = ApolloReactCommon.QueryResult<
  GetChainTransactionsQuery,
  GetChainTransactionsQueryVariables
>;
export const GetForwardsDocument = gql`
  query GetForwards($auth: authType!, $time: String) {
    getForwards(auth: $auth, time: $time) {
      forwards {
        created_at
        fee
        fee_mtokens
        incoming_channel
        incoming_alias
        incoming_color
        mtokens
        outgoing_channel
        outgoing_alias
        outgoing_color
        tokens
      }
      token
    }
  }
`;

/**
 * __useGetForwardsQuery__
 *
 * To run a query within a React component, call `useGetForwardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetForwardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetForwardsQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *      time: // value for 'time'
 *   },
 * });
 */
export function useGetForwardsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetForwardsQuery,
    GetForwardsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetForwardsQuery, GetForwardsQueryVariables>(
    GetForwardsDocument,
    baseOptions
  );
}
export function useGetForwardsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetForwardsQuery,
    GetForwardsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetForwardsQuery,
    GetForwardsQueryVariables
  >(GetForwardsDocument, baseOptions);
}
export type GetForwardsQueryHookResult = ReturnType<typeof useGetForwardsQuery>;
export type GetForwardsLazyQueryHookResult = ReturnType<
  typeof useGetForwardsLazyQuery
>;
export type GetForwardsQueryResult = ApolloReactCommon.QueryResult<
  GetForwardsQuery,
  GetForwardsQueryVariables
>;
export const GetCanConnectInfoDocument = gql`
  query GetCanConnectInfo($auth: authType!) {
    getNodeInfo(auth: $auth) {
      public_key
      uris
    }
  }
`;

/**
 * __useGetCanConnectInfoQuery__
 *
 * To run a query within a React component, call `useGetCanConnectInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCanConnectInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCanConnectInfoQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetCanConnectInfoQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetCanConnectInfoQuery,
    GetCanConnectInfoQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetCanConnectInfoQuery,
    GetCanConnectInfoQueryVariables
  >(GetCanConnectInfoDocument, baseOptions);
}
export function useGetCanConnectInfoLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetCanConnectInfoQuery,
    GetCanConnectInfoQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetCanConnectInfoQuery,
    GetCanConnectInfoQueryVariables
  >(GetCanConnectInfoDocument, baseOptions);
}
export type GetCanConnectInfoQueryHookResult = ReturnType<
  typeof useGetCanConnectInfoQuery
>;
export type GetCanConnectInfoLazyQueryHookResult = ReturnType<
  typeof useGetCanConnectInfoLazyQuery
>;
export type GetCanConnectInfoQueryResult = ApolloReactCommon.QueryResult<
  GetCanConnectInfoQuery,
  GetCanConnectInfoQueryVariables
>;
export const GetBackupsDocument = gql`
  query GetBackups($auth: authType!) {
    getBackups(auth: $auth)
  }
`;

/**
 * __useGetBackupsQuery__
 *
 * To run a query within a React component, call `useGetBackupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBackupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBackupsQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetBackupsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetBackupsQuery,
    GetBackupsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetBackupsQuery, GetBackupsQueryVariables>(
    GetBackupsDocument,
    baseOptions
  );
}
export function useGetBackupsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetBackupsQuery,
    GetBackupsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetBackupsQuery,
    GetBackupsQueryVariables
  >(GetBackupsDocument, baseOptions);
}
export type GetBackupsQueryHookResult = ReturnType<typeof useGetBackupsQuery>;
export type GetBackupsLazyQueryHookResult = ReturnType<
  typeof useGetBackupsLazyQuery
>;
export type GetBackupsQueryResult = ApolloReactCommon.QueryResult<
  GetBackupsQuery,
  GetBackupsQueryVariables
>;
export const VerifyBackupsDocument = gql`
  query VerifyBackups($auth: authType!, $backup: String!) {
    verifyBackups(auth: $auth, backup: $backup)
  }
`;

/**
 * __useVerifyBackupsQuery__
 *
 * To run a query within a React component, call `useVerifyBackupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useVerifyBackupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVerifyBackupsQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *      backup: // value for 'backup'
 *   },
 * });
 */
export function useVerifyBackupsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    VerifyBackupsQuery,
    VerifyBackupsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    VerifyBackupsQuery,
    VerifyBackupsQueryVariables
  >(VerifyBackupsDocument, baseOptions);
}
export function useVerifyBackupsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    VerifyBackupsQuery,
    VerifyBackupsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    VerifyBackupsQuery,
    VerifyBackupsQueryVariables
  >(VerifyBackupsDocument, baseOptions);
}
export type VerifyBackupsQueryHookResult = ReturnType<
  typeof useVerifyBackupsQuery
>;
export type VerifyBackupsLazyQueryHookResult = ReturnType<
  typeof useVerifyBackupsLazyQuery
>;
export type VerifyBackupsQueryResult = ApolloReactCommon.QueryResult<
  VerifyBackupsQuery,
  VerifyBackupsQueryVariables
>;
export const SignMessageDocument = gql`
  query SignMessage($auth: authType!, $message: String!) {
    signMessage(auth: $auth, message: $message)
  }
`;

/**
 * __useSignMessageQuery__
 *
 * To run a query within a React component, call `useSignMessageQuery` and pass it any options that fit your needs.
 * When your component renders, `useSignMessageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSignMessageQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *      message: // value for 'message'
 *   },
 * });
 */
export function useSignMessageQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    SignMessageQuery,
    SignMessageQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<SignMessageQuery, SignMessageQueryVariables>(
    SignMessageDocument,
    baseOptions
  );
}
export function useSignMessageLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    SignMessageQuery,
    SignMessageQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    SignMessageQuery,
    SignMessageQueryVariables
  >(SignMessageDocument, baseOptions);
}
export type SignMessageQueryHookResult = ReturnType<typeof useSignMessageQuery>;
export type SignMessageLazyQueryHookResult = ReturnType<
  typeof useSignMessageLazyQuery
>;
export type SignMessageQueryResult = ApolloReactCommon.QueryResult<
  SignMessageQuery,
  SignMessageQueryVariables
>;
export const VerifyMessageDocument = gql`
  query VerifyMessage(
    $auth: authType!
    $message: String!
    $signature: String!
  ) {
    verifyMessage(auth: $auth, message: $message, signature: $signature)
  }
`;

/**
 * __useVerifyMessageQuery__
 *
 * To run a query within a React component, call `useVerifyMessageQuery` and pass it any options that fit your needs.
 * When your component renders, `useVerifyMessageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVerifyMessageQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *      message: // value for 'message'
 *      signature: // value for 'signature'
 *   },
 * });
 */
export function useVerifyMessageQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    VerifyMessageQuery,
    VerifyMessageQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    VerifyMessageQuery,
    VerifyMessageQueryVariables
  >(VerifyMessageDocument, baseOptions);
}
export function useVerifyMessageLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    VerifyMessageQuery,
    VerifyMessageQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    VerifyMessageQuery,
    VerifyMessageQueryVariables
  >(VerifyMessageDocument, baseOptions);
}
export type VerifyMessageQueryHookResult = ReturnType<
  typeof useVerifyMessageQuery
>;
export type VerifyMessageLazyQueryHookResult = ReturnType<
  typeof useVerifyMessageLazyQuery
>;
export type VerifyMessageQueryResult = ApolloReactCommon.QueryResult<
  VerifyMessageQuery,
  VerifyMessageQueryVariables
>;
export const RecoverFundsDocument = gql`
  query RecoverFunds($auth: authType!, $backup: String!) {
    recoverFunds(auth: $auth, backup: $backup)
  }
`;

/**
 * __useRecoverFundsQuery__
 *
 * To run a query within a React component, call `useRecoverFundsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecoverFundsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecoverFundsQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *      backup: // value for 'backup'
 *   },
 * });
 */
export function useRecoverFundsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    RecoverFundsQuery,
    RecoverFundsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    RecoverFundsQuery,
    RecoverFundsQueryVariables
  >(RecoverFundsDocument, baseOptions);
}
export function useRecoverFundsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    RecoverFundsQuery,
    RecoverFundsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    RecoverFundsQuery,
    RecoverFundsQueryVariables
  >(RecoverFundsDocument, baseOptions);
}
export type RecoverFundsQueryHookResult = ReturnType<
  typeof useRecoverFundsQuery
>;
export type RecoverFundsLazyQueryHookResult = ReturnType<
  typeof useRecoverFundsLazyQuery
>;
export type RecoverFundsQueryResult = ApolloReactCommon.QueryResult<
  RecoverFundsQuery,
  RecoverFundsQueryVariables
>;
export const ChannelFeesDocument = gql`
  query ChannelFees($auth: authType!) {
    getChannelFees(auth: $auth) {
      alias
      color
      baseFee
      feeRate
      transactionId
      transactionVout
      public_key
    }
  }
`;

/**
 * __useChannelFeesQuery__
 *
 * To run a query within a React component, call `useChannelFeesQuery` and pass it any options that fit your needs.
 * When your component renders, `useChannelFeesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChannelFeesQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useChannelFeesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ChannelFeesQuery,
    ChannelFeesQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<ChannelFeesQuery, ChannelFeesQueryVariables>(
    ChannelFeesDocument,
    baseOptions
  );
}
export function useChannelFeesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ChannelFeesQuery,
    ChannelFeesQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    ChannelFeesQuery,
    ChannelFeesQueryVariables
  >(ChannelFeesDocument, baseOptions);
}
export type ChannelFeesQueryHookResult = ReturnType<typeof useChannelFeesQuery>;
export type ChannelFeesLazyQueryHookResult = ReturnType<
  typeof useChannelFeesLazyQuery
>;
export type ChannelFeesQueryResult = ApolloReactCommon.QueryResult<
  ChannelFeesQuery,
  ChannelFeesQueryVariables
>;
export const GetRoutesDocument = gql`
  query GetRoutes(
    $auth: authType!
    $outgoing: String!
    $incoming: String!
    $tokens: Int!
    $maxFee: Int
  ) {
    getRoutes(
      auth: $auth
      outgoing: $outgoing
      incoming: $incoming
      tokens: $tokens
      maxFee: $maxFee
    )
  }
`;

/**
 * __useGetRoutesQuery__
 *
 * To run a query within a React component, call `useGetRoutesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoutesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoutesQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *      outgoing: // value for 'outgoing'
 *      incoming: // value for 'incoming'
 *      tokens: // value for 'tokens'
 *      maxFee: // value for 'maxFee'
 *   },
 * });
 */
export function useGetRoutesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetRoutesQuery,
    GetRoutesQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetRoutesQuery, GetRoutesQueryVariables>(
    GetRoutesDocument,
    baseOptions
  );
}
export function useGetRoutesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetRoutesQuery,
    GetRoutesQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<GetRoutesQuery, GetRoutesQueryVariables>(
    GetRoutesDocument,
    baseOptions
  );
}
export type GetRoutesQueryHookResult = ReturnType<typeof useGetRoutesQuery>;
export type GetRoutesLazyQueryHookResult = ReturnType<
  typeof useGetRoutesLazyQuery
>;
export type GetRoutesQueryResult = ApolloReactCommon.QueryResult<
  GetRoutesQuery,
  GetRoutesQueryVariables
>;
export const GetPeersDocument = gql`
  query GetPeers($auth: authType!) {
    getPeers(auth: $auth) {
      bytes_received
      bytes_sent
      is_inbound
      is_sync_peer
      ping_time
      public_key
      socket
      tokens_received
      tokens_sent
      partner_node_info {
        alias
        capacity
        channel_count
        color
        updated_at
      }
    }
  }
`;

/**
 * __useGetPeersQuery__
 *
 * To run a query within a React component, call `useGetPeersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPeersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPeersQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetPeersQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetPeersQuery,
    GetPeersQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetPeersQuery, GetPeersQueryVariables>(
    GetPeersDocument,
    baseOptions
  );
}
export function useGetPeersLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetPeersQuery,
    GetPeersQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<GetPeersQuery, GetPeersQueryVariables>(
    GetPeersDocument,
    baseOptions
  );
}
export type GetPeersQueryHookResult = ReturnType<typeof useGetPeersQuery>;
export type GetPeersLazyQueryHookResult = ReturnType<
  typeof useGetPeersLazyQuery
>;
export type GetPeersQueryResult = ApolloReactCommon.QueryResult<
  GetPeersQuery,
  GetPeersQueryVariables
>;
export const GetUtxosDocument = gql`
  query GetUtxos($auth: authType!) {
    getUtxos(auth: $auth) {
      address
      address_format
      confirmation_count
      output_script
      tokens
      transaction_id
      transaction_vout
    }
  }
`;

/**
 * __useGetUtxosQuery__
 *
 * To run a query within a React component, call `useGetUtxosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUtxosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUtxosQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetUtxosQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetUtxosQuery,
    GetUtxosQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetUtxosQuery, GetUtxosQueryVariables>(
    GetUtxosDocument,
    baseOptions
  );
}
export function useGetUtxosLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetUtxosQuery,
    GetUtxosQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<GetUtxosQuery, GetUtxosQueryVariables>(
    GetUtxosDocument,
    baseOptions
  );
}
export type GetUtxosQueryHookResult = ReturnType<typeof useGetUtxosQuery>;
export type GetUtxosLazyQueryHookResult = ReturnType<
  typeof useGetUtxosLazyQuery
>;
export type GetUtxosQueryResult = ApolloReactCommon.QueryResult<
  GetUtxosQuery,
  GetUtxosQueryVariables
>;
export const GetMessagesDocument = gql`
  query GetMessages(
    $auth: authType!
    $initialize: Boolean
    $lastMessage: String
  ) {
    getMessages(
      auth: $auth
      initialize: $initialize
      lastMessage: $lastMessage
    ) {
      token
      messages {
        date
        contentType
        alias
        message
        id
        sender
      }
    }
  }
`;

/**
 * __useGetMessagesQuery__
 *
 * To run a query within a React component, call `useGetMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessagesQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *      initialize: // value for 'initialize'
 *      lastMessage: // value for 'lastMessage'
 *   },
 * });
 */
export function useGetMessagesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetMessagesQuery,
    GetMessagesQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetMessagesQuery, GetMessagesQueryVariables>(
    GetMessagesDocument,
    baseOptions
  );
}
export function useGetMessagesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetMessagesQuery,
    GetMessagesQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetMessagesQuery,
    GetMessagesQueryVariables
  >(GetMessagesDocument, baseOptions);
}
export type GetMessagesQueryHookResult = ReturnType<typeof useGetMessagesQuery>;
export type GetMessagesLazyQueryHookResult = ReturnType<
  typeof useGetMessagesLazyQuery
>;
export type GetMessagesQueryResult = ApolloReactCommon.QueryResult<
  GetMessagesQuery,
  GetMessagesQueryVariables
>;
