import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../types';

export type GetNetworkInfoQueryVariables = {
  auth: Types.AuthType;
};

export type GetNetworkInfoQuery = { __typename?: 'Query' } & {
  getNetworkInfo?: Types.Maybe<
    { __typename?: 'networkInfoType' } & Pick<
      Types.NetworkInfoType,
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
  auth: Types.AuthType;
};

export type GetCanConnectQuery = { __typename?: 'Query' } & {
  getNodeInfo?: Types.Maybe<
    { __typename?: 'nodeInfoType' } & Pick<
      Types.NodeInfoType,
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
  auth: Types.AuthType;
};

export type GetCanAdminQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'adminCheck'
>;

export type GetNodeInfoQueryVariables = {
  auth: Types.AuthType;
};

export type GetNodeInfoQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'getChainBalance' | 'getPendingChainBalance'
> & {
    getNodeInfo?: Types.Maybe<
      { __typename?: 'nodeInfoType' } & Pick<
        Types.NodeInfoType,
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
    getChannelBalance?: Types.Maybe<
      { __typename?: 'channelBalanceType' } & Pick<
        Types.ChannelBalanceType,
        'confirmedBalance' | 'pendingBalance'
      >
    >;
  };

export type GetChannelAmountInfoQueryVariables = {
  auth: Types.AuthType;
};

export type GetChannelAmountInfoQuery = { __typename?: 'Query' } & {
  getNodeInfo?: Types.Maybe<
    { __typename?: 'nodeInfoType' } & Pick<
      Types.NodeInfoType,
      | 'active_channels_count'
      | 'closed_channels_count'
      | 'pending_channels_count'
    >
  >;
};

export type GetChannelsQueryVariables = {
  auth: Types.AuthType;
  active?: Types.Maybe<Types.Scalars['Boolean']>;
};

export type GetChannelsQuery = { __typename?: 'Query' } & {
  getChannels?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'channelType' } & Pick<
          Types.ChannelType,
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
            partner_node_info?: Types.Maybe<
              { __typename?: 'partnerNodeType' } & Pick<
                Types.PartnerNodeType,
                'alias' | 'capacity' | 'channel_count' | 'color' | 'updated_at'
              >
            >;
          }
      >
    >
  >;
};

export type GetNodeQueryVariables = {
  auth: Types.AuthType;
  publicKey: Types.Scalars['String'];
  withoutChannels?: Types.Maybe<Types.Scalars['Boolean']>;
};

export type GetNodeQuery = { __typename?: 'Query' } & {
  getNode?: Types.Maybe<
    { __typename?: 'partnerNodeType' } & Pick<
      Types.PartnerNodeType,
      'alias' | 'capacity' | 'channel_count' | 'color' | 'updated_at'
    >
  >;
};

export type DecodeRequestQueryVariables = {
  auth: Types.AuthType;
  request: Types.Scalars['String'];
};

export type DecodeRequestQuery = { __typename?: 'Query' } & {
  decodeRequest?: Types.Maybe<
    { __typename?: 'decodeType' } & Pick<
      Types.DecodeType,
      | 'chain_address'
      | 'cltv_delta'
      | 'description'
      | 'description_hash'
      | 'destination'
      | 'expires_at'
      | 'id'
      | 'tokens'
    > & {
        routes?: Types.Maybe<
          Array<
            Types.Maybe<
              { __typename?: 'DecodeRoutesType' } & Pick<
                Types.DecodeRoutesType,
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
  auth: Types.AuthType;
};

export type GetPendingChannelsQuery = { __typename?: 'Query' } & {
  getPendingChannels?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'pendingChannelType' } & Pick<
          Types.PendingChannelType,
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
            partner_node_info?: Types.Maybe<
              { __typename?: 'partnerNodeType' } & Pick<
                Types.PartnerNodeType,
                'alias' | 'capacity' | 'channel_count' | 'color' | 'updated_at'
              >
            >;
          }
      >
    >
  >;
};

export type GetClosedChannelsQueryVariables = {
  auth: Types.AuthType;
};

export type GetClosedChannelsQuery = { __typename?: 'Query' } & {
  getClosedChannels?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'closedChannelType' } & Pick<
          Types.ClosedChannelType,
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
            partner_node_info?: Types.Maybe<
              { __typename?: 'partnerNodeType' } & Pick<
                Types.PartnerNodeType,
                'alias' | 'capacity' | 'channel_count' | 'color' | 'updated_at'
              >
            >;
          }
      >
    >
  >;
};

export type GetResumeQueryVariables = {
  auth: Types.AuthType;
  token?: Types.Maybe<Types.Scalars['String']>;
};

export type GetResumeQuery = { __typename?: 'Query' } & {
  getResume?: Types.Maybe<
    { __typename?: 'getResumeType' } & Pick<
      Types.GetResumeType,
      'token' | 'resume'
    >
  >;
};

export type GetBitcoinPriceQueryVariables = {};

export type GetBitcoinPriceQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'getBitcoinPrice'
>;

export type GetBitcoinFeesQueryVariables = {};

export type GetBitcoinFeesQuery = { __typename?: 'Query' } & {
  getBitcoinFees?: Types.Maybe<
    { __typename?: 'bitcoinFeeType' } & Pick<
      Types.BitcoinFeeType,
      'fast' | 'halfHour' | 'hour'
    >
  >;
};

export type GetForwardReportQueryVariables = {
  time?: Types.Maybe<Types.Scalars['String']>;
  auth: Types.AuthType;
};

export type GetForwardReportQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'getForwardReport'
>;

export type GetLiquidReportQueryVariables = {
  auth: Types.AuthType;
};

export type GetLiquidReportQuery = { __typename?: 'Query' } & {
  getChannelReport?: Types.Maybe<
    { __typename?: 'channelReportType' } & Pick<
      Types.ChannelReportType,
      'local' | 'remote' | 'maxIn' | 'maxOut'
    >
  >;
};

export type GetForwardChannelsReportQueryVariables = {
  time?: Types.Maybe<Types.Scalars['String']>;
  order?: Types.Maybe<Types.Scalars['String']>;
  type?: Types.Maybe<Types.Scalars['String']>;
  auth: Types.AuthType;
};

export type GetForwardChannelsReportQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'getForwardChannelsReport'
>;

export type GetInOutQueryVariables = {
  auth: Types.AuthType;
  time?: Types.Maybe<Types.Scalars['String']>;
};

export type GetInOutQuery = { __typename?: 'Query' } & {
  getInOut?: Types.Maybe<
    { __typename?: 'InOutType' } & Pick<
      Types.InOutType,
      'invoices' | 'payments' | 'confirmedInvoices' | 'unConfirmedInvoices'
    >
  >;
};

export type GetChainTransactionsQueryVariables = {
  auth: Types.AuthType;
};

export type GetChainTransactionsQuery = { __typename?: 'Query' } & {
  getChainTransactions?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'getTransactionsType' } & Pick<
          Types.GetTransactionsType,
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
  auth: Types.AuthType;
  time?: Types.Maybe<Types.Scalars['String']>;
};

export type GetForwardsQuery = { __typename?: 'Query' } & {
  getForwards?: Types.Maybe<
    { __typename?: 'getForwardType' } & Pick<Types.GetForwardType, 'token'> & {
        forwards?: Types.Maybe<
          Array<
            Types.Maybe<
              { __typename?: 'forwardType' } & Pick<
                Types.ForwardType,
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
  auth: Types.AuthType;
};

export type GetCanConnectInfoQuery = { __typename?: 'Query' } & {
  getNodeInfo?: Types.Maybe<
    { __typename?: 'nodeInfoType' } & Pick<
      Types.NodeInfoType,
      'public_key' | 'uris'
    >
  >;
};

export type GetBackupsQueryVariables = {
  auth: Types.AuthType;
};

export type GetBackupsQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'getBackups'
>;

export type VerifyBackupsQueryVariables = {
  auth: Types.AuthType;
  backup: Types.Scalars['String'];
};

export type VerifyBackupsQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'verifyBackups'
>;

export type SignMessageQueryVariables = {
  auth: Types.AuthType;
  message: Types.Scalars['String'];
};

export type SignMessageQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'signMessage'
>;

export type VerifyMessageQueryVariables = {
  auth: Types.AuthType;
  message: Types.Scalars['String'];
  signature: Types.Scalars['String'];
};

export type VerifyMessageQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'verifyMessage'
>;

export type RecoverFundsQueryVariables = {
  auth: Types.AuthType;
  backup: Types.Scalars['String'];
};

export type RecoverFundsQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'recoverFunds'
>;

export type ChannelFeesQueryVariables = {
  auth: Types.AuthType;
};

export type ChannelFeesQuery = { __typename?: 'Query' } & {
  getChannelFees?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'channelFeeType' } & Pick<
          Types.ChannelFeeType,
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
  auth: Types.AuthType;
  outgoing: Types.Scalars['String'];
  incoming: Types.Scalars['String'];
  tokens: Types.Scalars['Int'];
  maxFee?: Types.Maybe<Types.Scalars['Int']>;
};

export type GetRoutesQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'getRoutes'
>;

export type GetPeersQueryVariables = {
  auth: Types.AuthType;
};

export type GetPeersQuery = { __typename?: 'Query' } & {
  getPeers?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'peerType' } & Pick<
          Types.PeerType,
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
            partner_node_info?: Types.Maybe<
              { __typename?: 'partnerNodeType' } & Pick<
                Types.PartnerNodeType,
                'alias' | 'capacity' | 'channel_count' | 'color' | 'updated_at'
              >
            >;
          }
      >
    >
  >;
};

export type GetUtxosQueryVariables = {
  auth: Types.AuthType;
};

export type GetUtxosQuery = { __typename?: 'Query' } & {
  getUtxos?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'getUtxosType' } & Pick<
          Types.GetUtxosType,
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
  auth: Types.AuthType;
  initialize?: Types.Maybe<Types.Scalars['Boolean']>;
  lastMessage?: Types.Maybe<Types.Scalars['String']>;
};

export type GetMessagesQuery = { __typename?: 'Query' } & {
  getMessages?: Types.Maybe<
    { __typename?: 'getMessagesType' } & Pick<
      Types.GetMessagesType,
      'token'
    > & {
        messages?: Types.Maybe<
          Array<
            Types.Maybe<
              { __typename?: 'messagesType' } & Pick<
                Types.MessagesType,
                | 'date'
                | 'contentType'
                | 'alias'
                | 'message'
                | 'id'
                | 'sender'
                | 'verified'
                | 'tokens'
              >
            >
          >
        >;
      }
  >;
};

export type GetWalletInfoQueryVariables = {
  auth: Types.AuthType;
};

export type GetWalletInfoQuery = { __typename?: 'Query' } & {
  getWalletInfo?: Types.Maybe<
    { __typename?: 'walletInfoType' } & Pick<
      Types.WalletInfoType,
      | 'build_tags'
      | 'commit_hash'
      | 'is_autopilotrpc_enabled'
      | 'is_chainrpc_enabled'
      | 'is_invoicesrpc_enabled'
      | 'is_signrpc_enabled'
      | 'is_walletrpc_enabled'
      | 'is_watchtowerrpc_enabled'
      | 'is_wtclientrpc_enabled'
    >
  >;
};

export type GetAuthTokenQueryVariables = {
  cookie?: Types.Maybe<Types.Scalars['String']>;
};

export type GetAuthTokenQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'getAuthToken'
>;

export type GetServerAccountsQueryVariables = {};

export type GetServerAccountsQuery = { __typename?: 'Query' } & {
  getServerAccounts?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'serverAccountType' } & Pick<
          Types.ServerAccountType,
          'name' | 'id' | 'loggedIn'
        >
      >
    >
  >;
};

export type GetSessionTokenQueryVariables = {
  id: Types.Scalars['String'];
  password: Types.Scalars['String'];
};

export type GetSessionTokenQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'getSessionToken'
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
        verified
        tokens
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
export const GetWalletInfoDocument = gql`
  query GetWalletInfo($auth: authType!) {
    getWalletInfo(auth: $auth) {
      build_tags
      commit_hash
      is_autopilotrpc_enabled
      is_chainrpc_enabled
      is_invoicesrpc_enabled
      is_signrpc_enabled
      is_walletrpc_enabled
      is_watchtowerrpc_enabled
      is_wtclientrpc_enabled
    }
  }
`;

/**
 * __useGetWalletInfoQuery__
 *
 * To run a query within a React component, call `useGetWalletInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWalletInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWalletInfoQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetWalletInfoQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetWalletInfoQuery,
    GetWalletInfoQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetWalletInfoQuery,
    GetWalletInfoQueryVariables
  >(GetWalletInfoDocument, baseOptions);
}
export function useGetWalletInfoLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetWalletInfoQuery,
    GetWalletInfoQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetWalletInfoQuery,
    GetWalletInfoQueryVariables
  >(GetWalletInfoDocument, baseOptions);
}
export type GetWalletInfoQueryHookResult = ReturnType<
  typeof useGetWalletInfoQuery
>;
export type GetWalletInfoLazyQueryHookResult = ReturnType<
  typeof useGetWalletInfoLazyQuery
>;
export type GetWalletInfoQueryResult = ApolloReactCommon.QueryResult<
  GetWalletInfoQuery,
  GetWalletInfoQueryVariables
>;
export const GetAuthTokenDocument = gql`
  query GetAuthToken($cookie: String) {
    getAuthToken(cookie: $cookie)
  }
`;

/**
 * __useGetAuthTokenQuery__
 *
 * To run a query within a React component, call `useGetAuthTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAuthTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAuthTokenQuery({
 *   variables: {
 *      cookie: // value for 'cookie'
 *   },
 * });
 */
export function useGetAuthTokenQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetAuthTokenQuery,
    GetAuthTokenQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetAuthTokenQuery,
    GetAuthTokenQueryVariables
  >(GetAuthTokenDocument, baseOptions);
}
export function useGetAuthTokenLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetAuthTokenQuery,
    GetAuthTokenQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetAuthTokenQuery,
    GetAuthTokenQueryVariables
  >(GetAuthTokenDocument, baseOptions);
}
export type GetAuthTokenQueryHookResult = ReturnType<
  typeof useGetAuthTokenQuery
>;
export type GetAuthTokenLazyQueryHookResult = ReturnType<
  typeof useGetAuthTokenLazyQuery
>;
export type GetAuthTokenQueryResult = ApolloReactCommon.QueryResult<
  GetAuthTokenQuery,
  GetAuthTokenQueryVariables
>;
export const GetServerAccountsDocument = gql`
  query GetServerAccounts {
    getServerAccounts {
      name
      id
      loggedIn
    }
  }
`;

/**
 * __useGetServerAccountsQuery__
 *
 * To run a query within a React component, call `useGetServerAccountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetServerAccountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetServerAccountsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetServerAccountsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetServerAccountsQuery,
    GetServerAccountsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetServerAccountsQuery,
    GetServerAccountsQueryVariables
  >(GetServerAccountsDocument, baseOptions);
}
export function useGetServerAccountsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetServerAccountsQuery,
    GetServerAccountsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetServerAccountsQuery,
    GetServerAccountsQueryVariables
  >(GetServerAccountsDocument, baseOptions);
}
export type GetServerAccountsQueryHookResult = ReturnType<
  typeof useGetServerAccountsQuery
>;
export type GetServerAccountsLazyQueryHookResult = ReturnType<
  typeof useGetServerAccountsLazyQuery
>;
export type GetServerAccountsQueryResult = ApolloReactCommon.QueryResult<
  GetServerAccountsQuery,
  GetServerAccountsQueryVariables
>;
export const GetSessionTokenDocument = gql`
  query GetSessionToken($id: String!, $password: String!) {
    getSessionToken(id: $id, password: $password)
  }
`;

/**
 * __useGetSessionTokenQuery__
 *
 * To run a query within a React component, call `useGetSessionTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSessionTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSessionTokenQuery({
 *   variables: {
 *      id: // value for 'id'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useGetSessionTokenQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetSessionTokenQuery,
    GetSessionTokenQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetSessionTokenQuery,
    GetSessionTokenQueryVariables
  >(GetSessionTokenDocument, baseOptions);
}
export function useGetSessionTokenLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetSessionTokenQuery,
    GetSessionTokenQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetSessionTokenQuery,
    GetSessionTokenQueryVariables
  >(GetSessionTokenDocument, baseOptions);
}
export type GetSessionTokenQueryHookResult = ReturnType<
  typeof useGetSessionTokenQuery
>;
export type GetSessionTokenLazyQueryHookResult = ReturnType<
  typeof useGetSessionTokenLazyQuery
>;
export type GetSessionTokenQueryResult = ApolloReactCommon.QueryResult<
  GetSessionTokenQuery,
  GetSessionTokenQueryVariables
>;
