import * as Types from '../../types';

import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';

export type GetBackupsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetBackupsQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'getBackups'
>;

export const GetBackupsDocument = gql`
  query GetBackups {
    getBackups
  }
`;

/**
 * __useGetBackupsQuery__
 *
 * To run a query within a React component, call `useGetBackupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBackupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBackupsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBackupsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetBackupsQuery,
    GetBackupsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetBackupsQuery, GetBackupsQueryVariables>(
    GetBackupsDocument,
    baseOptions
  );
}
export function useGetBackupsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetBackupsQuery,
    GetBackupsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetBackupsQuery,
    GetBackupsQueryVariables
  >(GetBackupsDocument, baseOptions);
}
export type GetBackupsQueryHookResult = ReturnType<typeof useGetBackupsQuery>;
export type GetBackupsLazyQueryHookResult = ReturnType<
  typeof useGetBackupsLazyQuery
>;
export type GetBackupsQueryResult = ApolloReactCommon.QueryResult<
  GetBackupsQuery,
  GetBackupsQueryVariables
>;
