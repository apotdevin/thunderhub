import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetConfigStateQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetConfigStateQuery = {
  __typename?: 'Query';
  getConfigState: {
    __typename?: 'ConfigState';
    backup_state: boolean;
    healthcheck_ping_state: boolean;
  };
};

export const GetConfigStateDocument = gql`
  query GetConfigState {
    getConfigState {
      backup_state
      healthcheck_ping_state
    }
  }
`;

/**
 * __useGetConfigStateQuery__
 *
 * To run a query within a React component, call `useGetConfigStateQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetConfigStateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetConfigStateQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetConfigStateQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetConfigStateQuery,
    GetConfigStateQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetConfigStateQuery, GetConfigStateQueryVariables>(
    GetConfigStateDocument,
    options
  );
}
export function useGetConfigStateLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetConfigStateQuery,
    GetConfigStateQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetConfigStateQuery, GetConfigStateQueryVariables>(
    GetConfigStateDocument,
    options
  );
}
export type GetConfigStateQueryHookResult = ReturnType<
  typeof useGetConfigStateQuery
>;
export type GetConfigStateLazyQueryHookResult = ReturnType<
  typeof useGetConfigStateLazyQuery
>;
export type GetConfigStateQueryResult = Apollo.QueryResult<
  GetConfigStateQuery,
  GetConfigStateQueryVariables
>;
