import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetNodeQueryVariables = Types.Exact<{
  publicKey: Types.Scalars['String']['input'];
  withoutChannels?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;

export type GetNodeQuery = {
  __typename?: 'Query';
  getNode: {
    __typename?: 'Node';
    node?: { __typename?: 'NodeType'; alias: string } | null;
  };
};

export const GetNodeDocument = gql`
  query GetNode($publicKey: String!, $withoutChannels: Boolean) {
    getNode(publicKey: $publicKey, withoutChannels: $withoutChannels) {
      node {
        alias
      }
    }
  }
`;

/**
 * __useGetNodeQuery__
 *
 * To run a query within a React component, call `useGetNodeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNodeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNodeQuery({
 *   variables: {
 *      publicKey: // value for 'publicKey'
 *      withoutChannels: // value for 'withoutChannels'
 *   },
 * });
 */
export function useGetNodeQuery(
  baseOptions: Apollo.QueryHookOptions<GetNodeQuery, GetNodeQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetNodeQuery, GetNodeQueryVariables>(
    GetNodeDocument,
    options
  );
}
export function useGetNodeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetNodeQuery, GetNodeQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetNodeQuery, GetNodeQueryVariables>(
    GetNodeDocument,
    options
  );
}
export function useGetNodeSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetNodeQuery,
    GetNodeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetNodeQuery, GetNodeQueryVariables>(
    GetNodeDocument,
    options
  );
}
export type GetNodeQueryHookResult = ReturnType<typeof useGetNodeQuery>;
export type GetNodeLazyQueryHookResult = ReturnType<typeof useGetNodeLazyQuery>;
export type GetNodeSuspenseQueryHookResult = ReturnType<
  typeof useGetNodeSuspenseQuery
>;
export type GetNodeQueryResult = Apollo.QueryResult<
  GetNodeQuery,
  GetNodeQueryVariables
>;
