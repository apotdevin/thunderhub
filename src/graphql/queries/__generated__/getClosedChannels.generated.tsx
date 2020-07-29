import {
  gql,
  QueryHookOptions,
  useQuery,
  useLazyQuery,
  QueryResult,
  LazyQueryHookOptions,
} from '@apollo/client';
import * as Types from '../../types';

export type GetClosedChannelsQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetClosedChannelsQuery = { __typename?: 'Query' } & {
  getClosedChannels?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'closedChannelType' } & Pick<
          Types.ClosedChannelType,
          | 'capacity'
          | 'close_confirm_height'
          | 'close_transaction_id'
          | 'final_local_balance'
          | 'final_time_locked_balance'
          | 'id'
          | 'is_breach_close'
          | 'is_cooperative_close'
          | 'is_funding_cancel'
          | 'is_local_force_close'
          | 'is_remote_force_close'
          | 'partner_public_key'
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

export const GetClosedChannelsDocument = gql`
  query GetClosedChannels {
    getClosedChannels {
      capacity
      close_confirm_height
      close_transaction_id
      final_local_balance
      final_time_locked_balance
      id
      is_breach_close
      is_cooperative_close
      is_funding_cancel
      is_local_force_close
      is_remote_force_close
      partner_public_key
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
 * __useGetClosedChannelsQuery__
 *
 * To run a query within a React component, call `useGetClosedChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClosedChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClosedChannelsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetClosedChannelsQuery(
  baseOptions?: QueryHookOptions<
    GetClosedChannelsQuery,
    GetClosedChannelsQueryVariables
  >
) {
  return useQuery<GetClosedChannelsQuery, GetClosedChannelsQueryVariables>(
    GetClosedChannelsDocument,
    baseOptions
  );
}
export function useGetClosedChannelsLazyQuery(
  baseOptions?: LazyQueryHookOptions<
    GetClosedChannelsQuery,
    GetClosedChannelsQueryVariables
  >
) {
  return useLazyQuery<GetClosedChannelsQuery, GetClosedChannelsQueryVariables>(
    GetClosedChannelsDocument,
    baseOptions
  );
}
export type GetClosedChannelsQueryHookResult = ReturnType<
  typeof useGetClosedChannelsQuery
>;
export type GetClosedChannelsLazyQueryHookResult = ReturnType<
  typeof useGetClosedChannelsLazyQuery
>;
export type GetClosedChannelsQueryResult = QueryResult<
  GetClosedChannelsQuery,
  GetClosedChannelsQueryVariables
>;
