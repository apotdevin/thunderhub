import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetSessionInfoQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetSessionInfoQuery = {
  __typename?: 'Query';
  public: {
    __typename?: 'PublicQueries';
    id: string;
    get_session_info: {
      __typename?: 'SessionInfo';
      loggedIn: boolean;
      type?: string | null;
      name?: string | null;
      slug?: string | null;
    };
  };
};

export const GetSessionInfoDocument = gql`
  query GetSessionInfo {
    public {
      id
      get_session_info {
        loggedIn
        type
        name
        slug
      }
    }
  }
`;

/**
 * __useGetSessionInfoQuery__
 *
 * To run a query within a React component, call `useGetSessionInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSessionInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSessionInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSessionInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetSessionInfoQuery,
    GetSessionInfoQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetSessionInfoQuery, GetSessionInfoQueryVariables>(
    GetSessionInfoDocument,
    options
  );
}
export function useGetSessionInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetSessionInfoQuery,
    GetSessionInfoQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetSessionInfoQuery, GetSessionInfoQueryVariables>(
    GetSessionInfoDocument,
    options
  );
}
// @ts-ignore
export function useGetSessionInfoSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetSessionInfoQuery,
    GetSessionInfoQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  GetSessionInfoQuery,
  GetSessionInfoQueryVariables
>;
export function useGetSessionInfoSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetSessionInfoQuery,
        GetSessionInfoQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetSessionInfoQuery | undefined,
  GetSessionInfoQueryVariables
>;
export function useGetSessionInfoSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetSessionInfoQuery,
        GetSessionInfoQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetSessionInfoQuery,
    GetSessionInfoQueryVariables
  >(GetSessionInfoDocument, options);
}
export type GetSessionInfoQueryHookResult = ReturnType<
  typeof useGetSessionInfoQuery
>;
export type GetSessionInfoLazyQueryHookResult = ReturnType<
  typeof useGetSessionInfoLazyQuery
>;
export type GetSessionInfoSuspenseQueryHookResult = ReturnType<
  typeof useGetSessionInfoSuspenseQuery
>;
export type GetSessionInfoQueryResult = Apollo.QueryResult<
  GetSessionInfoQuery,
  GetSessionInfoQueryVariables
>;
