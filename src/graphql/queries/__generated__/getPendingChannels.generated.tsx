import * as Apollo from '@apollo/client';
import * as Types from '../../types';

const gql = Apollo.gql;

export type GetPendingChannelsQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetPendingChannelsQuery = { __typename?: 'Query' } & {
  getPendingChannels?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'pendingChannelType' } & Pick<
          Types.PendingChannelType,
          | 'close_transaction_id'
          | 'is_active'
          | 'is_closing'
          | 'is_opening'
          | 'local_balance'
          | 'local_reserve'
          | 'partner_public_key'
          | 'received'
          | 'remote_balance'
          | 'remote_reserve'
          | 'sent'
          | 'transaction_fee'
          | 'transaction_id'
          | 'transaction_vout'
        > & {
            partner_node_info: { __typename?: 'Node' } & {
              node: { __typename?: 'nodeType' } & Pick<
                Types.NodeType,
                'alias' | 'capacity' | 'channel_count' | 'color' | 'updated_at'
              >;
            };
          }
      >
    >
  >;
};

export const GetPendingChannelsDocument = gql`
  query GetPendingChannels {
    getPendingChannels {
      close_transaction_id
      is_active
      is_closing
      is_opening
      local_balance
      local_reserve
      partner_public_key
      received
      remote_balance
      remote_reserve
      sent
      transaction_fee
      transaction_id
      transaction_vout
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
 * __useGetPendingChannelsQuery__
 *
 * To run a query within a React component, call `useGetPendingChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPendingChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPendingChannelsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPendingChannelsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetPendingChannelsQuery,
    GetPendingChannelsQueryVariables
  >
) {
  return Apollo.useQuery<
    GetPendingChannelsQuery,
    GetPendingChannelsQueryVariables
  >(GetPendingChannelsDocument, baseOptions);
}
export function useGetPendingChannelsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetPendingChannelsQuery,
    GetPendingChannelsQueryVariables
  >
) {
  return Apollo.useLazyQuery<
    GetPendingChannelsQuery,
    GetPendingChannelsQueryVariables
  >(GetPendingChannelsDocument, baseOptions);
}
export type GetPendingChannelsQueryHookResult = ReturnType<
  typeof useGetPendingChannelsQuery
>;
export type GetPendingChannelsLazyQueryHookResult = ReturnType<
  typeof useGetPendingChannelsLazyQuery
>;
export type GetPendingChannelsQueryResult = Apollo.QueryResult<
  GetPendingChannelsQuery,
  GetPendingChannelsQueryVariables
>;
