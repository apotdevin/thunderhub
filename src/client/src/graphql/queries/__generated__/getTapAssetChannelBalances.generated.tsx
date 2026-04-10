import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetTapAssetChannelBalancesQueryVariables = Types.Exact<{
  peerPubkey?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type GetTapAssetChannelBalancesQuery = {
  __typename?: 'Query';
  getTapAssetChannelBalances: Array<{
    __typename?: 'TapAssetChannelBalance';
    channelPoint: string;
    partnerPublicKey: string;
    assetId: string;
    localBalance: string;
    remoteBalance: string;
    capacity: string;
  }>;
};

export const GetTapAssetChannelBalancesDocument = gql`
  query GetTapAssetChannelBalances($peerPubkey: String) {
    getTapAssetChannelBalances(peerPubkey: $peerPubkey) {
      channelPoint
      partnerPublicKey
      assetId
      localBalance
      remoteBalance
      capacity
    }
  }
`;

/**
 * __useGetTapAssetChannelBalancesQuery__
 *
 * To run a query within a React component, call `useGetTapAssetChannelBalancesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTapAssetChannelBalancesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTapAssetChannelBalancesQuery({
 *   variables: {
 *      peerPubkey: // value for 'peerPubkey'
 *   },
 * });
 */
export function useGetTapAssetChannelBalancesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetTapAssetChannelBalancesQuery,
    GetTapAssetChannelBalancesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetTapAssetChannelBalancesQuery,
    GetTapAssetChannelBalancesQueryVariables
  >(GetTapAssetChannelBalancesDocument, options);
}
export function useGetTapAssetChannelBalancesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTapAssetChannelBalancesQuery,
    GetTapAssetChannelBalancesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetTapAssetChannelBalancesQuery,
    GetTapAssetChannelBalancesQueryVariables
  >(GetTapAssetChannelBalancesDocument, options);
}
// @ts-ignore
export function useGetTapAssetChannelBalancesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetTapAssetChannelBalancesQuery,
    GetTapAssetChannelBalancesQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  GetTapAssetChannelBalancesQuery,
  GetTapAssetChannelBalancesQueryVariables
>;
export function useGetTapAssetChannelBalancesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTapAssetChannelBalancesQuery,
        GetTapAssetChannelBalancesQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetTapAssetChannelBalancesQuery | undefined,
  GetTapAssetChannelBalancesQueryVariables
>;
export function useGetTapAssetChannelBalancesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTapAssetChannelBalancesQuery,
        GetTapAssetChannelBalancesQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetTapAssetChannelBalancesQuery,
    GetTapAssetChannelBalancesQueryVariables
  >(GetTapAssetChannelBalancesDocument, options);
}
export type GetTapAssetChannelBalancesQueryHookResult = ReturnType<
  typeof useGetTapAssetChannelBalancesQuery
>;
export type GetTapAssetChannelBalancesLazyQueryHookResult = ReturnType<
  typeof useGetTapAssetChannelBalancesLazyQuery
>;
export type GetTapAssetChannelBalancesSuspenseQueryHookResult = ReturnType<
  typeof useGetTapAssetChannelBalancesSuspenseQuery
>;
export type GetTapAssetChannelBalancesQueryResult = Apollo.QueryResult<
  GetTapAssetChannelBalancesQuery,
  GetTapAssetChannelBalancesQueryVariables
>;
