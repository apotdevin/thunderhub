/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type VerifyBackupsQueryVariables = Types.Exact<{
  backup: Types.Scalars['String'];
}>;


export type VerifyBackupsQuery = { __typename?: 'Query', verifyBackups?: boolean | null | undefined };


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
export function useVerifyBackupsQuery(baseOptions: Apollo.QueryHookOptions<VerifyBackupsQuery, VerifyBackupsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<VerifyBackupsQuery, VerifyBackupsQueryVariables>(VerifyBackupsDocument, options);
      }
export function useVerifyBackupsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VerifyBackupsQuery, VerifyBackupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<VerifyBackupsQuery, VerifyBackupsQueryVariables>(VerifyBackupsDocument, options);
        }
export type VerifyBackupsQueryHookResult = ReturnType<typeof useVerifyBackupsQuery>;
export type VerifyBackupsLazyQueryHookResult = ReturnType<typeof useVerifyBackupsLazyQuery>;
export type VerifyBackupsQueryResult = Apollo.QueryResult<VerifyBackupsQuery, VerifyBackupsQueryVariables>;