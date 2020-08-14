/* eslint-disable */
import * as Types from '../../types';

import * as Apollo from '@apollo/client';
const gql = Apollo.gql;

export type GetAuthTokenQueryVariables = Types.Exact<{
  cookie?: Types.Maybe<Types.Scalars['String']>;
}>;

export type GetAuthTokenQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'getAuthToken'
>;

export const GetAuthTokenDocument = gql`
  query GetAuthToken($cookie: String) {
    getAuthToken(cookie: $cookie)
  }
`;

/**
 * __useGetAuthTokenQuery__
 *
 * To run a query within a React component, call `useGetAuthTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAuthTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAuthTokenQuery({
 *   variables: {
 *      cookie: // value for 'cookie'
 *   },
 * });
 */
export function useGetAuthTokenQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetAuthTokenQuery,
    GetAuthTokenQueryVariables
  >
) {
  return Apollo.useQuery<GetAuthTokenQuery, GetAuthTokenQueryVariables>(
    GetAuthTokenDocument,
    baseOptions
  );
}
export function useGetAuthTokenLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAuthTokenQuery,
    GetAuthTokenQueryVariables
  >
) {
  return Apollo.useLazyQuery<GetAuthTokenQuery, GetAuthTokenQueryVariables>(
    GetAuthTokenDocument,
    baseOptions
  );
}
export type GetAuthTokenQueryHookResult = ReturnType<
  typeof useGetAuthTokenQuery
>;
export type GetAuthTokenLazyQueryHookResult = ReturnType<
  typeof useGetAuthTokenLazyQuery
>;
export type GetAuthTokenQueryResult = Apollo.QueryResult<
  GetAuthTokenQuery,
  GetAuthTokenQueryVariables
>;
