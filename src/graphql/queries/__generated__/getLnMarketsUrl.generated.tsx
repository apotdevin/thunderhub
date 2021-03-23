/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type GetLnMarketsUrlQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetLnMarketsUrlQuery = (
  { __typename?: 'Query' }
  & Pick<Types.Query, 'getLnMarketsUrl'>
);


export const GetLnMarketsUrlDocument = gql`
    query GetLnMarketsUrl {
  getLnMarketsUrl
}
    `;

/**
 * __useGetLnMarketsUrlQuery__
 *
 * To run a query within a React component, call `useGetLnMarketsUrlQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLnMarketsUrlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLnMarketsUrlQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLnMarketsUrlQuery(baseOptions?: Apollo.QueryHookOptions<GetLnMarketsUrlQuery, GetLnMarketsUrlQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLnMarketsUrlQuery, GetLnMarketsUrlQueryVariables>(GetLnMarketsUrlDocument, options);
      }
export function useGetLnMarketsUrlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLnMarketsUrlQuery, GetLnMarketsUrlQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLnMarketsUrlQuery, GetLnMarketsUrlQueryVariables>(GetLnMarketsUrlDocument, options);
        }
export type GetLnMarketsUrlQueryHookResult = ReturnType<typeof useGetLnMarketsUrlQuery>;
export type GetLnMarketsUrlLazyQueryHookResult = ReturnType<typeof useGetLnMarketsUrlLazyQuery>;
export type GetLnMarketsUrlQueryResult = Apollo.QueryResult<GetLnMarketsUrlQuery, GetLnMarketsUrlQueryVariables>;