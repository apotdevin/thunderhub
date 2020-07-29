import {
  gql,
  QueryHookOptions,
  useQuery,
  useLazyQuery,
  QueryResult,
  LazyQueryHookOptions,
} from '@apollo/client';
import * as Types from '../../types';

export type GetNetworkInfoQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

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
  baseOptions?: QueryHookOptions<
    GetNetworkInfoQuery,
    GetNetworkInfoQueryVariables
  >
) {
  return useQuery<GetNetworkInfoQuery, GetNetworkInfoQueryVariables>(
    GetNetworkInfoDocument,
    baseOptions
  );
}
export function useGetNetworkInfoLazyQuery(
  baseOptions?: LazyQueryHookOptions<
    GetNetworkInfoQuery,
    GetNetworkInfoQueryVariables
  >
) {
  return useLazyQuery<GetNetworkInfoQuery, GetNetworkInfoQueryVariables>(
    GetNetworkInfoDocument,
    baseOptions
  );
}
export type GetNetworkInfoQueryHookResult = ReturnType<
  typeof useGetNetworkInfoQuery
>;
export type GetNetworkInfoLazyQueryHookResult = ReturnType<
  typeof useGetNetworkInfoLazyQuery
>;
export type GetNetworkInfoQueryResult = QueryResult<
  GetNetworkInfoQuery,
  GetNetworkInfoQueryVariables
>;
