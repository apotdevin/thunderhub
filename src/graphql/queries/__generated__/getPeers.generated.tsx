/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type GetPeersQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetPeersQuery = (
  { __typename?: 'Query' }
  & { getPeers?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'peerType' }
    & Pick<Types.PeerType, 'bytes_received' | 'bytes_sent' | 'is_inbound' | 'is_sync_peer' | 'ping_time' | 'public_key' | 'socket' | 'tokens_received' | 'tokens_sent'>
    & { partner_node_info: (
      { __typename?: 'Node' }
      & { node: (
        { __typename?: 'nodeType' }
        & Pick<Types.NodeType, 'alias' | 'capacity' | 'channel_count' | 'color' | 'updated_at'>
      ) }
    ) }
  )>>> }
);


export const GetPeersDocument = gql`
    query GetPeers {
  getPeers {
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
 *   },
 * });
 */
export function useGetPeersQuery(baseOptions?: Apollo.QueryHookOptions<GetPeersQuery, GetPeersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPeersQuery, GetPeersQueryVariables>(GetPeersDocument, options);
      }
export function useGetPeersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPeersQuery, GetPeersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPeersQuery, GetPeersQueryVariables>(GetPeersDocument, options);
        }
export type GetPeersQueryHookResult = ReturnType<typeof useGetPeersQuery>;
export type GetPeersLazyQueryHookResult = ReturnType<typeof useGetPeersLazyQuery>;
export type GetPeersQueryResult = Apollo.QueryResult<GetPeersQuery, GetPeersQueryVariables>;