import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type GetPeersQueryVariables = Types.Exact<{
  auth: Types.AuthType;
}>;

export type GetPeersQuery = { __typename?: 'Query' } & {
  getPeers?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'peerType' } & Pick<
          Types.PeerType,
          | 'bytes_received'
          | 'bytes_sent'
          | 'is_inbound'
          | 'is_sync_peer'
          | 'ping_time'
          | 'public_key'
          | 'socket'
          | 'tokens_received'
          | 'tokens_sent'
        > & {
            partner_node_info?: Types.Maybe<
              { __typename?: 'Node' } & {
                node?: Types.Maybe<
                  { __typename?: 'nodeType' } & Pick<
                    Types.NodeType,
                    | 'alias'
                    | 'capacity'
                    | 'channel_count'
                    | 'color'
                    | 'updated_at'
                  >
                >;
              }
            >;
          }
      >
    >
  >;
};

export const GetPeersDocument = gql`
  query GetPeers($auth: authType!) {
    getPeers(auth: $auth) {
      bytes_received
      bytes_sent
      is_inbound
      is_sync_peer
      ping_time
      public_key
      socket
      tokens_received
      tokens_sent
      partner_node_info {
        node {
          alias
          capacity
          channel_count
          color
          updated_at
        }
      }
    }
  }
`;

/**
 * __useGetPeersQuery__
 *
 * To run a query within a React component, call `useGetPeersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPeersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPeersQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetPeersQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetPeersQuery,
    GetPeersQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetPeersQuery, GetPeersQueryVariables>(
    GetPeersDocument,
    baseOptions
  );
}
export function useGetPeersLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetPeersQuery,
    GetPeersQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<GetPeersQuery, GetPeersQueryVariables>(
    GetPeersDocument,
    baseOptions
  );
}
export type GetPeersQueryHookResult = ReturnType<typeof useGetPeersQuery>;
export type GetPeersLazyQueryHookResult = ReturnType<
  typeof useGetPeersLazyQuery
>;
export type GetPeersQueryResult = ApolloReactCommon.QueryResult<
  GetPeersQuery,
  GetPeersQueryVariables
>;
