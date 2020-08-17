/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetBitcoinPriceQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetBitcoinPriceQuery = (
  { __typename?: 'Query' }
  & Pick<Types.Query, 'getBitcoinPrice'>
);


export const GetBitcoinPriceDocument = gql`
    query GetBitcoinPrice {
  getBitcoinPrice
}
    `;

/**
 * __useGetBitcoinPriceQuery__
 *
 * To run a query within a React component, call `useGetBitcoinPriceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBitcoinPriceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBitcoinPriceQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBitcoinPriceQuery(baseOptions?: Apollo.QueryHookOptions<GetBitcoinPriceQuery, GetBitcoinPriceQueryVariables>) {
        return Apollo.useQuery<GetBitcoinPriceQuery, GetBitcoinPriceQueryVariables>(GetBitcoinPriceDocument, baseOptions);
      }
export function useGetBitcoinPriceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBitcoinPriceQuery, GetBitcoinPriceQueryVariables>) {
          return Apollo.useLazyQuery<GetBitcoinPriceQuery, GetBitcoinPriceQueryVariables>(GetBitcoinPriceDocument, baseOptions);
        }
export type GetBitcoinPriceQueryHookResult = ReturnType<typeof useGetBitcoinPriceQuery>;
export type GetBitcoinPriceLazyQueryHookResult = ReturnType<typeof useGetBitcoinPriceLazyQuery>;
export type GetBitcoinPriceQueryResult = Apollo.QueryResult<GetBitcoinPriceQuery, GetBitcoinPriceQueryVariables>;