/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type GetUtxosQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetUtxosQuery = (
  { __typename?: 'Query' }
  & { getUtxos?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'getUtxosType' }
    & Pick<Types.GetUtxosType, 'address' | 'address_format' | 'confirmation_count' | 'output_script' | 'tokens' | 'transaction_id' | 'transaction_vout'>
  )>>> }
);


export const GetUtxosDocument = gql`
    query GetUtxos {
  getUtxos {
    address
    address_format
    confirmation_count
    output_script
    tokens
    transaction_id
    transaction_vout
  }
}
    `;

/**
 * __useGetUtxosQuery__
 *
 * To run a query within a React component, call `useGetUtxosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUtxosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUtxosQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUtxosQuery(baseOptions?: Apollo.QueryHookOptions<GetUtxosQuery, GetUtxosQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUtxosQuery, GetUtxosQueryVariables>(GetUtxosDocument, options);
      }
export function useGetUtxosLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUtxosQuery, GetUtxosQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUtxosQuery, GetUtxosQueryVariables>(GetUtxosDocument, options);
        }
export type GetUtxosQueryHookResult = ReturnType<typeof useGetUtxosQuery>;
export type GetUtxosLazyQueryHookResult = ReturnType<typeof useGetUtxosLazyQuery>;
export type GetUtxosQueryResult = Apollo.QueryResult<GetUtxosQuery, GetUtxosQueryVariables>;