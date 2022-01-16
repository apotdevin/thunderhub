import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetNodeInfoQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetNodeInfoQuery = {
  __typename?: 'Query';
  getNodeInfo: {
    __typename?: 'NodeInfo';
    alias: string;
    public_key: string;
    uris: Array<string>;
    chains: Array<string>;
    color: string;
    is_synced_to_chain: boolean;
    peers_count: number;
    version: string;
    active_channels_count: number;
    closed_channels_count: number;
    pending_channels_count: number;
  };
};

export const GetNodeInfoDocument = gql`
  query GetNodeInfo {
    getNodeInfo {
      alias
      public_key
      uris
      chains
      color
      is_synced_to_chain
      peers_count
      version
      active_channels_count
      closed_channels_count
      pending_channels_count
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
  baseOptions?: Apollo.QueryHookOptions<
    GetNodeInfoQuery,
    GetNodeInfoQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetNodeInfoQuery, GetNodeInfoQueryVariables>(
    GetNodeInfoDocument,
    options
  );
}
export function useGetNodeInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetNodeInfoQuery,
    GetNodeInfoQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetNodeInfoQuery, GetNodeInfoQueryVariables>(
    GetNodeInfoDocument,
    options
  );
}
export type GetNodeInfoQueryHookResult = ReturnType<typeof useGetNodeInfoQuery>;
export type GetNodeInfoLazyQueryHookResult = ReturnType<
  typeof useGetNodeInfoLazyQuery
>;
export type GetNodeInfoQueryResult = Apollo.QueryResult<
  GetNodeInfoQuery,
  GetNodeInfoQueryVariables
>;
