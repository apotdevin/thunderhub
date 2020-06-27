import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type GetLatestVersionQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetLatestVersionQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'getLatestVersion'
>;

export const GetLatestVersionDocument = gql`
  query GetLatestVersion {
    getLatestVersion
  }
`;

/**
 * __useGetLatestVersionQuery__
 *
 * To run a query within a React component, call `useGetLatestVersionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLatestVersionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLatestVersionQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLatestVersionQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetLatestVersionQuery,
    GetLatestVersionQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetLatestVersionQuery,
    GetLatestVersionQueryVariables
  >(GetLatestVersionDocument, baseOptions);
}
export function useGetLatestVersionLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetLatestVersionQuery,
    GetLatestVersionQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetLatestVersionQuery,
    GetLatestVersionQueryVariables
  >(GetLatestVersionDocument, baseOptions);
}
export type GetLatestVersionQueryHookResult = ReturnType<
  typeof useGetLatestVersionQuery
>;
export type GetLatestVersionLazyQueryHookResult = ReturnType<
  typeof useGetLatestVersionLazyQuery
>;
export type GetLatestVersionQueryResult = ApolloReactCommon.QueryResult<
  GetLatestVersionQuery,
  GetLatestVersionQueryVariables
>;
