import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type GetAccountingReportQueryVariables = Types.Exact<{
  category?: Types.InputMaybe<Types.Scalars['String']>;
  currency?: Types.InputMaybe<Types.Scalars['String']>;
  fiat?: Types.InputMaybe<Types.Scalars['String']>;
  month?: Types.InputMaybe<Types.Scalars['String']>;
  year?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type GetAccountingReportQuery = {
  __typename?: 'Query';
  getAccountingReport: string;
};

export const GetAccountingReportDocument = gql`
  query GetAccountingReport(
    $category: String
    $currency: String
    $fiat: String
    $month: String
    $year: String
  ) {
    getAccountingReport(
      category: $category
      currency: $currency
      fiat: $fiat
      month: $month
      year: $year
    )
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
 *      category: // value for 'category'
 *      currency: // value for 'currency'
 *      fiat: // value for 'fiat'
 *      month: // value for 'month'
 *      year: // value for 'year'
 *   },
 * });
 */
export function useGetAccountingReportQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetAccountingReportQuery,
    GetAccountingReportQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetAccountingReportQuery,
    GetAccountingReportQueryVariables
  >(GetAccountingReportDocument, options);
}
export function useGetAccountingReportLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAccountingReportQuery,
    GetAccountingReportQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetAccountingReportQuery,
    GetAccountingReportQueryVariables
  >(GetAccountingReportDocument, options);
}
export type GetAccountingReportQueryHookResult = ReturnType<
  typeof useGetAccountingReportQuery
>;
export type GetAccountingReportLazyQueryHookResult = ReturnType<
  typeof useGetAccountingReportLazyQuery
>;
export type GetAccountingReportQueryResult = Apollo.QueryResult<
  GetAccountingReportQuery,
  GetAccountingReportQueryVariables
>;
