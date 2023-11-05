import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetLnMarketsStatusQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetLnMarketsStatusQuery = {
  __typename?: 'Query';
  getLnMarketsStatus: string;
};

export const GetLnMarketsStatusDocument = gql`
  query GetLnMarketsStatus {
    getLnMarketsStatus
  }
`;

/**
 * __useGetLnMarketsStatusQuery__
 *
 * To run a query within a React component, call `useGetLnMarketsStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLnMarketsStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLnMarketsStatusQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLnMarketsStatusQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetLnMarketsStatusQuery,
    GetLnMarketsStatusQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetLnMarketsStatusQuery,
    GetLnMarketsStatusQueryVariables
  >(GetLnMarketsStatusDocument, options);
}
export function useGetLnMarketsStatusLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLnMarketsStatusQuery,
    GetLnMarketsStatusQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetLnMarketsStatusQuery,
    GetLnMarketsStatusQueryVariables
  >(GetLnMarketsStatusDocument, options);
}
export function useGetLnMarketsStatusSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetLnMarketsStatusQuery,
    GetLnMarketsStatusQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetLnMarketsStatusQuery,
    GetLnMarketsStatusQueryVariables
  >(GetLnMarketsStatusDocument, options);
}
export type GetLnMarketsStatusQueryHookResult = ReturnType<
  typeof useGetLnMarketsStatusQuery
>;
export type GetLnMarketsStatusLazyQueryHookResult = ReturnType<
  typeof useGetLnMarketsStatusLazyQuery
>;
export type GetLnMarketsStatusSuspenseQueryHookResult = ReturnType<
  typeof useGetLnMarketsStatusSuspenseQuery
>;
export type GetLnMarketsStatusQueryResult = Apollo.QueryResult<
  GetLnMarketsStatusQuery,
  GetLnMarketsStatusQueryVariables
>;
