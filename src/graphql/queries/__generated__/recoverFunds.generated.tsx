import {
  gql,
  QueryHookOptions,
  useQuery,
  useLazyQuery,
  QueryResult,
  LazyQueryHookOptions,
} from '@apollo/client';
import * as Types from '../../types';

export type RecoverFundsQueryVariables = Types.Exact<{
  backup: Types.Scalars['String'];
}>;

export type RecoverFundsQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'recoverFunds'
>;

export const RecoverFundsDocument = gql`
  query RecoverFunds($backup: String!) {
    recoverFunds(backup: $backup)
  }
`;

/**
 * __useRecoverFundsQuery__
 *
 * To run a query within a React component, call `useRecoverFundsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecoverFundsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecoverFundsQuery({
 *   variables: {
 *      backup: // value for 'backup'
 *   },
 * });
 */
export function useRecoverFundsQuery(
  baseOptions?: QueryHookOptions<RecoverFundsQuery, RecoverFundsQueryVariables>
) {
  return useQuery<RecoverFundsQuery, RecoverFundsQueryVariables>(
    RecoverFundsDocument,
    baseOptions
  );
}
export function useRecoverFundsLazyQuery(
  baseOptions?: LazyQueryHookOptions<
    RecoverFundsQuery,
    RecoverFundsQueryVariables
  >
) {
  return useLazyQuery<RecoverFundsQuery, RecoverFundsQueryVariables>(
    RecoverFundsDocument,
    baseOptions
  );
}
export type RecoverFundsQueryHookResult = ReturnType<
  typeof useRecoverFundsQuery
>;
export type RecoverFundsLazyQueryHookResult = ReturnType<
  typeof useRecoverFundsLazyQuery
>;
export type RecoverFundsQueryResult = QueryResult<
  RecoverFundsQuery,
  RecoverFundsQueryVariables
>;
