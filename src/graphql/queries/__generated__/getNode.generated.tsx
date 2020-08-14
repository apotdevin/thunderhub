/* eslint-disable */
import * as Types from '../../types';

import * as Apollo from '@apollo/client';
const gql = Apollo.gql;

export type GetNodeQueryVariables = Types.Exact<{
  publicKey: Types.Scalars['String'];
  withoutChannels?: Types.Maybe<Types.Scalars['Boolean']>;
}>;

export type GetNodeQuery = { __typename?: 'Query' } & {
  getNode: { __typename?: 'Node' } & {
    node: { __typename?: 'nodeType' } & Pick<
      Types.NodeType,
      'alias' | 'capacity' | 'channel_count' | 'color' | 'updated_at'
    >;
  };
};

export const GetNodeDocument = gql`
  query GetNode($publicKey: String!, $withoutChannels: Boolean) {
    getNode(publicKey: $publicKey, withoutChannels: $withoutChannels) {
      node {
        alias
        capacity
        channel_count
        color
        updated_at
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
  baseOptions?: Apollo.QueryHookOptions<GetNodeQuery, GetNodeQueryVariables>
) {
  return Apollo.useQuery<GetNodeQuery, GetNodeQueryVariables>(
    GetNodeDocument,
    baseOptions
  );
}
export function useGetNodeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetNodeQuery, GetNodeQueryVariables>
) {
  return Apollo.useLazyQuery<GetNodeQuery, GetNodeQueryVariables>(
    GetNodeDocument,
    baseOptions
  );
}
export type GetNodeQueryHookResult = ReturnType<typeof useGetNodeQuery>;
export type GetNodeLazyQueryHookResult = ReturnType<typeof useGetNodeLazyQuery>;
export type GetNodeQueryResult = Apollo.QueryResult<
  GetNodeQuery,
  GetNodeQueryVariables
>;
