/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetForwardsPastDaysQueryVariables = Types.Exact<{
  days: Types.Scalars['Int'];
}>;


export type GetForwardsPastDaysQuery = (
  { __typename?: 'Query' }
  & { getForwardsPastDays: Array<Types.Maybe<(
    { __typename?: 'Forward' }
    & Pick<Types.Forward, 'created_at' | 'fee' | 'fee_mtokens' | 'incoming_channel' | 'mtokens' | 'outgoing_channel' | 'tokens'>
    & { incoming_node?: Types.Maybe<(
      { __typename?: 'ForwardNodeType' }
      & Pick<Types.ForwardNodeType, 'alias' | 'public_key' | 'channel_id'>
    )>, outgoing_node?: Types.Maybe<(
      { __typename?: 'ForwardNodeType' }
      & Pick<Types.ForwardNodeType, 'alias' | 'public_key' | 'channel_id'>
    )> }
  )>> }
);


export const GetForwardsPastDaysDocument = gql`
    query GetForwardsPastDays($days: Int!) {
  getForwardsPastDays(days: $days) {
    created_at
    fee
    fee_mtokens
    incoming_channel
    mtokens
    outgoing_channel
    tokens
    incoming_node {
      alias
      public_key
      channel_id
    }
    outgoing_node {
      alias
      public_key
      channel_id
    }
  }
}
    `;

/**
 * __useGetForwardsPastDaysQuery__
 *
 * To run a query within a React component, call `useGetForwardsPastDaysQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetForwardsPastDaysQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetForwardsPastDaysQuery({
 *   variables: {
 *      days: // value for 'days'
 *   },
 * });
 */
export function useGetForwardsPastDaysQuery(baseOptions: Apollo.QueryHookOptions<GetForwardsPastDaysQuery, GetForwardsPastDaysQueryVariables>) {
        return Apollo.useQuery<GetForwardsPastDaysQuery, GetForwardsPastDaysQueryVariables>(GetForwardsPastDaysDocument, baseOptions);
      }
export function useGetForwardsPastDaysLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetForwardsPastDaysQuery, GetForwardsPastDaysQueryVariables>) {
          return Apollo.useLazyQuery<GetForwardsPastDaysQuery, GetForwardsPastDaysQueryVariables>(GetForwardsPastDaysDocument, baseOptions);
        }
export type GetForwardsPastDaysQueryHookResult = ReturnType<typeof useGetForwardsPastDaysQuery>;
export type GetForwardsPastDaysLazyQueryHookResult = ReturnType<typeof useGetForwardsPastDaysLazyQuery>;
export type GetForwardsPastDaysQueryResult = Apollo.QueryResult<GetForwardsPastDaysQuery, GetForwardsPastDaysQueryVariables>;