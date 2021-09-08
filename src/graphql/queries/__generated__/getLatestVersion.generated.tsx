/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type GetLatestVersionQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetLatestVersionQuery = { __typename?: 'Query', getLatestVersion?: Types.Maybe<string> };


export const GetLatestVersionDocument = gql`
    query GetLatestVersion {
  getLatestVersion
}
    `;

/**
 * __useGetLatestVersionQuery__
 *
 * To run a query within a React component, call `useGetLatestVersionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLatestVersionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLatestVersionQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLatestVersionQuery(baseOptions?: Apollo.QueryHookOptions<GetLatestVersionQuery, GetLatestVersionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLatestVersionQuery, GetLatestVersionQueryVariables>(GetLatestVersionDocument, options);
      }
export function useGetLatestVersionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLatestVersionQuery, GetLatestVersionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLatestVersionQuery, GetLatestVersionQueryVariables>(GetLatestVersionDocument, options);
        }
export type GetLatestVersionQueryHookResult = ReturnType<typeof useGetLatestVersionQuery>;
export type GetLatestVersionLazyQueryHookResult = ReturnType<typeof useGetLatestVersionLazyQuery>;
export type GetLatestVersionQueryResult = Apollo.QueryResult<GetLatestVersionQuery, GetLatestVersionQueryVariables>;