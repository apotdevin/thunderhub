import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type GetCanConnectQueryVariables = Types.Exact<{
  auth: Types.AuthType;
}>;

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

export type GetNodeInfoQueryVariables = Types.Exact<{
  auth: Types.AuthType;
}>;

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

export type GetChannelAmountInfoQueryVariables = Types.Exact<{
  auth: Types.AuthType;
}>;

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

export type GetCanConnectInfoQueryVariables = Types.Exact<{
  auth: Types.AuthType;
}>;

export type GetCanConnectInfoQuery = { __typename?: 'Query' } & {
  getNodeInfo?: Types.Maybe<
    { __typename?: 'nodeInfoType' } & Pick<
      Types.NodeInfoType,
      'public_key' | 'uris'
    >
  >;
};

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
