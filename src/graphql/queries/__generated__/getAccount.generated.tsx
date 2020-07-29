import {
  gql,
  QueryHookOptions,
  useQuery,
  useLazyQuery,
  QueryResult,
  LazyQueryHookOptions,
} from '@apollo/client';
import * as Types from '../../types';

export type GetAccountQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetAccountQuery = { __typename?: 'Query' } & {
  getAccount?: Types.Maybe<
    { __typename?: 'serverAccountType' } & Pick<
      Types.ServerAccountType,
      'name' | 'id' | 'loggedIn' | 'type'
    >
  >;
};

export const GetAccountDocument = gql`
  query GetAccount {
    getAccount {
      name
      id
      loggedIn
      type
    }
  }
`;

/**
 * __useGetAccountQuery__
 *
 * To run a query within a React component, call `useGetAccountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAccountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAccountQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAccountQuery(
  baseOptions?: QueryHookOptions<GetAccountQuery, GetAccountQueryVariables>
) {
  return useQuery<GetAccountQuery, GetAccountQueryVariables>(
    GetAccountDocument,
    baseOptions
  );
}
export function useGetAccountLazyQuery(
  baseOptions?: LazyQueryHookOptions<GetAccountQuery, GetAccountQueryVariables>
) {
  return useLazyQuery<GetAccountQuery, GetAccountQueryVariables>(
    GetAccountDocument,
    baseOptions
  );
}
export type GetAccountQueryHookResult = ReturnType<typeof useGetAccountQuery>;
export type GetAccountLazyQueryHookResult = ReturnType<
  typeof useGetAccountLazyQuery
>;
export type GetAccountQueryResult = QueryResult<
  GetAccountQuery,
  GetAccountQueryVariables
>;
