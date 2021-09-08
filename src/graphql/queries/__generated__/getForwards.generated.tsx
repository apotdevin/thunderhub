/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type GetForwardsQueryVariables = Types.Exact<{
  days: Types.Scalars['Int'];
}>;


export type GetForwardsQuery = { __typename?: 'Query', getForwards: Array<Types.Maybe<{ __typename?: 'Forward', created_at: string, fee: number, fee_mtokens: string, incoming_channel: string, mtokens: string, outgoing_channel: string, tokens: number }>> };


export const GetForwardsDocument = gql`
    query GetForwards($days: Int!) {
  getForwards(days: $days) {
    created_at
    fee
    fee_mtokens
    incoming_channel
    mtokens
    outgoing_channel
    tokens
  }
}
    `;

/**
 * __useGetForwardsQuery__
 *
 * To run a query within a React component, call `useGetForwardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetForwardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetForwardsQuery({
 *   variables: {
 *      days: // value for 'days'
 *   },
 * });
 */
export function useGetForwardsQuery(baseOptions: Apollo.QueryHookOptions<GetForwardsQuery, GetForwardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetForwardsQuery, GetForwardsQueryVariables>(GetForwardsDocument, options);
      }
export function useGetForwardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetForwardsQuery, GetForwardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetForwardsQuery, GetForwardsQueryVariables>(GetForwardsDocument, options);
        }
export type GetForwardsQueryHookResult = ReturnType<typeof useGetForwardsQuery>;
export type GetForwardsLazyQueryHookResult = ReturnType<typeof useGetForwardsLazyQuery>;
export type GetForwardsQueryResult = Apollo.QueryResult<GetForwardsQuery, GetForwardsQueryVariables>;