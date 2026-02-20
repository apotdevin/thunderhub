import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetAmbossUserQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetAmbossUserQuery = {
  __typename?: 'Query';
  getAmbossUser?: {
    __typename?: 'AmbossUser';
    subscription: {
      __typename?: 'AmbossSubscription';
      end_date: string;
      subscribed: boolean;
      upgradable: boolean;
    };
    backups: {
      __typename?: 'UserBackupInfo';
      last_update?: string | null;
      last_update_size?: string | null;
      total_size_saved: string;
    };
  } | null;
};

export const GetAmbossUserDocument = gql`
  query GetAmbossUser {
    getAmbossUser {
      subscription {
        end_date
        subscribed
        upgradable
      }
      backups {
        last_update
        last_update_size
        total_size_saved
      }
    }
  }
`;

/**
 * __useGetAmbossUserQuery__
 *
 * To run a query within a React component, call `useGetAmbossUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAmbossUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAmbossUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAmbossUserQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetAmbossUserQuery,
    GetAmbossUserQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAmbossUserQuery, GetAmbossUserQueryVariables>(
    GetAmbossUserDocument,
    options
  );
}
export function useGetAmbossUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAmbossUserQuery,
    GetAmbossUserQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAmbossUserQuery, GetAmbossUserQueryVariables>(
    GetAmbossUserDocument,
    options
  );
}
// @ts-ignore
export function useGetAmbossUserSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetAmbossUserQuery,
    GetAmbossUserQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  GetAmbossUserQuery,
  GetAmbossUserQueryVariables
>;
export function useGetAmbossUserSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetAmbossUserQuery,
        GetAmbossUserQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetAmbossUserQuery | undefined,
  GetAmbossUserQueryVariables
>;
export function useGetAmbossUserSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetAmbossUserQuery,
        GetAmbossUserQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetAmbossUserQuery,
    GetAmbossUserQueryVariables
  >(GetAmbossUserDocument, options);
}
export type GetAmbossUserQueryHookResult = ReturnType<
  typeof useGetAmbossUserQuery
>;
export type GetAmbossUserLazyQueryHookResult = ReturnType<
  typeof useGetAmbossUserLazyQuery
>;
export type GetAmbossUserSuspenseQueryHookResult = ReturnType<
  typeof useGetAmbossUserSuspenseQuery
>;
export type GetAmbossUserQueryResult = Apollo.QueryResult<
  GetAmbossUserQuery,
  GetAmbossUserQueryVariables
>;
