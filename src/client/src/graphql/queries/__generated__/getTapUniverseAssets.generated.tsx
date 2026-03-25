import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetTapUniverseAssetsQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetTapUniverseAssetsQuery = {
  __typename?: 'Query';
  getTapUniverseAssets: {
    __typename?: 'TapUniverseAssetList';
    assets: Array<{
      __typename?: 'TapUniverseAsset';
      name?: string | null;
      assetId?: string | null;
      groupKey?: string | null;
      totalSupply: string;
    }>;
  };
};

export const GetTapUniverseAssetsDocument = gql`
  query GetTapUniverseAssets {
    getTapUniverseAssets {
      assets {
        name
        assetId
        groupKey
        totalSupply
      }
    }
  }
`;

/**
 * __useGetTapUniverseAssetsQuery__
 *
 * To run a query within a React component, call `useGetTapUniverseAssetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTapUniverseAssetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTapUniverseAssetsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTapUniverseAssetsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetTapUniverseAssetsQuery,
    GetTapUniverseAssetsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetTapUniverseAssetsQuery,
    GetTapUniverseAssetsQueryVariables
  >(GetTapUniverseAssetsDocument, options);
}
export function useGetTapUniverseAssetsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTapUniverseAssetsQuery,
    GetTapUniverseAssetsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetTapUniverseAssetsQuery,
    GetTapUniverseAssetsQueryVariables
  >(GetTapUniverseAssetsDocument, options);
}
// @ts-ignore
export function useGetTapUniverseAssetsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetTapUniverseAssetsQuery,
    GetTapUniverseAssetsQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  GetTapUniverseAssetsQuery,
  GetTapUniverseAssetsQueryVariables
>;
export function useGetTapUniverseAssetsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTapUniverseAssetsQuery,
        GetTapUniverseAssetsQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetTapUniverseAssetsQuery | undefined,
  GetTapUniverseAssetsQueryVariables
>;
export function useGetTapUniverseAssetsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTapUniverseAssetsQuery,
        GetTapUniverseAssetsQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetTapUniverseAssetsQuery,
    GetTapUniverseAssetsQueryVariables
  >(GetTapUniverseAssetsDocument, options);
}
export type GetTapUniverseAssetsQueryHookResult = ReturnType<
  typeof useGetTapUniverseAssetsQuery
>;
export type GetTapUniverseAssetsLazyQueryHookResult = ReturnType<
  typeof useGetTapUniverseAssetsLazyQuery
>;
export type GetTapUniverseAssetsSuspenseQueryHookResult = ReturnType<
  typeof useGetTapUniverseAssetsSuspenseQuery
>;
export type GetTapUniverseAssetsQueryResult = Apollo.QueryResult<
  GetTapUniverseAssetsQuery,
  GetTapUniverseAssetsQueryVariables
>;
