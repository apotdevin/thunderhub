/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type GetRoutesQueryVariables = Types.Exact<{
  outgoing: Types.Scalars['String'];
  incoming: Types.Scalars['String'];
  tokens: Types.Scalars['Int'];
  maxFee?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type GetRoutesQuery = { __typename?: 'Query', getRoutes?: { __typename?: 'GetRouteType', confidence?: number | null | undefined, fee: number, fee_mtokens: string, mtokens: string, safe_fee: number, safe_tokens: number, timeout: number, tokens: number, hops: Array<{ __typename?: 'RouteHopType', channel: string, channel_capacity: number, fee: number, fee_mtokens: string, forward: number, forward_mtokens: string, public_key: string, timeout: number }> } | null | undefined };


export const GetRoutesDocument = gql`
    query GetRoutes($outgoing: String!, $incoming: String!, $tokens: Int!, $maxFee: Int) {
  getRoutes(
    outgoing: $outgoing
    incoming: $incoming
    tokens: $tokens
    maxFee: $maxFee
  ) {
    confidence
    fee
    fee_mtokens
    hops {
      channel
      channel_capacity
      fee
      fee_mtokens
      forward
      forward_mtokens
      public_key
      timeout
    }
    mtokens
    safe_fee
    safe_tokens
    timeout
    tokens
  }
}
    `;

/**
 * __useGetRoutesQuery__
 *
 * To run a query within a React component, call `useGetRoutesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoutesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoutesQuery({
 *   variables: {
 *      outgoing: // value for 'outgoing'
 *      incoming: // value for 'incoming'
 *      tokens: // value for 'tokens'
 *      maxFee: // value for 'maxFee'
 *   },
 * });
 */
export function useGetRoutesQuery(baseOptions: Apollo.QueryHookOptions<GetRoutesQuery, GetRoutesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRoutesQuery, GetRoutesQueryVariables>(GetRoutesDocument, options);
      }
export function useGetRoutesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRoutesQuery, GetRoutesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRoutesQuery, GetRoutesQueryVariables>(GetRoutesDocument, options);
        }
export type GetRoutesQueryHookResult = ReturnType<typeof useGetRoutesQuery>;
export type GetRoutesLazyQueryHookResult = ReturnType<typeof useGetRoutesLazyQuery>;
export type GetRoutesQueryResult = Apollo.QueryResult<GetRoutesQuery, GetRoutesQueryVariables>;