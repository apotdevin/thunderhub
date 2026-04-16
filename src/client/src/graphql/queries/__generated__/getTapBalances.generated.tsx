import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetTapBalancesQueryVariables = Types.Exact<{
  group_by?: Types.InputMaybe<Types.TapBalanceGroupBy>;
}>;

export type GetTapBalancesQuery = {
  __typename?: 'Query';
  taproot_assets: {
    __typename?: 'TaprootAssetsQueries';
    id: string;
    get_balances: {
      __typename?: 'TapBalances';
      balances: Array<{
        __typename?: 'TapAssetBalanceEntry';
        asset_id?: string | null;
        group_key?: string | null;
        names?: Array<string> | null;
        balance: string;
      }>;
    };
  };
};

export const GetTapBalancesDocument = gql`
  query GetTapBalances($group_by: TapBalanceGroupBy) {
    taproot_assets {
      id
      get_balances(group_by: $group_by) {
        balances {
          asset_id
          group_key
          names
          balance
        }
      }
    }
  }
`;

/**
 * __useGetTapBalancesQuery__
 *
 * To run a query within a React component, call `useGetTapBalancesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTapBalancesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTapBalancesQuery({
 *   variables: {
 *      group_by: // value for 'group_by'
 *   },
 * });
 */
export function useGetTapBalancesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetTapBalancesQuery,
    GetTapBalancesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTapBalancesQuery, GetTapBalancesQueryVariables>(
    GetTapBalancesDocument,
    options
  );
}
export function useGetTapBalancesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTapBalancesQuery,
    GetTapBalancesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTapBalancesQuery, GetTapBalancesQueryVariables>(
    GetTapBalancesDocument,
    options
  );
}
// @ts-ignore
export function useGetTapBalancesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetTapBalancesQuery,
    GetTapBalancesQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  GetTapBalancesQuery,
  GetTapBalancesQueryVariables
>;
export function useGetTapBalancesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTapBalancesQuery,
        GetTapBalancesQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetTapBalancesQuery | undefined,
  GetTapBalancesQueryVariables
>;
export function useGetTapBalancesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTapBalancesQuery,
        GetTapBalancesQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetTapBalancesQuery,
    GetTapBalancesQueryVariables
  >(GetTapBalancesDocument, options);
}
export type GetTapBalancesQueryHookResult = ReturnType<
  typeof useGetTapBalancesQuery
>;
export type GetTapBalancesLazyQueryHookResult = ReturnType<
  typeof useGetTapBalancesLazyQuery
>;
export type GetTapBalancesSuspenseQueryHookResult = ReturnType<
  typeof useGetTapBalancesSuspenseQuery
>;
export type GetTapBalancesQueryResult = Apollo.QueryResult<
  GetTapBalancesQuery,
  GetTapBalancesQueryVariables
>;
