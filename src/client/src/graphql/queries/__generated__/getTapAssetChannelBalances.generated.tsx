import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetTapAssetChannelBalancesQueryVariables = Types.Exact<{
  peer_pubkey?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type GetTapAssetChannelBalancesQuery = {
  __typename?: 'Query';
  taproot_assets: {
    __typename?: 'TaprootAssetsQueries';
    id: string;
    get_asset_channel_balances: Array<{
      __typename?: 'TapAssetChannelBalance';
      channel_point: string;
      partner_public_key: string;
      asset_id: string;
      asset_name?: string | null;
      asset_precision: number;
      group_key?: string | null;
      local_balance: string;
      remote_balance: string;
      capacity: string;
    }>;
  };
};

export const GetTapAssetChannelBalancesDocument = gql`
  query GetTapAssetChannelBalances($peer_pubkey: String) {
    taproot_assets {
      id
      get_asset_channel_balances(peer_pubkey: $peer_pubkey) {
        channel_point
        partner_public_key
        asset_id
        asset_name
        asset_precision
        group_key
        local_balance
        remote_balance
        capacity
      }
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
 *      peer_pubkey: // value for 'peer_pubkey'
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
