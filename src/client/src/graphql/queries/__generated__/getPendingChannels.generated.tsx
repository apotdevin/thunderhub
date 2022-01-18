import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetPendingChannelsQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetPendingChannelsQuery = {
  __typename?: 'Query';
  getPendingChannels: Array<{
    __typename?: 'PendingChannel';
    close_transaction_id?: string | null | undefined;
    is_active: boolean;
    is_closing: boolean;
    is_opening: boolean;
    is_timelocked: boolean;
    local_balance: number;
    local_reserve: number;
    timelock_blocks?: number | null | undefined;
    timelock_expiration?: number | null | undefined;
    partner_public_key: string;
    received: number;
    remote_balance: number;
    remote_reserve: number;
    sent: number;
    transaction_fee?: number | null | undefined;
    transaction_id: string;
    transaction_vout: number;
    partner_node_info: {
      __typename?: 'Node';
      node?: { __typename?: 'NodeType'; alias: string } | null | undefined;
    };
  }>;
};

export const GetPendingChannelsDocument = gql`
  query GetPendingChannels {
    getPendingChannels {
      close_transaction_id
      is_active
      is_closing
      is_opening
      is_timelocked
      local_balance
      local_reserve
      timelock_blocks
      timelock_expiration
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
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetPendingChannelsQuery,
    GetPendingChannelsQueryVariables
  >(GetPendingChannelsDocument, options);
}
export function useGetPendingChannelsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetPendingChannelsQuery,
    GetPendingChannelsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetPendingChannelsQuery,
    GetPendingChannelsQueryVariables
  >(GetPendingChannelsDocument, options);
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
