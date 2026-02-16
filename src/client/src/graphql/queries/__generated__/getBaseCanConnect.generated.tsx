import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetBaseCanConnectQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetBaseCanConnectQuery = {
  __typename?: 'Query';
  getBaseCanConnect: boolean;
};

export const GetBaseCanConnectDocument = gql`
  query GetBaseCanConnect {
    getBaseCanConnect
  }
`;

/**
 * __useGetBaseCanConnectQuery__
 *
 * To run a query within a React component, call `useGetBaseCanConnectQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBaseCanConnectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBaseCanConnectQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBaseCanConnectQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetBaseCanConnectQuery,
    GetBaseCanConnectQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetBaseCanConnectQuery,
    GetBaseCanConnectQueryVariables
  >(GetBaseCanConnectDocument, options);
}
export function useGetBaseCanConnectLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetBaseCanConnectQuery,
    GetBaseCanConnectQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetBaseCanConnectQuery,
    GetBaseCanConnectQueryVariables
  >(GetBaseCanConnectDocument, options);
}
// @ts-ignore
export function useGetBaseCanConnectSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetBaseCanConnectQuery,
    GetBaseCanConnectQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  GetBaseCanConnectQuery,
  GetBaseCanConnectQueryVariables
>;
export function useGetBaseCanConnectSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetBaseCanConnectQuery,
        GetBaseCanConnectQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetBaseCanConnectQuery | undefined,
  GetBaseCanConnectQueryVariables
>;
export function useGetBaseCanConnectSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetBaseCanConnectQuery,
        GetBaseCanConnectQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetBaseCanConnectQuery,
    GetBaseCanConnectQueryVariables
  >(GetBaseCanConnectDocument, options);
}
export type GetBaseCanConnectQueryHookResult = ReturnType<
  typeof useGetBaseCanConnectQuery
>;
export type GetBaseCanConnectLazyQueryHookResult = ReturnType<
  typeof useGetBaseCanConnectLazyQuery
>;
export type GetBaseCanConnectSuspenseQueryHookResult = ReturnType<
  typeof useGetBaseCanConnectSuspenseQuery
>;
export type GetBaseCanConnectQueryResult = Apollo.QueryResult<
  GetBaseCanConnectQuery,
  GetBaseCanConnectQueryVariables
>;
