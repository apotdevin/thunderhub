/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type GetNodeSocialInfoQueryVariables = Types.Exact<{
  pubkey: Types.Scalars['String'];
}>;


export type GetNodeSocialInfoQuery = { __typename?: 'Query', getNodeSocialInfo: { __typename?: 'LightningNodeSocialInfo', socials?: Types.Maybe<{ __typename?: 'NodeSocial', info?: Types.Maybe<{ __typename?: 'NodeSocialInfo', private?: Types.Maybe<boolean>, telegram?: Types.Maybe<string>, twitter?: Types.Maybe<string>, twitter_verified?: Types.Maybe<boolean>, website?: Types.Maybe<string>, email?: Types.Maybe<string> }> }> } };


export const GetNodeSocialInfoDocument = gql`
    query GetNodeSocialInfo($pubkey: String!) {
  getNodeSocialInfo(pubkey: $pubkey) {
    socials {
      info {
        private
        telegram
        twitter
        twitter_verified
        website
        email
      }
    }
  }
}
    `;

/**
 * __useGetNodeSocialInfoQuery__
 *
 * To run a query within a React component, call `useGetNodeSocialInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNodeSocialInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNodeSocialInfoQuery({
 *   variables: {
 *      pubkey: // value for 'pubkey'
 *   },
 * });
 */
export function useGetNodeSocialInfoQuery(baseOptions: Apollo.QueryHookOptions<GetNodeSocialInfoQuery, GetNodeSocialInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNodeSocialInfoQuery, GetNodeSocialInfoQueryVariables>(GetNodeSocialInfoDocument, options);
      }
export function useGetNodeSocialInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNodeSocialInfoQuery, GetNodeSocialInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNodeSocialInfoQuery, GetNodeSocialInfoQueryVariables>(GetNodeSocialInfoDocument, options);
        }
export type GetNodeSocialInfoQueryHookResult = ReturnType<typeof useGetNodeSocialInfoQuery>;
export type GetNodeSocialInfoLazyQueryHookResult = ReturnType<typeof useGetNodeSocialInfoLazyQuery>;
export type GetNodeSocialInfoQueryResult = Apollo.QueryResult<GetNodeSocialInfoQuery, GetNodeSocialInfoQueryVariables>;