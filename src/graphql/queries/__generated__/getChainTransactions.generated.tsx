/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type GetChainTransactionsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetChainTransactionsQuery = { __typename?: 'Query', getChainTransactions?: Array<{ __typename?: 'getTransactionsType', block_id?: string | null | undefined, confirmation_count?: number | null | undefined, confirmation_height?: number | null | undefined, created_at: string, fee?: number | null | undefined, id: string, output_addresses: Array<string | null | undefined>, tokens: number } | null | undefined> | null | undefined };


export const GetChainTransactionsDocument = gql`
    query GetChainTransactions {
  getChainTransactions {
    block_id
    confirmation_count
    confirmation_height
    created_at
    fee
    id
    output_addresses
    tokens
  }
}
    `;

/**
 * __useGetChainTransactionsQuery__
 *
 * To run a query within a React component, call `useGetChainTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChainTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChainTransactionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetChainTransactionsQuery(baseOptions?: Apollo.QueryHookOptions<GetChainTransactionsQuery, GetChainTransactionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChainTransactionsQuery, GetChainTransactionsQueryVariables>(GetChainTransactionsDocument, options);
      }
export function useGetChainTransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChainTransactionsQuery, GetChainTransactionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChainTransactionsQuery, GetChainTransactionsQueryVariables>(GetChainTransactionsDocument, options);
        }
export type GetChainTransactionsQueryHookResult = ReturnType<typeof useGetChainTransactionsQuery>;
export type GetChainTransactionsLazyQueryHookResult = ReturnType<typeof useGetChainTransactionsLazyQuery>;
export type GetChainTransactionsQueryResult = Apollo.QueryResult<GetChainTransactionsQuery, GetChainTransactionsQueryVariables>;