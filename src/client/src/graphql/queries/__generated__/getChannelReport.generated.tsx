import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetLiquidReportQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetLiquidReportQuery = {
  __typename?: 'Query';
  getChannelReport: {
    __typename?: 'ChannelReport';
    local: number;
    remote: number;
    maxIn: number;
    maxOut: number;
    commit: number;
    totalPendingHtlc: number;
    outgoingPendingHtlc: number;
    incomingPendingHtlc: number;
  };
};

export const GetLiquidReportDocument = gql`
  query GetLiquidReport {
    getChannelReport {
      local
      remote
      maxIn
      maxOut
      commit
      totalPendingHtlc
      outgoingPendingHtlc
      incomingPendingHtlc
    }
  }
`;

/**
 * __useGetLiquidReportQuery__
 *
 * To run a query within a React component, call `useGetLiquidReportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLiquidReportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLiquidReportQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLiquidReportQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetLiquidReportQuery,
    GetLiquidReportQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetLiquidReportQuery, GetLiquidReportQueryVariables>(
    GetLiquidReportDocument,
    options
  );
}
export function useGetLiquidReportLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLiquidReportQuery,
    GetLiquidReportQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetLiquidReportQuery,
    GetLiquidReportQueryVariables
  >(GetLiquidReportDocument, options);
}
// @ts-ignore
export function useGetLiquidReportSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetLiquidReportQuery,
    GetLiquidReportQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  GetLiquidReportQuery,
  GetLiquidReportQueryVariables
>;
export function useGetLiquidReportSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetLiquidReportQuery,
        GetLiquidReportQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetLiquidReportQuery | undefined,
  GetLiquidReportQueryVariables
>;
export function useGetLiquidReportSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetLiquidReportQuery,
        GetLiquidReportQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetLiquidReportQuery,
    GetLiquidReportQueryVariables
  >(GetLiquidReportDocument, options);
}
export type GetLiquidReportQueryHookResult = ReturnType<
  typeof useGetLiquidReportQuery
>;
export type GetLiquidReportLazyQueryHookResult = ReturnType<
  typeof useGetLiquidReportLazyQuery
>;
export type GetLiquidReportSuspenseQueryHookResult = ReturnType<
  typeof useGetLiquidReportSuspenseQuery
>;
export type GetLiquidReportQueryResult = Apollo.QueryResult<
  GetLiquidReportQuery,
  GetLiquidReportQueryVariables
>;
