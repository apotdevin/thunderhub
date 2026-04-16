import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetTapFederationServersQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetTapFederationServersQuery = {
  __typename?: 'Query';
  taproot_assets: {
    __typename?: 'TaprootAssetsQueries';
    id: string;
    get_federation_servers: {
      __typename?: 'TapFederationServerList';
      node_address?: string | null;
      servers: Array<{
        __typename?: 'TapFederationServer';
        host: string;
        id: number;
      }>;
    };
  };
};

export const GetTapFederationServersDocument = gql`
  query GetTapFederationServers {
    taproot_assets {
      id
      get_federation_servers {
        node_address
        servers {
          host
          id
        }
      }
    }
  }
`;

/**
 * __useGetTapFederationServersQuery__
 *
 * To run a query within a React component, call `useGetTapFederationServersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTapFederationServersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTapFederationServersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTapFederationServersQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetTapFederationServersQuery,
    GetTapFederationServersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetTapFederationServersQuery,
    GetTapFederationServersQueryVariables
  >(GetTapFederationServersDocument, options);
}
export function useGetTapFederationServersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTapFederationServersQuery,
    GetTapFederationServersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetTapFederationServersQuery,
    GetTapFederationServersQueryVariables
  >(GetTapFederationServersDocument, options);
}
// @ts-ignore
export function useGetTapFederationServersSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetTapFederationServersQuery,
    GetTapFederationServersQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  GetTapFederationServersQuery,
  GetTapFederationServersQueryVariables
>;
export function useGetTapFederationServersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTapFederationServersQuery,
        GetTapFederationServersQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetTapFederationServersQuery | undefined,
  GetTapFederationServersQueryVariables
>;
export function useGetTapFederationServersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTapFederationServersQuery,
        GetTapFederationServersQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetTapFederationServersQuery,
    GetTapFederationServersQueryVariables
  >(GetTapFederationServersDocument, options);
}
export type GetTapFederationServersQueryHookResult = ReturnType<
  typeof useGetTapFederationServersQuery
>;
export type GetTapFederationServersLazyQueryHookResult = ReturnType<
  typeof useGetTapFederationServersLazyQuery
>;
export type GetTapFederationServersSuspenseQueryHookResult = ReturnType<
  typeof useGetTapFederationServersSuspenseQuery
>;
export type GetTapFederationServersQueryResult = Apollo.QueryResult<
  GetTapFederationServersQuery,
  GetTapFederationServersQueryVariables
>;
