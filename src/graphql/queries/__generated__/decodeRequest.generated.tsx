/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type DecodeRequestQueryVariables = Types.Exact<{
  request: Types.Scalars['String'];
}>;


export type DecodeRequestQuery = (
  { __typename?: 'Query' }
  & { decodeRequest?: Types.Maybe<(
    { __typename?: 'decodeType' }
    & Pick<Types.DecodeType, 'chain_address' | 'cltv_delta' | 'description' | 'description_hash' | 'destination' | 'expires_at' | 'id' | 'tokens'>
    & { destination_node: (
      { __typename?: 'Node' }
      & { node: (
        { __typename?: 'nodeType' }
        & Pick<Types.NodeType, 'alias'>
      ) }
    ), routes: Array<Types.Maybe<Array<Types.Maybe<(
      { __typename?: 'RouteType' }
      & Pick<Types.RouteType, 'base_fee_mtokens' | 'channel' | 'cltv_delta' | 'fee_rate' | 'public_key'>
    )>>>>, probe_route?: Types.Maybe<(
      { __typename?: 'ProbeRoute' }
      & { route?: Types.Maybe<(
        { __typename?: 'probedRoute' }
        & Pick<Types.ProbedRoute, 'confidence' | 'fee' | 'fee_mtokens' | 'mtokens' | 'safe_fee' | 'safe_tokens' | 'timeout' | 'tokens'>
        & { hops: Array<(
          { __typename?: 'probedRouteHop' }
          & Pick<Types.ProbedRouteHop, 'channel' | 'channel_capacity' | 'fee' | 'fee_mtokens' | 'forward' | 'forward_mtokens' | 'public_key' | 'timeout'>
          & { node: (
            { __typename?: 'Node' }
            & { node: (
              { __typename?: 'nodeType' }
              & Pick<Types.NodeType, 'alias'>
            ) }
          ) }
        )> }
      )> }
    )> }
  )> }
);


export const DecodeRequestDocument = gql`
    query DecodeRequest($request: String!) {
  decodeRequest(request: $request) {
    chain_address
    cltv_delta
    description
    description_hash
    destination
    destination_node {
      node {
        alias
      }
    }
    expires_at
    id
    routes {
      base_fee_mtokens
      channel
      cltv_delta
      fee_rate
      public_key
    }
    tokens
    probe_route {
      route {
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
          node {
            node {
              alias
            }
          }
        }
        mtokens
        safe_fee
        safe_tokens
        timeout
        tokens
      }
    }
  }
}
    `;

/**
 * __useDecodeRequestQuery__
 *
 * To run a query within a React component, call `useDecodeRequestQuery` and pass it any options that fit your needs.
 * When your component renders, `useDecodeRequestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDecodeRequestQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useDecodeRequestQuery(baseOptions?: Apollo.QueryHookOptions<DecodeRequestQuery, DecodeRequestQueryVariables>) {
        return Apollo.useQuery<DecodeRequestQuery, DecodeRequestQueryVariables>(DecodeRequestDocument, baseOptions);
      }
export function useDecodeRequestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DecodeRequestQuery, DecodeRequestQueryVariables>) {
          return Apollo.useLazyQuery<DecodeRequestQuery, DecodeRequestQueryVariables>(DecodeRequestDocument, baseOptions);
        }
export type DecodeRequestQueryHookResult = ReturnType<typeof useDecodeRequestQuery>;
export type DecodeRequestLazyQueryHookResult = ReturnType<typeof useDecodeRequestLazyQuery>;
export type DecodeRequestQueryResult = Apollo.QueryResult<DecodeRequestQuery, DecodeRequestQueryVariables>;