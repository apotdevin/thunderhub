import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetServerAccountsQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetServerAccountsQuery = {
  __typename?: 'Query';
  getServerAccounts: Array<{
    __typename?: 'ServerAccount';
    name: string;
    id: string;
    loggedIn: boolean;
    type: string;
  }>;
};

export const GetServerAccountsDocument = gql`
  query GetServerAccounts {
    getServerAccounts {
      name
      id
      loggedIn
      type
    }
  }
`;

/**
 * __useGetServerAccountsQuery__
 *
 * To run a query within a React component, call `useGetServerAccountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetServerAccountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetServerAccountsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetServerAccountsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetServerAccountsQuery,
    GetServerAccountsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetServerAccountsQuery,
    GetServerAccountsQueryVariables
  >(GetServerAccountsDocument, options);
}
export function useGetServerAccountsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetServerAccountsQuery,
    GetServerAccountsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetServerAccountsQuery,
    GetServerAccountsQueryVariables
  >(GetServerAccountsDocument, options);
}
// @ts-ignore
export function useGetServerAccountsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetServerAccountsQuery,
    GetServerAccountsQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  GetServerAccountsQuery,
  GetServerAccountsQueryVariables
>;
export function useGetServerAccountsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetServerAccountsQuery,
        GetServerAccountsQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetServerAccountsQuery | undefined,
  GetServerAccountsQueryVariables
>;
export function useGetServerAccountsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetServerAccountsQuery,
        GetServerAccountsQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetServerAccountsQuery,
    GetServerAccountsQueryVariables
  >(GetServerAccountsDocument, options);
}
export type GetServerAccountsQueryHookResult = ReturnType<
  typeof useGetServerAccountsQuery
>;
export type GetServerAccountsLazyQueryHookResult = ReturnType<
  typeof useGetServerAccountsLazyQuery
>;
export type GetServerAccountsSuspenseQueryHookResult = ReturnType<
  typeof useGetServerAccountsSuspenseQuery
>;
export type GetServerAccountsQueryResult = Apollo.QueryResult<
  GetServerAccountsQuery,
  GetServerAccountsQueryVariables
>;
