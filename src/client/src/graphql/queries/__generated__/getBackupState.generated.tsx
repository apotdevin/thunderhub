import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetBackupStateQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetBackupStateQuery = {
  __typename?: 'Query';
  getBackupState: boolean;
};

export const GetBackupStateDocument = gql`
  query GetBackupState {
    getBackupState
  }
`;

/**
 * __useGetBackupStateQuery__
 *
 * To run a query within a React component, call `useGetBackupStateQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBackupStateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBackupStateQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBackupStateQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetBackupStateQuery,
    GetBackupStateQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetBackupStateQuery, GetBackupStateQueryVariables>(
    GetBackupStateDocument,
    options
  );
}
export function useGetBackupStateLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetBackupStateQuery,
    GetBackupStateQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetBackupStateQuery, GetBackupStateQueryVariables>(
    GetBackupStateDocument,
    options
  );
}
export type GetBackupStateQueryHookResult = ReturnType<
  typeof useGetBackupStateQuery
>;
export type GetBackupStateLazyQueryHookResult = ReturnType<
  typeof useGetBackupStateLazyQuery
>;
export type GetBackupStateQueryResult = Apollo.QueryResult<
  GetBackupStateQuery,
  GetBackupStateQueryVariables
>;
