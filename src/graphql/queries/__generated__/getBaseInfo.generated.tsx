/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetBaseInfoQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetBaseInfoQuery = (
  { __typename?: 'Query' }
  & { getBaseInfo: (
    { __typename?: 'BaseInfo' }
    & Pick<Types.BaseInfo, 'lastBosUpdate' | 'apiTokenSatPrice' | 'apiTokenOriginalSatPrice'>
  ) }
);


export const GetBaseInfoDocument = gql`
    query GetBaseInfo {
  getBaseInfo {
    lastBosUpdate
    apiTokenSatPrice
    apiTokenOriginalSatPrice
  }
}
    `;

/**
 * __useGetBaseInfoQuery__
 *
 * To run a query within a React component, call `useGetBaseInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBaseInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBaseInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBaseInfoQuery(baseOptions?: Apollo.QueryHookOptions<GetBaseInfoQuery, GetBaseInfoQueryVariables>) {
        return Apollo.useQuery<GetBaseInfoQuery, GetBaseInfoQueryVariables>(GetBaseInfoDocument, baseOptions);
      }
export function useGetBaseInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBaseInfoQuery, GetBaseInfoQueryVariables>) {
          return Apollo.useLazyQuery<GetBaseInfoQuery, GetBaseInfoQueryVariables>(GetBaseInfoDocument, baseOptions);
        }
export type GetBaseInfoQueryHookResult = ReturnType<typeof useGetBaseInfoQuery>;
export type GetBaseInfoLazyQueryHookResult = ReturnType<typeof useGetBaseInfoLazyQuery>;
export type GetBaseInfoQueryResult = Apollo.QueryResult<GetBaseInfoQuery, GetBaseInfoQueryVariables>;