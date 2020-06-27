import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type GetChainTransactionsQueryVariables = Types.Exact<{
  auth: Types.AuthType;
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
  query GetChainTransactions($auth: authType!) {
    getChainTransactions(auth: $auth) {
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
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetChainTransactionsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetChainTransactionsQuery,
    GetChainTransactionsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetChainTransactionsQuery,
    GetChainTransactionsQueryVariables
  >(GetChainTransactionsDocument, baseOptions);
}
export function useGetChainTransactionsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetChainTransactionsQuery,
    GetChainTransactionsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
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
export type GetChainTransactionsQueryResult = ApolloReactCommon.QueryResult<
  GetChainTransactionsQuery,
  GetChainTransactionsQueryVariables
>;
