import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetLiquidityPerUsdQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetLiquidityPerUsdQuery = {
  __typename?: 'Query';
  getLiquidityPerUsd: string;
};

export const GetLiquidityPerUsdDocument = gql`
  query GetLiquidityPerUsd {
    getLiquidityPerUsd
  }
`;

/**
 * __useGetLiquidityPerUsdQuery__
 *
 * To run a query within a React component, call `useGetLiquidityPerUsdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLiquidityPerUsdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLiquidityPerUsdQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLiquidityPerUsdQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetLiquidityPerUsdQuery,
    GetLiquidityPerUsdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetLiquidityPerUsdQuery,
    GetLiquidityPerUsdQueryVariables
  >(GetLiquidityPerUsdDocument, options);
}
export function useGetLiquidityPerUsdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLiquidityPerUsdQuery,
    GetLiquidityPerUsdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetLiquidityPerUsdQuery,
    GetLiquidityPerUsdQueryVariables
  >(GetLiquidityPerUsdDocument, options);
}
// @ts-ignore
export function useGetLiquidityPerUsdSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetLiquidityPerUsdQuery,
    GetLiquidityPerUsdQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  GetLiquidityPerUsdQuery,
  GetLiquidityPerUsdQueryVariables
>;
export function useGetLiquidityPerUsdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetLiquidityPerUsdQuery,
        GetLiquidityPerUsdQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetLiquidityPerUsdQuery | undefined,
  GetLiquidityPerUsdQueryVariables
>;
export function useGetLiquidityPerUsdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetLiquidityPerUsdQuery,
        GetLiquidityPerUsdQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetLiquidityPerUsdQuery,
    GetLiquidityPerUsdQueryVariables
  >(GetLiquidityPerUsdDocument, options);
}
export type GetLiquidityPerUsdQueryHookResult = ReturnType<
  typeof useGetLiquidityPerUsdQuery
>;
export type GetLiquidityPerUsdLazyQueryHookResult = ReturnType<
  typeof useGetLiquidityPerUsdLazyQuery
>;
export type GetLiquidityPerUsdSuspenseQueryHookResult = ReturnType<
  typeof useGetLiquidityPerUsdSuspenseQuery
>;
export type GetLiquidityPerUsdQueryResult = Apollo.QueryResult<
  GetLiquidityPerUsdQuery,
  GetLiquidityPerUsdQueryVariables
>;
