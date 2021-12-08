import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type RecoverFundsQueryVariables = Types.Exact<{
  backup: Types.Scalars['String'];
}>;

export type RecoverFundsQuery = { __typename?: 'Query'; recoverFunds: boolean };

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
  baseOptions: Apollo.QueryHookOptions<
    RecoverFundsQuery,
    RecoverFundsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<RecoverFundsQuery, RecoverFundsQueryVariables>(
    RecoverFundsDocument,
    options
  );
}
export function useRecoverFundsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    RecoverFundsQuery,
    RecoverFundsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<RecoverFundsQuery, RecoverFundsQueryVariables>(
    RecoverFundsDocument,
    options
  );
}
export type RecoverFundsQueryHookResult = ReturnType<
  typeof useRecoverFundsQuery
>;
export type RecoverFundsLazyQueryHookResult = ReturnType<
  typeof useRecoverFundsLazyQuery
>;
export type RecoverFundsQueryResult = Apollo.QueryResult<
  RecoverFundsQuery,
  RecoverFundsQueryVariables
>;
