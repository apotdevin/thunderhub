/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type GetBosNodeScoresQueryVariables = Types.Exact<{
  publicKey: Types.Scalars['String'];
}>;


export type GetBosNodeScoresQuery = { __typename?: 'Query', getBosNodeScores: Array<Types.Maybe<{ __typename?: 'BosScore', alias: string, public_key: string, score: number, updated: string, position: number }>> };


export const GetBosNodeScoresDocument = gql`
    query GetBosNodeScores($publicKey: String!) {
  getBosNodeScores(publicKey: $publicKey) {
    alias
    public_key
    score
    updated
    position
  }
}
    `;

/**
 * __useGetBosNodeScoresQuery__
 *
 * To run a query within a React component, call `useGetBosNodeScoresQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBosNodeScoresQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBosNodeScoresQuery({
 *   variables: {
 *      publicKey: // value for 'publicKey'
 *   },
 * });
 */
export function useGetBosNodeScoresQuery(baseOptions: Apollo.QueryHookOptions<GetBosNodeScoresQuery, GetBosNodeScoresQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBosNodeScoresQuery, GetBosNodeScoresQueryVariables>(GetBosNodeScoresDocument, options);
      }
export function useGetBosNodeScoresLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBosNodeScoresQuery, GetBosNodeScoresQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBosNodeScoresQuery, GetBosNodeScoresQueryVariables>(GetBosNodeScoresDocument, options);
        }
export type GetBosNodeScoresQueryHookResult = ReturnType<typeof useGetBosNodeScoresQuery>;
export type GetBosNodeScoresLazyQueryHookResult = ReturnType<typeof useGetBosNodeScoresLazyQuery>;
export type GetBosNodeScoresQueryResult = Apollo.QueryResult<GetBosNodeScoresQuery, GetBosNodeScoresQueryVariables>;