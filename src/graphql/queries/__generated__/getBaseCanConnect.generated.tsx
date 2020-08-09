import * as Apollo from '@apollo/client';
import * as Types from '../../types';

const gql = Apollo.gql;

export type GetBaseCanConnectQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetBaseCanConnectQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'getBaseCanConnect'
>;

export const GetBaseCanConnectDocument = gql`
  query GetBaseCanConnect {
    getBaseCanConnect
  }
`;

/**
 * __useGetBaseCanConnectQuery__
 *
 * To run a query within a React component, call `useGetBaseCanConnectQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBaseCanConnectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBaseCanConnectQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBaseCanConnectQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetBaseCanConnectQuery,
    GetBaseCanConnectQueryVariables
  >
) {
  return Apollo.useQuery<
    GetBaseCanConnectQuery,
    GetBaseCanConnectQueryVariables
  >(GetBaseCanConnectDocument, baseOptions);
}
export function useGetBaseCanConnectLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetBaseCanConnectQuery,
    GetBaseCanConnectQueryVariables
  >
) {
  return Apollo.useLazyQuery<
    GetBaseCanConnectQuery,
    GetBaseCanConnectQueryVariables
  >(GetBaseCanConnectDocument, baseOptions);
}
export type GetBaseCanConnectQueryHookResult = ReturnType<
  typeof useGetBaseCanConnectQuery
>;
export type GetBaseCanConnectLazyQueryHookResult = ReturnType<
  typeof useGetBaseCanConnectLazyQuery
>;
export type GetBaseCanConnectQueryResult = Apollo.QueryResult<
  GetBaseCanConnectQuery,
  GetBaseCanConnectQueryVariables
>;
