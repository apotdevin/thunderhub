import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type NostrRelaysQueryVariables = Types.Exact<{ [key: string]: never }>;

export type NostrRelaysQuery = {
  __typename?: 'Query';
  getNostrRelays: { __typename?: 'NostrRelays'; urls: Array<string> };
};

export const NostrRelaysDocument = gql`
  query NostrRelays {
    getNostrRelays {
      urls
    }
  }
`;

/**
 * __useNostrRelaysQuery__
 *
 * To run a query within a React component, call `useNostrRelaysQuery` and pass it any options that fit your needs.
 * When your component renders, `useNostrRelaysQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNostrRelaysQuery({
 *   variables: {
 *   },
 * });
 */
export function useNostrRelaysQuery(
  baseOptions?: Apollo.QueryHookOptions<
    NostrRelaysQuery,
    NostrRelaysQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<NostrRelaysQuery, NostrRelaysQueryVariables>(
    NostrRelaysDocument,
    options
  );
}
export function useNostrRelaysLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    NostrRelaysQuery,
    NostrRelaysQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<NostrRelaysQuery, NostrRelaysQueryVariables>(
    NostrRelaysDocument,
    options
  );
}
export type NostrRelaysQueryHookResult = ReturnType<typeof useNostrRelaysQuery>;
export type NostrRelaysLazyQueryHookResult = ReturnType<
  typeof useNostrRelaysLazyQuery
>;
export type NostrRelaysQueryResult = Apollo.QueryResult<
  NostrRelaysQuery,
  NostrRelaysQueryVariables
>;
