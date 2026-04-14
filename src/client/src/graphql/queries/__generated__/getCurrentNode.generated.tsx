import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetCurrentNodeQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetCurrentNodeQuery = {
  __typename?: 'Query';
  node: {
    __typename?: 'CurrentNode';
    id: string;
    created_at?: string | null;
    network?: string | null;
    socket: string;
  };
};

export const GetCurrentNodeDocument = gql`
  query GetCurrentNode {
    node {
      id
      created_at
      network
      socket
    }
  }
`;

/**
 * __useGetCurrentNodeQuery__
 *
 * To run a query within a React component, call `useGetCurrentNodeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentNodeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentNodeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentNodeQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetCurrentNodeQuery,
    GetCurrentNodeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetCurrentNodeQuery, GetCurrentNodeQueryVariables>(
    GetCurrentNodeDocument,
    options
  );
}
export function useGetCurrentNodeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetCurrentNodeQuery,
    GetCurrentNodeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetCurrentNodeQuery, GetCurrentNodeQueryVariables>(
    GetCurrentNodeDocument,
    options
  );
}
// @ts-ignore
export function useGetCurrentNodeSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetCurrentNodeQuery,
    GetCurrentNodeQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  GetCurrentNodeQuery,
  GetCurrentNodeQueryVariables
>;
export function useGetCurrentNodeSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetCurrentNodeQuery,
        GetCurrentNodeQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetCurrentNodeQuery | undefined,
  GetCurrentNodeQueryVariables
>;
export function useGetCurrentNodeSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetCurrentNodeQuery,
        GetCurrentNodeQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetCurrentNodeQuery,
    GetCurrentNodeQueryVariables
  >(GetCurrentNodeDocument, options);
}
export type GetCurrentNodeQueryHookResult = ReturnType<
  typeof useGetCurrentNodeQuery
>;
export type GetCurrentNodeLazyQueryHookResult = ReturnType<
  typeof useGetCurrentNodeLazyQuery
>;
export type GetCurrentNodeSuspenseQueryHookResult = ReturnType<
  typeof useGetCurrentNodeSuspenseQuery
>;
export type GetCurrentNodeQueryResult = Apollo.QueryResult<
  GetCurrentNodeQuery,
  GetCurrentNodeQueryVariables
>;
