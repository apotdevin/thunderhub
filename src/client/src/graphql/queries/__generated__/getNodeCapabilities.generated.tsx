import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetNodeCapabilitiesQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetNodeCapabilitiesQuery = {
  __typename?: 'Query';
  node: {
    __typename?: 'CurrentNode';
    id: string;
    capabilities: { __typename?: 'NodeCapabilities'; list: Array<string> };
  };
};

export const GetNodeCapabilitiesDocument = gql`
  query GetNodeCapabilities {
    node {
      id
      capabilities {
        list
      }
    }
  }
`;

/**
 * __useGetNodeCapabilitiesQuery__
 *
 * To run a query within a React component, call `useGetNodeCapabilitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNodeCapabilitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNodeCapabilitiesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetNodeCapabilitiesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetNodeCapabilitiesQuery,
    GetNodeCapabilitiesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetNodeCapabilitiesQuery,
    GetNodeCapabilitiesQueryVariables
  >(GetNodeCapabilitiesDocument, options);
}
export function useGetNodeCapabilitiesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetNodeCapabilitiesQuery,
    GetNodeCapabilitiesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetNodeCapabilitiesQuery,
    GetNodeCapabilitiesQueryVariables
  >(GetNodeCapabilitiesDocument, options);
}
// @ts-ignore
export function useGetNodeCapabilitiesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetNodeCapabilitiesQuery,
    GetNodeCapabilitiesQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  GetNodeCapabilitiesQuery,
  GetNodeCapabilitiesQueryVariables
>;
export function useGetNodeCapabilitiesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetNodeCapabilitiesQuery,
        GetNodeCapabilitiesQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetNodeCapabilitiesQuery | undefined,
  GetNodeCapabilitiesQueryVariables
>;
export function useGetNodeCapabilitiesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetNodeCapabilitiesQuery,
        GetNodeCapabilitiesQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetNodeCapabilitiesQuery,
    GetNodeCapabilitiesQueryVariables
  >(GetNodeCapabilitiesDocument, options);
}
export type GetNodeCapabilitiesQueryHookResult = ReturnType<
  typeof useGetNodeCapabilitiesQuery
>;
export type GetNodeCapabilitiesLazyQueryHookResult = ReturnType<
  typeof useGetNodeCapabilitiesLazyQuery
>;
export type GetNodeCapabilitiesSuspenseQueryHookResult = ReturnType<
  typeof useGetNodeCapabilitiesSuspenseQuery
>;
export type GetNodeCapabilitiesQueryResult = Apollo.QueryResult<
  GetNodeCapabilitiesQuery,
  GetNodeCapabilitiesQueryVariables
>;
