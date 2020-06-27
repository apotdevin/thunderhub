import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type GetCanAdminQueryVariables = Types.Exact<{
  auth: Types.AuthType;
}>;

export type GetCanAdminQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'adminCheck'
>;

export const GetCanAdminDocument = gql`
  query GetCanAdmin($auth: authType!) {
    adminCheck(auth: $auth)
  }
`;

/**
 * __useGetCanAdminQuery__
 *
 * To run a query within a React component, call `useGetCanAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCanAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCanAdminQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetCanAdminQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetCanAdminQuery,
    GetCanAdminQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetCanAdminQuery, GetCanAdminQueryVariables>(
    GetCanAdminDocument,
    baseOptions
  );
}
export function useGetCanAdminLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetCanAdminQuery,
    GetCanAdminQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetCanAdminQuery,
    GetCanAdminQueryVariables
  >(GetCanAdminDocument, baseOptions);
}
export type GetCanAdminQueryHookResult = ReturnType<typeof useGetCanAdminQuery>;
export type GetCanAdminLazyQueryHookResult = ReturnType<
  typeof useGetCanAdminLazyQuery
>;
export type GetCanAdminQueryResult = ApolloReactCommon.QueryResult<
  GetCanAdminQuery,
  GetCanAdminQueryVariables
>;
