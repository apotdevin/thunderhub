import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type GetAccountingReportQueryVariables = Types.Exact<{
  auth: Types.AuthType;
}>;

export type GetAccountingReportQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'getAccountingReport'
>;

export const GetAccountingReportDocument = gql`
  query GetAccountingReport($auth: authType!) {
    getAccountingReport(auth: $auth)
  }
`;

/**
 * __useGetAccountingReportQuery__
 *
 * To run a query within a React component, call `useGetAccountingReportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAccountingReportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAccountingReportQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetAccountingReportQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetAccountingReportQuery,
    GetAccountingReportQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetAccountingReportQuery,
    GetAccountingReportQueryVariables
  >(GetAccountingReportDocument, baseOptions);
}
export function useGetAccountingReportLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetAccountingReportQuery,
    GetAccountingReportQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetAccountingReportQuery,
    GetAccountingReportQueryVariables
  >(GetAccountingReportDocument, baseOptions);
}
export type GetAccountingReportQueryHookResult = ReturnType<
  typeof useGetAccountingReportQuery
>;
export type GetAccountingReportLazyQueryHookResult = ReturnType<
  typeof useGetAccountingReportLazyQuery
>;
export type GetAccountingReportQueryResult = ApolloReactCommon.QueryResult<
  GetAccountingReportQuery,
  GetAccountingReportQueryVariables
>;
