/* eslint-disable */
import * as Types from '../../types';

import * as Apollo from '@apollo/client';
const gql = Apollo.gql;

export type GetForwardReportQueryVariables = Types.Exact<{
  time?: Types.Maybe<Types.Scalars['String']>;
}>;

export type GetForwardReportQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'getForwardReport'
>;

export const GetForwardReportDocument = gql`
  query GetForwardReport($time: String) {
    getForwardReport(time: $time)
  }
`;

/**
 * __useGetForwardReportQuery__
 *
 * To run a query within a React component, call `useGetForwardReportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetForwardReportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetForwardReportQuery({
 *   variables: {
 *      time: // value for 'time'
 *   },
 * });
 */
export function useGetForwardReportQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetForwardReportQuery,
    GetForwardReportQueryVariables
  >
) {
  return Apollo.useQuery<GetForwardReportQuery, GetForwardReportQueryVariables>(
    GetForwardReportDocument,
    baseOptions
  );
}
export function useGetForwardReportLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetForwardReportQuery,
    GetForwardReportQueryVariables
  >
) {
  return Apollo.useLazyQuery<
    GetForwardReportQuery,
    GetForwardReportQueryVariables
  >(GetForwardReportDocument, baseOptions);
}
export type GetForwardReportQueryHookResult = ReturnType<
  typeof useGetForwardReportQuery
>;
export type GetForwardReportLazyQueryHookResult = ReturnType<
  typeof useGetForwardReportLazyQuery
>;
export type GetForwardReportQueryResult = Apollo.QueryResult<
  GetForwardReportQuery,
  GetForwardReportQueryVariables
>;
