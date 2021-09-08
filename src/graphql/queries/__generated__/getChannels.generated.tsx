/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type GetChannelsQueryVariables = Types.Exact<{
  active?: Types.Maybe<Types.Scalars['Boolean']>;
}>;


export type GetChannelsQuery = { __typename?: 'Query', getChannels: Array<Types.Maybe<{ __typename?: 'channelType', capacity: number, commit_transaction_fee: number, commit_transaction_weight: number, id: string, is_active: boolean, is_closing: boolean, is_opening: boolean, is_partner_initiated: boolean, is_private: boolean, is_static_remote_key?: Types.Maybe<boolean>, local_balance: number, local_reserve: number, partner_public_key: string, received: number, remote_balance: number, remote_reserve: number, sent: number, time_offline?: Types.Maybe<number>, time_online?: Types.Maybe<number>, transaction_id: string, transaction_vout: number, unsettled_balance: number, channel_age: number, pending_resume: { __typename?: 'pendingResumeType', incoming_tokens: number, outgoing_tokens: number, incoming_amount: number, outgoing_amount: number, total_tokens: number, total_amount: number }, partner_node_info: { __typename?: 'Node', node: { __typename?: 'nodeType', alias: string, capacity?: Types.Maybe<string>, channel_count?: Types.Maybe<number>, color?: Types.Maybe<string>, updated_at?: Types.Maybe<string> } }, partner_fee_info?: Types.Maybe<{ __typename?: 'singleChannelType', node_policies?: Types.Maybe<{ __typename?: 'nodePolicyType', base_fee_mtokens?: Types.Maybe<string>, fee_rate?: Types.Maybe<number>, cltv_delta?: Types.Maybe<number>, max_htlc_mtokens?: Types.Maybe<string>, min_htlc_mtokens?: Types.Maybe<string> }>, partner_node_policies?: Types.Maybe<{ __typename?: 'nodePolicyType', base_fee_mtokens?: Types.Maybe<string>, fee_rate?: Types.Maybe<number>, cltv_delta?: Types.Maybe<number> }> }>, bosScore?: Types.Maybe<{ __typename?: 'BosScore', alias: string, public_key: string, score: number, updated: string, position: number }> }>> };


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
    is_static_remote_key
    local_balance
    local_reserve
    partner_public_key
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
        capacity
        channel_count
        color
        updated_at
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
      }
    }
    bosScore {
      alias
      public_key
      score
      updated
      position
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
export function useGetChannelsQuery(baseOptions?: Apollo.QueryHookOptions<GetChannelsQuery, GetChannelsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChannelsQuery, GetChannelsQueryVariables>(GetChannelsDocument, options);
      }
export function useGetChannelsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChannelsQuery, GetChannelsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChannelsQuery, GetChannelsQueryVariables>(GetChannelsDocument, options);
        }
export type GetChannelsQueryHookResult = ReturnType<typeof useGetChannelsQuery>;
export type GetChannelsLazyQueryHookResult = ReturnType<typeof useGetChannelsLazyQuery>;
export type GetChannelsQueryResult = Apollo.QueryResult<GetChannelsQuery, GetChannelsQueryVariables>;