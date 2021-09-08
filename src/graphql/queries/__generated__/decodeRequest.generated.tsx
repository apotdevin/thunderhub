/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type DecodeRequestQueryVariables = Types.Exact<{
  request: Types.Scalars['String'];
}>;


export type DecodeRequestQuery = { __typename?: 'Query', decodeRequest?: Types.Maybe<{ __typename?: 'decodeType', chain_address?: Types.Maybe<string>, cltv_delta?: Types.Maybe<number>, description: string, description_hash?: Types.Maybe<string>, destination: string, expires_at: string, id: string, tokens: number, destination_node: { __typename?: 'Node', node: { __typename?: 'nodeType', alias: string } }, routes: Array<Types.Maybe<Array<Types.Maybe<{ __typename?: 'RouteType', base_fee_mtokens?: Types.Maybe<string>, channel?: Types.Maybe<string>, cltv_delta?: Types.Maybe<number>, fee_rate?: Types.Maybe<number>, public_key: string }>>>>, probe_route?: Types.Maybe<{ __typename?: 'ProbeRoute', route?: Types.Maybe<{ __typename?: 'probedRoute', confidence: number, fee: number, fee_mtokens: string, mtokens: string, safe_fee: number, safe_tokens: number, timeout: number, tokens: number, hops: Array<{ __typename?: 'probedRouteHop', channel: string, channel_capacity: number, fee: number, fee_mtokens: string, forward: number, forward_mtokens: string, public_key: string, timeout: number, node: { __typename?: 'Node', node: { __typename?: 'nodeType', alias: string } } }> }> }> }> };


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
export function useDecodeRequestQuery(baseOptions: Apollo.QueryHookOptions<DecodeRequestQuery, DecodeRequestQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DecodeRequestQuery, DecodeRequestQueryVariables>(DecodeRequestDocument, options);
      }
export function useDecodeRequestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DecodeRequestQuery, DecodeRequestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DecodeRequestQuery, DecodeRequestQueryVariables>(DecodeRequestDocument, options);
        }
export type DecodeRequestQueryHookResult = ReturnType<typeof useDecodeRequestQuery>;
export type DecodeRequestLazyQueryHookResult = ReturnType<typeof useDecodeRequestLazyQuery>;
export type DecodeRequestQueryResult = Apollo.QueryResult<DecodeRequestQuery, DecodeRequestQueryVariables>;