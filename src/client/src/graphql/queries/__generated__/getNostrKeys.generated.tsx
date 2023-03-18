import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type NostrKeysQueryVariables = Types.Exact<{ [key: string]: never }>;

export type NostrKeysQuery = {
  __typename?: 'Query';
  getNostrKeys: { __typename?: 'NostrKeys'; pubkey: string; privkey: string };
};

export const NostrKeysDocument = gql`
  query NostrKeys {
    getNostrKeys {
      pubkey
      privkey
    }
  }
`;

/**
 * __useNostrKeysQuery__
 *
 * To run a query within a React component, call `useNostrKeysQuery` and pass it any options that fit your needs.
 * When your component renders, `useNostrKeysQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNostrKeysQuery({
 *   variables: {
 *   },
 * });
 */
export function useNostrKeysQuery(
  baseOptions?: Apollo.QueryHookOptions<NostrKeysQuery, NostrKeysQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<NostrKeysQuery, NostrKeysQueryVariables>(
    NostrKeysDocument,
    options
  );
}
export function useNostrKeysLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    NostrKeysQuery,
    NostrKeysQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<NostrKeysQuery, NostrKeysQueryVariables>(
    NostrKeysDocument,
    options
  );
}
export type NostrKeysQueryHookResult = ReturnType<typeof useNostrKeysQuery>;
export type NostrKeysLazyQueryHookResult = ReturnType<
  typeof useNostrKeysLazyQuery
>;
export type NostrKeysQueryResult = Apollo.QueryResult<
  NostrKeysQuery,
  NostrKeysQueryVariables
>;
