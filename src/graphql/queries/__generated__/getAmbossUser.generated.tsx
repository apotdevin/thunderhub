/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type GetAmbossUserQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAmbossUserQuery = { __typename?: 'Query', getAmbossUser?: { __typename?: 'AmbossUserType', subscription?: { __typename?: 'AmbossSubscriptionType', end_date: string, subscribed: boolean, upgradable: boolean } | null | undefined } | null | undefined };


export const GetAmbossUserDocument = gql`
    query GetAmbossUser {
  getAmbossUser {
    subscription {
      end_date
      subscribed
      upgradable
    }
  }
}
    `;

/**
 * __useGetAmbossUserQuery__
 *
 * To run a query within a React component, call `useGetAmbossUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAmbossUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAmbossUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAmbossUserQuery(baseOptions?: Apollo.QueryHookOptions<GetAmbossUserQuery, GetAmbossUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAmbossUserQuery, GetAmbossUserQueryVariables>(GetAmbossUserDocument, options);
      }
export function useGetAmbossUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAmbossUserQuery, GetAmbossUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAmbossUserQuery, GetAmbossUserQueryVariables>(GetAmbossUserDocument, options);
        }
export type GetAmbossUserQueryHookResult = ReturnType<typeof useGetAmbossUserQuery>;
export type GetAmbossUserLazyQueryHookResult = ReturnType<typeof useGetAmbossUserLazyQuery>;
export type GetAmbossUserQueryResult = Apollo.QueryResult<GetAmbossUserQuery, GetAmbossUserQueryVariables>;