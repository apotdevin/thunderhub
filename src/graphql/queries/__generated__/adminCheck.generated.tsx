/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type GetCanAdminQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetCanAdminQuery = (
  { __typename?: 'Query' }
  & Pick<Types.Query, 'adminCheck'>
);


export const GetCanAdminDocument = gql`
    query GetCanAdmin {
  adminCheck
}
    `;

/**
 * __useGetCanAdminQuery__
 *
 * To run a query within a React component, call `useGetCanAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCanAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCanAdminQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCanAdminQuery(baseOptions?: Apollo.QueryHookOptions<GetCanAdminQuery, GetCanAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCanAdminQuery, GetCanAdminQueryVariables>(GetCanAdminDocument, options);
      }
export function useGetCanAdminLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCanAdminQuery, GetCanAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCanAdminQuery, GetCanAdminQueryVariables>(GetCanAdminDocument, options);
        }
export type GetCanAdminQueryHookResult = ReturnType<typeof useGetCanAdminQuery>;
export type GetCanAdminLazyQueryHookResult = ReturnType<typeof useGetCanAdminLazyQuery>;
export type GetCanAdminQueryResult = Apollo.QueryResult<GetCanAdminQuery, GetCanAdminQueryVariables>;