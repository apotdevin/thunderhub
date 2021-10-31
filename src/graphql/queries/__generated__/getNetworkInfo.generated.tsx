/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type GetNetworkInfoQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetNetworkInfoQuery = { __typename?: 'Query', getNetworkInfo?: { __typename?: 'networkInfoType', averageChannelSize?: string | null | undefined, channelCount?: number | null | undefined, maxChannelSize?: number | null | undefined, medianChannelSize?: number | null | undefined, minChannelSize?: number | null | undefined, nodeCount?: number | null | undefined, notRecentlyUpdatedPolicyCount?: number | null | undefined, totalCapacity?: string | null | undefined } | null | undefined };


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
export function useGetNetworkInfoQuery(baseOptions?: Apollo.QueryHookOptions<GetNetworkInfoQuery, GetNetworkInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNetworkInfoQuery, GetNetworkInfoQueryVariables>(GetNetworkInfoDocument, options);
      }
export function useGetNetworkInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNetworkInfoQuery, GetNetworkInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNetworkInfoQuery, GetNetworkInfoQueryVariables>(GetNetworkInfoDocument, options);
        }
export type GetNetworkInfoQueryHookResult = ReturnType<typeof useGetNetworkInfoQuery>;
export type GetNetworkInfoLazyQueryHookResult = ReturnType<typeof useGetNetworkInfoLazyQuery>;
export type GetNetworkInfoQueryResult = Apollo.QueryResult<GetNetworkInfoQuery, GetNetworkInfoQueryVariables>;