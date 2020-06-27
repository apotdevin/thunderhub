import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type GetNodeQueryVariables = Types.Exact<{
  auth: Types.AuthType;
  publicKey: Types.Scalars['String'];
  withoutChannels?: Types.Maybe<Types.Scalars['Boolean']>;
}>;

export type GetNodeQuery = { __typename?: 'Query' } & {
  getNode: { __typename?: 'Node' } & {
    node?: Types.Maybe<
      { __typename?: 'nodeType' } & Pick<
        Types.NodeType,
        'alias' | 'capacity' | 'channel_count' | 'color' | 'updated_at'
      >
    >;
  };
};

export const GetNodeDocument = gql`
  query GetNode(
    $auth: authType!
    $publicKey: String!
    $withoutChannels: Boolean
  ) {
    getNode(
      auth: $auth
      publicKey: $publicKey
      withoutChannels: $withoutChannels
    ) {
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
 *      auth: // value for 'auth'
 *      publicKey: // value for 'publicKey'
 *      withoutChannels: // value for 'withoutChannels'
 *   },
 * });
 */
export function useGetNodeQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetNodeQuery,
    GetNodeQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetNodeQuery, GetNodeQueryVariables>(
    GetNodeDocument,
    baseOptions
  );
}
export function useGetNodeLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetNodeQuery,
    GetNodeQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<GetNodeQuery, GetNodeQueryVariables>(
    GetNodeDocument,
    baseOptions
  );
}
export type GetNodeQueryHookResult = ReturnType<typeof useGetNodeQuery>;
export type GetNodeLazyQueryHookResult = ReturnType<typeof useGetNodeLazyQuery>;
export type GetNodeQueryResult = ApolloReactCommon.QueryResult<
  GetNodeQuery,
  GetNodeQueryVariables
>;
