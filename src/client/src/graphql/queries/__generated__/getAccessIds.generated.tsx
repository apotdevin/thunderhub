import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetAccessIdsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetAccessIdsQuery = {
  __typename?: 'Query';
  lightning: {
    __typename?: 'LightningQueries';
    get_access_ids: { __typename?: 'AccessIds'; ids: Array<string> };
  };
};

export const GetAccessIdsDocument = gql`
  query GetAccessIds {
    lightning {
      get_access_ids {
        ids
      }
    }
  }
`;

/**
 * __useGetAccessIdsQuery__
 *
 * To run a query within a React component, call `useGetAccessIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAccessIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAccessIdsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAccessIdsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetAccessIdsQuery,
    GetAccessIdsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAccessIdsQuery, GetAccessIdsQueryVariables>(
    GetAccessIdsDocument,
    options
  );
}
export function useGetAccessIdsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAccessIdsQuery,
    GetAccessIdsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAccessIdsQuery, GetAccessIdsQueryVariables>(
    GetAccessIdsDocument,
    options
  );
}
// @ts-ignore
export function useGetAccessIdsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetAccessIdsQuery,
    GetAccessIdsQueryVariables
  >
): Apollo.UseSuspenseQueryResult<GetAccessIdsQuery, GetAccessIdsQueryVariables>;
export function useGetAccessIdsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetAccessIdsQuery,
        GetAccessIdsQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetAccessIdsQuery | undefined,
  GetAccessIdsQueryVariables
>;
export function useGetAccessIdsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetAccessIdsQuery,
        GetAccessIdsQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetAccessIdsQuery, GetAccessIdsQueryVariables>(
    GetAccessIdsDocument,
    options
  );
}
export type GetAccessIdsQueryHookResult = ReturnType<
  typeof useGetAccessIdsQuery
>;
export type GetAccessIdsLazyQueryHookResult = ReturnType<
  typeof useGetAccessIdsLazyQuery
>;
export type GetAccessIdsSuspenseQueryHookResult = ReturnType<
  typeof useGetAccessIdsSuspenseQuery
>;
export type GetAccessIdsQueryResult = Apollo.QueryResult<
  GetAccessIdsQuery,
  GetAccessIdsQueryVariables
>;
