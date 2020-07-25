import * as Types from '../../types';

import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';

export type GetSessionTokenQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
  password: Types.Scalars['String'];
}>;

export type GetSessionTokenQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'getSessionToken'
>;

export const GetSessionTokenDocument = gql`
  query GetSessionToken($id: String!, $password: String!) {
    getSessionToken(id: $id, password: $password)
  }
`;

/**
 * __useGetSessionTokenQuery__
 *
 * To run a query within a React component, call `useGetSessionTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSessionTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSessionTokenQuery({
 *   variables: {
 *      id: // value for 'id'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useGetSessionTokenQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetSessionTokenQuery,
    GetSessionTokenQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetSessionTokenQuery,
    GetSessionTokenQueryVariables
  >(GetSessionTokenDocument, baseOptions);
}
export function useGetSessionTokenLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetSessionTokenQuery,
    GetSessionTokenQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetSessionTokenQuery,
    GetSessionTokenQueryVariables
  >(GetSessionTokenDocument, baseOptions);
}
export type GetSessionTokenQueryHookResult = ReturnType<
  typeof useGetSessionTokenQuery
>;
export type GetSessionTokenLazyQueryHookResult = ReturnType<
  typeof useGetSessionTokenLazyQuery
>;
export type GetSessionTokenQueryResult = ApolloReactCommon.QueryResult<
  GetSessionTokenQuery,
  GetSessionTokenQueryVariables
>;
