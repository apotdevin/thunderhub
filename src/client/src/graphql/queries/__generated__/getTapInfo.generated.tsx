import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetTapInfoQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetTapInfoQuery = {
  __typename?: 'Query';
  taproot_assets: {
    __typename?: 'TaprootAssetsQueries';
    id: string;
    get_info: {
      __typename?: 'TapDaemonInfo';
      version: string;
      lnd_version: string;
      network: string;
      lnd_identity_pubkey: string;
      node_alias: string;
      block_height: number;
      block_hash: string;
      sync_to_chain: boolean;
    };
  };
};

export const GetTapInfoDocument = gql`
  query GetTapInfo {
    taproot_assets {
      id
      get_info {
        version
        lnd_version
        network
        lnd_identity_pubkey
        node_alias
        block_height
        block_hash
        sync_to_chain
      }
    }
  }
`;

/**
 * __useGetTapInfoQuery__
 *
 * To run a query within a React component, call `useGetTapInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTapInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTapInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTapInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetTapInfoQuery,
    GetTapInfoQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTapInfoQuery, GetTapInfoQueryVariables>(
    GetTapInfoDocument,
    options
  );
}
export function useGetTapInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTapInfoQuery,
    GetTapInfoQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTapInfoQuery, GetTapInfoQueryVariables>(
    GetTapInfoDocument,
    options
  );
}
// @ts-ignore
export function useGetTapInfoSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetTapInfoQuery,
    GetTapInfoQueryVariables
  >
): Apollo.UseSuspenseQueryResult<GetTapInfoQuery, GetTapInfoQueryVariables>;
export function useGetTapInfoSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTapInfoQuery,
        GetTapInfoQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetTapInfoQuery | undefined,
  GetTapInfoQueryVariables
>;
export function useGetTapInfoSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTapInfoQuery,
        GetTapInfoQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetTapInfoQuery, GetTapInfoQueryVariables>(
    GetTapInfoDocument,
    options
  );
}
export type GetTapInfoQueryHookResult = ReturnType<typeof useGetTapInfoQuery>;
export type GetTapInfoLazyQueryHookResult = ReturnType<
  typeof useGetTapInfoLazyQuery
>;
export type GetTapInfoSuspenseQueryHookResult = ReturnType<
  typeof useGetTapInfoSuspenseQuery
>;
export type GetTapInfoQueryResult = Apollo.QueryResult<
  GetTapInfoQuery,
  GetTapInfoQueryVariables
>;
