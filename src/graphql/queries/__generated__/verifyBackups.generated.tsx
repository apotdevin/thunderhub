import {
  gql,
  QueryHookOptions,
  useQuery,
  useLazyQuery,
  QueryResult,
  LazyQueryHookOptions,
} from '@apollo/client';
import * as Types from '../../types';

export type VerifyBackupsQueryVariables = Types.Exact<{
  backup: Types.Scalars['String'];
}>;

export type VerifyBackupsQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'verifyBackups'
>;

export const VerifyBackupsDocument = gql`
  query VerifyBackups($backup: String!) {
    verifyBackups(backup: $backup)
  }
`;

/**
 * __useVerifyBackupsQuery__
 *
 * To run a query within a React component, call `useVerifyBackupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useVerifyBackupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVerifyBackupsQuery({
 *   variables: {
 *      backup: // value for 'backup'
 *   },
 * });
 */
export function useVerifyBackupsQuery(
  baseOptions?: QueryHookOptions<
    VerifyBackupsQuery,
    VerifyBackupsQueryVariables
  >
) {
  return useQuery<VerifyBackupsQuery, VerifyBackupsQueryVariables>(
    VerifyBackupsDocument,
    baseOptions
  );
}
export function useVerifyBackupsLazyQuery(
  baseOptions?: LazyQueryHookOptions<
    VerifyBackupsQuery,
    VerifyBackupsQueryVariables
  >
) {
  return useLazyQuery<VerifyBackupsQuery, VerifyBackupsQueryVariables>(
    VerifyBackupsDocument,
    baseOptions
  );
}
export type VerifyBackupsQueryHookResult = ReturnType<
  typeof useVerifyBackupsQuery
>;
export type VerifyBackupsLazyQueryHookResult = ReturnType<
  typeof useVerifyBackupsLazyQuery
>;
export type VerifyBackupsQueryResult = QueryResult<
  VerifyBackupsQuery,
  VerifyBackupsQueryVariables
>;
