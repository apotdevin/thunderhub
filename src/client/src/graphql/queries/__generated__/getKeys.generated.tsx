import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type KeysQueryVariables = Types.Exact<{ [key: string]: never }>;

export type KeysQuery = {
  __typename?: 'Query';
  getKeys: { __typename?: 'Keys'; pubkey: string; privkey: string };
};

export const KeysDocument = gql`
  query Keys {
    getKeys {
      pubkey
      privkey
    }
  }
`;

/**
 * __useKeysQuery__
 *
 * To run a query within a React component, call `useKeysQuery` and pass it any options that fit your needs.
 * When your component renders, `useKeysQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useKeysQuery({
 *   variables: {
 *   },
 * });
 */
export function useKeysQuery(
  baseOptions?: Apollo.QueryHookOptions<KeysQuery, KeysQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<KeysQuery, KeysQueryVariables>(KeysDocument, options);
}
export function useKeysLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<KeysQuery, KeysQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<KeysQuery, KeysQueryVariables>(
    KeysDocument,
    options
  );
}
export type KeysQueryHookResult = ReturnType<typeof useKeysQuery>;
export type KeysLazyQueryHookResult = ReturnType<typeof useKeysLazyQuery>;
export type KeysQueryResult = Apollo.QueryResult<KeysQuery, KeysQueryVariables>;
