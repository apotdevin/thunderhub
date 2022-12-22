import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetChannelsQueryVariables = Types.Exact<{
  active?: Types.InputMaybe<Types.Scalars['Boolean']>;
}>;

export type GetChannelsQuery = {
  __typename?: 'Query';
  getChannels: Array<{
    __typename?: 'Channel';
    capacity: number;
    commit_transaction_fee: number;
    commit_transaction_weight: number;
    id: string;
    is_active: boolean;
    is_closing: boolean;
    is_opening: boolean;
    is_partner_initiated: boolean;
    is_private: boolean;
    local_balance: number;
    local_reserve: number;
    partner_public_key: string;
    past_states: number;
    received: number;
    remote_balance: number;
    remote_reserve: number;
    sent: number;
    time_offline?: number | null;
    time_online?: number | null;
    transaction_id: string;
    transaction_vout: number;
    unsettled_balance: number;
    channel_age: number;
    pending_resume: {
      __typename?: 'PendingResume';
      incoming_tokens: number;
      outgoing_tokens: number;
      incoming_amount: number;
      outgoing_amount: number;
      total_tokens: number;
      total_amount: number;
    };
    partner_node_info: {
      __typename?: 'Node';
      node?: { __typename?: 'NodeType'; alias: string } | null;
    };
    partner_fee_info?: {
      __typename?: 'SingleChannel';
      node_policies?: {
        __typename?: 'NodePolicy';
        base_fee_mtokens?: string | null;
        fee_rate?: number | null;
        cltv_delta?: number | null;
        max_htlc_mtokens?: string | null;
        min_htlc_mtokens?: string | null;
      } | null;
      partner_node_policies?: {
        __typename?: 'NodePolicy';
        base_fee_mtokens?: string | null;
        fee_rate?: number | null;
        cltv_delta?: number | null;
        max_htlc_mtokens?: string | null;
        min_htlc_mtokens?: string | null;
      } | null;
    } | null;
  }>;
};

export type GetChannelsWithPeersQueryVariables = Types.Exact<{
  active?: Types.InputMaybe<Types.Scalars['Boolean']>;
}>;

export type GetChannelsWithPeersQuery = {
  __typename?: 'Query';
  getChannels: Array<{
    __typename?: 'Channel';
    partner_public_key: string;
    partner_node_info: {
      __typename?: 'Node';
      node?: { __typename?: 'NodeType'; alias: string } | null;
    };
  }>;
};

export const GetChannelsDocument = gql`
  query GetChannels($active: Boolean) {
    getChannels(active: $active) {
      capacity
      commit_transaction_fee
      commit_transaction_weight
      id
      is_active
      is_closing
      is_opening
      is_partner_initiated
      is_private
      local_balance
      local_reserve
      partner_public_key
      past_states
      received
      remote_balance
      remote_reserve
      sent
      time_offline
      time_online
      transaction_id
      transaction_vout
      unsettled_balance
      channel_age
      pending_resume {
        incoming_tokens
        outgoing_tokens
        incoming_amount
        outgoing_amount
        total_tokens
        total_amount
      }
      partner_node_info {
        node {
          alias
        }
      }
      partner_fee_info {
        node_policies {
          base_fee_mtokens
          fee_rate
          cltv_delta
          max_htlc_mtokens
          min_htlc_mtokens
        }
        partner_node_policies {
          base_fee_mtokens
          fee_rate
          cltv_delta
          max_htlc_mtokens
          min_htlc_mtokens
        }
      }
    }
  }
`;

/**
 * __useGetChannelsQuery__
 *
 * To run a query within a React component, call `useGetChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelsQuery({
 *   variables: {
 *      active: // value for 'active'
 *   },
 * });
 */
export function useGetChannelsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetChannelsQuery,
    GetChannelsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetChannelsQuery, GetChannelsQueryVariables>(
    GetChannelsDocument,
    options
  );
}
export function useGetChannelsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetChannelsQuery,
    GetChannelsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetChannelsQuery, GetChannelsQueryVariables>(
    GetChannelsDocument,
    options
  );
}
export type GetChannelsQueryHookResult = ReturnType<typeof useGetChannelsQuery>;
export type GetChannelsLazyQueryHookResult = ReturnType<
  typeof useGetChannelsLazyQuery
>;
export type GetChannelsQueryResult = Apollo.QueryResult<
  GetChannelsQuery,
  GetChannelsQueryVariables
>;
export const GetChannelsWithPeersDocument = gql`
  query GetChannelsWithPeers($active: Boolean) {
    getChannels(active: $active) {
      partner_public_key
      partner_node_info {
        node {
          alias
        }
      }
    }
  }
`;

/**
 * __useGetChannelsWithPeersQuery__
 *
 * To run a query within a React component, call `useGetChannelsWithPeersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelsWithPeersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelsWithPeersQuery({
 *   variables: {
 *      active: // value for 'active'
 *   },
 * });
 */
export function useGetChannelsWithPeersQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetChannelsWithPeersQuery,
    GetChannelsWithPeersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetChannelsWithPeersQuery,
    GetChannelsWithPeersQueryVariables
  >(GetChannelsWithPeersDocument, options);
}
export function useGetChannelsWithPeersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetChannelsWithPeersQuery,
    GetChannelsWithPeersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetChannelsWithPeersQuery,
    GetChannelsWithPeersQueryVariables
  >(GetChannelsWithPeersDocument, options);
}
export type GetChannelsWithPeersQueryHookResult = ReturnType<
  typeof useGetChannelsWithPeersQuery
>;
export type GetChannelsWithPeersLazyQueryHookResult = ReturnType<
  typeof useGetChannelsWithPeersLazyQuery
>;
export type GetChannelsWithPeersQueryResult = Apollo.QueryResult<
  GetChannelsWithPeersQuery,
  GetChannelsWithPeersQueryVariables
>;
