import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetUserNodesQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetUserNodesQuery = {
  __typename?: 'Query';
  user: {
    __typename?: 'UserQueries';
    get_nodes: Array<{
      __typename?: 'UserNode';
      id: string;
      slug: string;
      name: string;
    }>;
  };
};

export const GetUserNodesDocument = gql`
  query GetUserNodes {
    user {
      get_nodes {
        id
        slug
        name
      }
    }
  }
`;

/**
 * __useGetUserNodesQuery__
 *
 * To run a query within a React component, call `useGetUserNodesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserNodesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserNodesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserNodesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetUserNodesQuery,
    GetUserNodesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetUserNodesQuery, GetUserNodesQueryVariables>(
    GetUserNodesDocument,
    options
  );
}
export function useGetUserNodesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetUserNodesQuery,
    GetUserNodesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetUserNodesQuery, GetUserNodesQueryVariables>(
    GetUserNodesDocument,
    options
  );
}
// @ts-ignore
export function useGetUserNodesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetUserNodesQuery,
    GetUserNodesQueryVariables
  >
): Apollo.UseSuspenseQueryResult<GetUserNodesQuery, GetUserNodesQueryVariables>;
export function useGetUserNodesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetUserNodesQuery,
        GetUserNodesQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetUserNodesQuery | undefined,
  GetUserNodesQueryVariables
>;
export function useGetUserNodesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetUserNodesQuery,
        GetUserNodesQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetUserNodesQuery, GetUserNodesQueryVariables>(
    GetUserNodesDocument,
    options
  );
}
export type GetUserNodesQueryHookResult = ReturnType<
  typeof useGetUserNodesQuery
>;
export type GetUserNodesLazyQueryHookResult = ReturnType<
  typeof useGetUserNodesLazyQuery
>;
export type GetUserNodesSuspenseQueryHookResult = ReturnType<
  typeof useGetUserNodesSuspenseQuery
>;
export type GetUserNodesQueryResult = Apollo.QueryResult<
  GetUserNodesQuery,
  GetUserNodesQueryVariables
>;
