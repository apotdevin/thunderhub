import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type VerifyBackupQueryVariables = Types.Exact<{
  backup: Types.Scalars['String'];
}>;

export type VerifyBackupQuery = { __typename?: 'Query'; verifyBackup: boolean };

export const VerifyBackupDocument = gql`
  query VerifyBackup($backup: String!) {
    verifyBackup(backup: $backup)
  }
`;

/**
 * __useVerifyBackupQuery__
 *
 * To run a query within a React component, call `useVerifyBackupQuery` and pass it any options that fit your needs.
 * When your component renders, `useVerifyBackupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVerifyBackupQuery({
 *   variables: {
 *      backup: // value for 'backup'
 *   },
 * });
 */
export function useVerifyBackupQuery(
  baseOptions: Apollo.QueryHookOptions<
    VerifyBackupQuery,
    VerifyBackupQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<VerifyBackupQuery, VerifyBackupQueryVariables>(
    VerifyBackupDocument,
    options
  );
}
export function useVerifyBackupLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    VerifyBackupQuery,
    VerifyBackupQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<VerifyBackupQuery, VerifyBackupQueryVariables>(
    VerifyBackupDocument,
    options
  );
}
export type VerifyBackupQueryHookResult = ReturnType<
  typeof useVerifyBackupQuery
>;
export type VerifyBackupLazyQueryHookResult = ReturnType<
  typeof useVerifyBackupLazyQuery
>;
export type VerifyBackupQueryResult = Apollo.QueryResult<
  VerifyBackupQuery,
  VerifyBackupQueryVariables
>;
