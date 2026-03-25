import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetTapAssetsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetTapAssetsQuery = {
  __typename?: 'Query';
  getTapAssets: {
    __typename?: 'TapAssetList';
    assets: Array<{
      __typename?: 'TapAsset';
      amount: string;
      lockTime: number;
      relativeLockTime: number;
      scriptVersion: number;
      scriptKey: string;
      isSpent: boolean;
      isBurn: boolean;
      assetGenesis?: {
        __typename?: 'TapAssetGenesis';
        genesisPoint: string;
        name: string;
        metaHash: string;
        assetId: string;
        assetType: Types.TapAssetType;
        outputIndex: number;
      } | null;
    }>;
  };
};

export const GetTapAssetsDocument = gql`
  query GetTapAssets {
    getTapAssets {
      assets {
        assetGenesis {
          genesisPoint
          name
          metaHash
          assetId
          assetType
          outputIndex
        }
        amount
        lockTime
        relativeLockTime
        scriptVersion
        scriptKey
        isSpent
        isBurn
      }
    }
  }
`;

/**
 * __useGetTapAssetsQuery__
 *
 * To run a query within a React component, call `useGetTapAssetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTapAssetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTapAssetsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTapAssetsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetTapAssetsQuery,
    GetTapAssetsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTapAssetsQuery, GetTapAssetsQueryVariables>(
    GetTapAssetsDocument,
    options
  );
}
export function useGetTapAssetsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTapAssetsQuery,
    GetTapAssetsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTapAssetsQuery, GetTapAssetsQueryVariables>(
    GetTapAssetsDocument,
    options
  );
}
// @ts-ignore
export function useGetTapAssetsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetTapAssetsQuery,
    GetTapAssetsQueryVariables
  >
): Apollo.UseSuspenseQueryResult<GetTapAssetsQuery, GetTapAssetsQueryVariables>;
export function useGetTapAssetsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTapAssetsQuery,
        GetTapAssetsQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetTapAssetsQuery | undefined,
  GetTapAssetsQueryVariables
>;
export function useGetTapAssetsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTapAssetsQuery,
        GetTapAssetsQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetTapAssetsQuery, GetTapAssetsQueryVariables>(
    GetTapAssetsDocument,
    options
  );
}
export type GetTapAssetsQueryHookResult = ReturnType<
  typeof useGetTapAssetsQuery
>;
export type GetTapAssetsLazyQueryHookResult = ReturnType<
  typeof useGetTapAssetsLazyQuery
>;
export type GetTapAssetsSuspenseQueryHookResult = ReturnType<
  typeof useGetTapAssetsSuspenseQuery
>;
export type GetTapAssetsQueryResult = Apollo.QueryResult<
  GetTapAssetsQuery,
  GetTapAssetsQueryVariables
>;
