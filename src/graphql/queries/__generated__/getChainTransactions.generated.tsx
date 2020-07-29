import {
  gql,
  QueryHookOptions,
  useQuery,
  useLazyQuery,
  QueryResult,
  LazyQueryHookOptions,
} from '@apollo/client';
import * as Types from '../../types';

export type GetChainTransactionsQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetChainTransactionsQuery = { __typename?: 'Query' } & {
  getChainTransactions?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'getTransactionsType' } & Pick<
          Types.GetTransactionsType,
          | 'block_id'
          | 'confirmation_count'
          | 'confirmation_height'
          | 'created_at'
          | 'fee'
          | 'id'
          | 'output_addresses'
          | 'tokens'
        >
      >
    >
  >;
};

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
export function useGetChainTransactionsQuery(
  baseOptions?: QueryHookOptions<
    GetChainTransactionsQuery,
    GetChainTransactionsQueryVariables
  >
) {
  return useQuery<
    GetChainTransactionsQuery,
    GetChainTransactionsQueryVariables
  >(GetChainTransactionsDocument, baseOptions);
}
export function useGetChainTransactionsLazyQuery(
  baseOptions?: LazyQueryHookOptions<
    GetChainTransactionsQuery,
    GetChainTransactionsQueryVariables
  >
) {
  return useLazyQuery<
    GetChainTransactionsQuery,
    GetChainTransactionsQueryVariables
  >(GetChainTransactionsDocument, baseOptions);
}
export type GetChainTransactionsQueryHookResult = ReturnType<
  typeof useGetChainTransactionsQuery
>;
export type GetChainTransactionsLazyQueryHookResult = ReturnType<
  typeof useGetChainTransactionsLazyQuery
>;
export type GetChainTransactionsQueryResult = QueryResult<
  GetChainTransactionsQuery,
  GetChainTransactionsQueryVariables
>;
