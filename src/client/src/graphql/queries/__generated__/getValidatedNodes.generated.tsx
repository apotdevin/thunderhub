import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ValidatedNodesQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type ValidatedNodesQuery = {
  __typename?: 'Query';
  getValidatedNodes: {
    __typename?: 'ValidatedNodes';
    nodes: Array<{ __typename?: 'ValidNode'; ip: string; pubkey: string }>;
  };
};

export const ValidatedNodesDocument = gql`
  query ValidatedNodes {
    getValidatedNodes {
      nodes {
        ip
        pubkey
      }
    }
  }
`;

/**
 * __useValidatedNodesQuery__
 *
 * To run a query within a React component, call `useValidatedNodesQuery` and pass it any options that fit your needs.
 * When your component renders, `useValidatedNodesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useValidatedNodesQuery({
 *   variables: {
 *   },
 * });
 */
export function useValidatedNodesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    ValidatedNodesQuery,
    ValidatedNodesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ValidatedNodesQuery, ValidatedNodesQueryVariables>(
    ValidatedNodesDocument,
    options
  );
}
export function useValidatedNodesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ValidatedNodesQuery,
    ValidatedNodesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ValidatedNodesQuery, ValidatedNodesQueryVariables>(
    ValidatedNodesDocument,
    options
  );
}
export type ValidatedNodesQueryHookResult = ReturnType<
  typeof useValidatedNodesQuery
>;
export type ValidatedNodesLazyQueryHookResult = ReturnType<
  typeof useValidatedNodesLazyQuery
>;
export type ValidatedNodesQueryResult = Apollo.QueryResult<
  ValidatedNodesQuery,
  ValidatedNodesQueryVariables
>;
