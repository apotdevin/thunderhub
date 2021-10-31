/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type GetBitcoinFeesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetBitcoinFeesQuery = { __typename?: 'Query', getBitcoinFees?: { __typename?: 'bitcoinFeeType', fast?: number | null | undefined, halfHour?: number | null | undefined, hour?: number | null | undefined, minimum?: number | null | undefined } | null | undefined };


export const GetBitcoinFeesDocument = gql`
    query GetBitcoinFees {
  getBitcoinFees {
    fast
    halfHour
    hour
    minimum
  }
}
    `;

/**
 * __useGetBitcoinFeesQuery__
 *
 * To run a query within a React component, call `useGetBitcoinFeesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBitcoinFeesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBitcoinFeesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBitcoinFeesQuery(baseOptions?: Apollo.QueryHookOptions<GetBitcoinFeesQuery, GetBitcoinFeesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBitcoinFeesQuery, GetBitcoinFeesQueryVariables>(GetBitcoinFeesDocument, options);
      }
export function useGetBitcoinFeesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBitcoinFeesQuery, GetBitcoinFeesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBitcoinFeesQuery, GetBitcoinFeesQueryVariables>(GetBitcoinFeesDocument, options);
        }
export type GetBitcoinFeesQueryHookResult = ReturnType<typeof useGetBitcoinFeesQuery>;
export type GetBitcoinFeesLazyQueryHookResult = ReturnType<typeof useGetBitcoinFeesLazyQuery>;
export type GetBitcoinFeesQueryResult = Apollo.QueryResult<GetBitcoinFeesQuery, GetBitcoinFeesQueryVariables>;