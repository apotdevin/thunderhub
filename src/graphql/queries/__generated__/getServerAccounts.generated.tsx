/* eslint-disable */
import * as Types from '../../types';

import * as Apollo from '@apollo/client';
const gql = Apollo.gql;

export type GetServerAccountsQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetServerAccountsQuery = { __typename?: 'Query' } & {
  getServerAccounts?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'serverAccountType' } & Pick<
          Types.ServerAccountType,
          'name' | 'id' | 'loggedIn' | 'type'
        >
      >
    >
  >;
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
  return Apollo.useQuery<
    GetServerAccountsQuery,
    GetServerAccountsQueryVariables
  >(GetServerAccountsDocument, baseOptions);
}
export function useGetServerAccountsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetServerAccountsQuery,
    GetServerAccountsQueryVariables
  >
) {
  return Apollo.useLazyQuery<
    GetServerAccountsQuery,
    GetServerAccountsQueryVariables
  >(GetServerAccountsDocument, baseOptions);
}
export type GetServerAccountsQueryHookResult = ReturnType<
  typeof useGetServerAccountsQuery
>;
export type GetServerAccountsLazyQueryHookResult = ReturnType<
  typeof useGetServerAccountsLazyQuery
>;
export type GetServerAccountsQueryResult = Apollo.QueryResult<
  GetServerAccountsQuery,
  GetServerAccountsQueryVariables
>;
