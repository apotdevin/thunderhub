/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetBasePointsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetBasePointsQuery = (
  { __typename?: 'Query' }
  & { getBasePoints: Array<Types.Maybe<(
    { __typename?: 'basePointsType' }
    & Pick<Types.BasePointsType, 'alias' | 'amount'>
  )>> }
);


export const GetBasePointsDocument = gql`
    query GetBasePoints {
  getBasePoints {
    alias
    amount
  }
}
    `;

/**
 * __useGetBasePointsQuery__
 *
 * To run a query within a React component, call `useGetBasePointsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBasePointsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBasePointsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBasePointsQuery(baseOptions?: Apollo.QueryHookOptions<GetBasePointsQuery, GetBasePointsQueryVariables>) {
        return Apollo.useQuery<GetBasePointsQuery, GetBasePointsQueryVariables>(GetBasePointsDocument, baseOptions);
      }
export function useGetBasePointsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBasePointsQuery, GetBasePointsQueryVariables>) {
          return Apollo.useLazyQuery<GetBasePointsQuery, GetBasePointsQueryVariables>(GetBasePointsDocument, baseOptions);
        }
export type GetBasePointsQueryHookResult = ReturnType<typeof useGetBasePointsQuery>;
export type GetBasePointsLazyQueryHookResult = ReturnType<typeof useGetBasePointsLazyQuery>;
export type GetBasePointsQueryResult = Apollo.QueryResult<GetBasePointsQuery, GetBasePointsQueryVariables>;