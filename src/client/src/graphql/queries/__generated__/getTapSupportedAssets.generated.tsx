import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetTapSupportedAssetsQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetTapSupportedAssetsQuery = {
  __typename?: 'Query';
  rails: {
    __typename?: 'RailsQueries';
    id: string;
    get_tap_supported_assets: {
      __typename?: 'TapSupportedAssetList';
      list: Array<{
        __typename?: 'TapSupportedAsset';
        id: string;
        symbol: string;
        description?: string | null;
        precision: number;
        assetId?: string | null;
        groupKey?: string | null;
        universeHost?: string | null;
        prices?: { __typename?: 'TapAssetPrice'; usd?: number | null } | null;
      }>;
    };
  };
};

export const GetTapSupportedAssetsDocument = gql`
  query GetTapSupportedAssets {
    rails {
      id
      get_tap_supported_assets {
        list {
          id
          symbol
          description
          precision
          assetId
          groupKey
          universeHost
          prices {
            usd
          }
        }
      }
    }
  }
`;

/**
 * __useGetTapSupportedAssetsQuery__
 *
 * To run a query within a React component, call `useGetTapSupportedAssetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTapSupportedAssetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTapSupportedAssetsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTapSupportedAssetsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetTapSupportedAssetsQuery,
    GetTapSupportedAssetsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetTapSupportedAssetsQuery,
    GetTapSupportedAssetsQueryVariables
  >(GetTapSupportedAssetsDocument, options);
}
export function useGetTapSupportedAssetsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTapSupportedAssetsQuery,
    GetTapSupportedAssetsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetTapSupportedAssetsQuery,
    GetTapSupportedAssetsQueryVariables
  >(GetTapSupportedAssetsDocument, options);
}
// @ts-ignore
export function useGetTapSupportedAssetsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetTapSupportedAssetsQuery,
    GetTapSupportedAssetsQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  GetTapSupportedAssetsQuery,
  GetTapSupportedAssetsQueryVariables
>;
export function useGetTapSupportedAssetsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTapSupportedAssetsQuery,
        GetTapSupportedAssetsQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetTapSupportedAssetsQuery | undefined,
  GetTapSupportedAssetsQueryVariables
>;
export function useGetTapSupportedAssetsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTapSupportedAssetsQuery,
        GetTapSupportedAssetsQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetTapSupportedAssetsQuery,
    GetTapSupportedAssetsQueryVariables
  >(GetTapSupportedAssetsDocument, options);
}
export type GetTapSupportedAssetsQueryHookResult = ReturnType<
  typeof useGetTapSupportedAssetsQuery
>;
export type GetTapSupportedAssetsLazyQueryHookResult = ReturnType<
  typeof useGetTapSupportedAssetsLazyQuery
>;
export type GetTapSupportedAssetsSuspenseQueryHookResult = ReturnType<
  typeof useGetTapSupportedAssetsSuspenseQuery
>;
export type GetTapSupportedAssetsQueryResult = Apollo.QueryResult<
  GetTapSupportedAssetsQuery,
  GetTapSupportedAssetsQueryVariables
>;
