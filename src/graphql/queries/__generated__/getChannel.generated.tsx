/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type GetChannelQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
  pubkey?: Types.Maybe<Types.Scalars['String']>;
}>;


export type GetChannelQuery = { __typename?: 'Query', getChannel: { __typename?: 'singleChannelType', partner_node_policies?: Types.Maybe<{ __typename?: 'nodePolicyType', node?: Types.Maybe<{ __typename?: 'Node', node: { __typename?: 'nodeType', alias: string } }> }> } };


export const GetChannelDocument = gql`
    query GetChannel($id: String!, $pubkey: String) {
  getChannel(id: $id, pubkey: $pubkey) {
    partner_node_policies {
      node {
        node {
          alias
        }
      }
    }
  }
}
    `;

/**
 * __useGetChannelQuery__
 *
 * To run a query within a React component, call `useGetChannelQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelQuery({
 *   variables: {
 *      id: // value for 'id'
 *      pubkey: // value for 'pubkey'
 *   },
 * });
 */
export function useGetChannelQuery(baseOptions: Apollo.QueryHookOptions<GetChannelQuery, GetChannelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChannelQuery, GetChannelQueryVariables>(GetChannelDocument, options);
      }
export function useGetChannelLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChannelQuery, GetChannelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChannelQuery, GetChannelQueryVariables>(GetChannelDocument, options);
        }
export type GetChannelQueryHookResult = ReturnType<typeof useGetChannelQuery>;
export type GetChannelLazyQueryHookResult = ReturnType<typeof useGetChannelLazyQuery>;
export type GetChannelQueryResult = Apollo.QueryResult<GetChannelQuery, GetChannelQueryVariables>;