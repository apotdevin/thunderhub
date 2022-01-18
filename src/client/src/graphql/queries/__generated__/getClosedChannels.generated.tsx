import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetClosedChannelsQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetClosedChannelsQuery = {
  __typename?: 'Query';
  getClosedChannels: Array<{
    __typename?: 'ClosedChannel';
    capacity: number;
    close_confirm_height?: number | null | undefined;
    close_transaction_id?: string | null | undefined;
    closed_for_blocks?: number | null | undefined;
    final_local_balance: number;
    final_time_locked_balance: number;
    id?: string | null | undefined;
    is_breach_close: boolean;
    is_cooperative_close: boolean;
    is_funding_cancel: boolean;
    is_local_force_close: boolean;
    is_remote_force_close: boolean;
    partner_public_key: string;
    transaction_id: string;
    transaction_vout: number;
    channel_age?: number | null | undefined;
    partner_node_info: {
      __typename?: 'Node';
      node?: { __typename?: 'NodeType'; alias: string } | null | undefined;
    };
  }>;
};

export const GetClosedChannelsDocument = gql`
  query GetClosedChannels {
    getClosedChannels {
      capacity
      close_confirm_height
      close_transaction_id
      closed_for_blocks
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
      channel_age
      partner_node_info {
        node {
          alias
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
  baseOptions?: Apollo.QueryHookOptions<
    GetClosedChannelsQuery,
    GetClosedChannelsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetClosedChannelsQuery,
    GetClosedChannelsQueryVariables
  >(GetClosedChannelsDocument, options);
}
export function useGetClosedChannelsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetClosedChannelsQuery,
    GetClosedChannelsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetClosedChannelsQuery,
    GetClosedChannelsQueryVariables
  >(GetClosedChannelsDocument, options);
}
export type GetClosedChannelsQueryHookResult = ReturnType<
  typeof useGetClosedChannelsQuery
>;
export type GetClosedChannelsLazyQueryHookResult = ReturnType<
  typeof useGetClosedChannelsLazyQuery
>;
export type GetClosedChannelsQueryResult = Apollo.QueryResult<
  GetClosedChannelsQuery,
  GetClosedChannelsQueryVariables
>;
