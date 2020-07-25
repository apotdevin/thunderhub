import * as Types from '../../types';

import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';

export type GetLnPayQueryVariables = Types.Exact<{
  amount: Types.Scalars['Int'];
}>;

export type GetLnPayQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'getLnPay'
>;

export const GetLnPayDocument = gql`
  query GetLnPay($amount: Int!) {
    getLnPay(amount: $amount)
  }
`;

/**
 * __useGetLnPayQuery__
 *
 * To run a query within a React component, call `useGetLnPayQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLnPayQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLnPayQuery({
 *   variables: {
 *      amount: // value for 'amount'
 *   },
 * });
 */
export function useGetLnPayQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetLnPayQuery,
    GetLnPayQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetLnPayQuery, GetLnPayQueryVariables>(
    GetLnPayDocument,
    baseOptions
  );
}
export function useGetLnPayLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetLnPayQuery,
    GetLnPayQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<GetLnPayQuery, GetLnPayQueryVariables>(
    GetLnPayDocument,
    baseOptions
  );
}
export type GetLnPayQueryHookResult = ReturnType<typeof useGetLnPayQuery>;
export type GetLnPayLazyQueryHookResult = ReturnType<
  typeof useGetLnPayLazyQuery
>;
export type GetLnPayQueryResult = ApolloReactCommon.QueryResult<
  GetLnPayQuery,
  GetLnPayQueryVariables
>;
