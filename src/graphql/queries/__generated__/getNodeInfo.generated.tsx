import {
  gql,
  QueryHookOptions,
  useQuery,
  useLazyQuery,
  QueryResult,
  LazyQueryHookOptions,
} from '@apollo/client';
import * as Types from '../../types';

export type GetCanConnectQueryVariables = Types.Exact<{ [key: string]: never }>;

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

export type GetNodeInfoQueryVariables = Types.Exact<{ [key: string]: never }>;

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
  [key: string]: never;
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
  [key: string]: never;
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
  query GetCanConnect {
    getNodeInfo {
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
 *   },
 * });
 */
export function useGetCanConnectQuery(
  baseOptions?: QueryHookOptions<
    GetCanConnectQuery,
    GetCanConnectQueryVariables
  >
) {
  return useQuery<GetCanConnectQuery, GetCanConnectQueryVariables>(
    GetCanConnectDocument,
    baseOptions
  );
}
export function useGetCanConnectLazyQuery(
  baseOptions?: LazyQueryHookOptions<
    GetCanConnectQuery,
    GetCanConnectQueryVariables
  >
) {
  return useLazyQuery<GetCanConnectQuery, GetCanConnectQueryVariables>(
    GetCanConnectDocument,
    baseOptions
  );
}
export type GetCanConnectQueryHookResult = ReturnType<
  typeof useGetCanConnectQuery
>;
export type GetCanConnectLazyQueryHookResult = ReturnType<
  typeof useGetCanConnectLazyQuery
>;
export type GetCanConnectQueryResult = QueryResult<
  GetCanConnectQuery,
  GetCanConnectQueryVariables
>;
export const GetNodeInfoDocument = gql`
  query GetNodeInfo {
    getNodeInfo {
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
    getChainBalance
    getPendingChainBalance
    getChannelBalance {
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
 *   },
 * });
 */
export function useGetNodeInfoQuery(
  baseOptions?: QueryHookOptions<GetNodeInfoQuery, GetNodeInfoQueryVariables>
) {
  return useQuery<GetNodeInfoQuery, GetNodeInfoQueryVariables>(
    GetNodeInfoDocument,
    baseOptions
  );
}
export function useGetNodeInfoLazyQuery(
  baseOptions?: LazyQueryHookOptions<
    GetNodeInfoQuery,
    GetNodeInfoQueryVariables
  >
) {
  return useLazyQuery<GetNodeInfoQuery, GetNodeInfoQueryVariables>(
    GetNodeInfoDocument,
    baseOptions
  );
}
export type GetNodeInfoQueryHookResult = ReturnType<typeof useGetNodeInfoQuery>;
export type GetNodeInfoLazyQueryHookResult = ReturnType<
  typeof useGetNodeInfoLazyQuery
>;
export type GetNodeInfoQueryResult = QueryResult<
  GetNodeInfoQuery,
  GetNodeInfoQueryVariables
>;
export const GetChannelAmountInfoDocument = gql`
  query GetChannelAmountInfo {
    getNodeInfo {
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
 *   },
 * });
 */
export function useGetChannelAmountInfoQuery(
  baseOptions?: QueryHookOptions<
    GetChannelAmountInfoQuery,
    GetChannelAmountInfoQueryVariables
  >
) {
  return useQuery<
    GetChannelAmountInfoQuery,
    GetChannelAmountInfoQueryVariables
  >(GetChannelAmountInfoDocument, baseOptions);
}
export function useGetChannelAmountInfoLazyQuery(
  baseOptions?: LazyQueryHookOptions<
    GetChannelAmountInfoQuery,
    GetChannelAmountInfoQueryVariables
  >
) {
  return useLazyQuery<
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
export type GetChannelAmountInfoQueryResult = QueryResult<
  GetChannelAmountInfoQuery,
  GetChannelAmountInfoQueryVariables
>;
export const GetCanConnectInfoDocument = gql`
  query GetCanConnectInfo {
    getNodeInfo {
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
 *   },
 * });
 */
export function useGetCanConnectInfoQuery(
  baseOptions?: QueryHookOptions<
    GetCanConnectInfoQuery,
    GetCanConnectInfoQueryVariables
  >
) {
  return useQuery<GetCanConnectInfoQuery, GetCanConnectInfoQueryVariables>(
    GetCanConnectInfoDocument,
    baseOptions
  );
}
export function useGetCanConnectInfoLazyQuery(
  baseOptions?: LazyQueryHookOptions<
    GetCanConnectInfoQuery,
    GetCanConnectInfoQueryVariables
  >
) {
  return useLazyQuery<GetCanConnectInfoQuery, GetCanConnectInfoQueryVariables>(
    GetCanConnectInfoDocument,
    baseOptions
  );
}
export type GetCanConnectInfoQueryHookResult = ReturnType<
  typeof useGetCanConnectInfoQuery
>;
export type GetCanConnectInfoLazyQueryHookResult = ReturnType<
  typeof useGetCanConnectInfoLazyQuery
>;
export type GetCanConnectInfoQueryResult = QueryResult<
  GetCanConnectInfoQuery,
  GetCanConnectInfoQueryVariables
>;
