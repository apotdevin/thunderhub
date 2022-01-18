import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetNetworkInfoQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetNetworkInfoQuery = {
  __typename?: 'Query';
  getNetworkInfo: {
    __typename?: 'NetworkInfo';
    averageChannelSize: number;
    channelCount: number;
    maxChannelSize: number;
    medianChannelSize: number;
    minChannelSize: number;
    nodeCount: number;
    notRecentlyUpdatedPolicyCount: number;
    totalCapacity: number;
  };
};

export const GetNetworkInfoDocument = gql`
  query GetNetworkInfo {
    getNetworkInfo {
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
 *   },
 * });
 */
export function useGetNetworkInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetNetworkInfoQuery,
    GetNetworkInfoQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetNetworkInfoQuery, GetNetworkInfoQueryVariables>(
    GetNetworkInfoDocument,
    options
  );
}
export function useGetNetworkInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetNetworkInfoQuery,
    GetNetworkInfoQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetNetworkInfoQuery, GetNetworkInfoQueryVariables>(
    GetNetworkInfoDocument,
    options
  );
}
export type GetNetworkInfoQueryHookResult = ReturnType<
  typeof useGetNetworkInfoQuery
>;
export type GetNetworkInfoLazyQueryHookResult = ReturnType<
  typeof useGetNetworkInfoLazyQuery
>;
export type GetNetworkInfoQueryResult = Apollo.QueryResult<
  GetNetworkInfoQuery,
  GetNetworkInfoQueryVariables
>;
