import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type RelaysQueryVariables = Types.Exact<{ [key: string]: never }>;

export type RelaysQuery = {
  __typename?: 'Query';
  getRelays: { __typename?: 'Relays'; urls: Array<string> };
};

export const RelaysDocument = gql`
  query Relays {
    getRelays {
      urls
    }
  }
`;

/**
 * __useRelaysQuery__
 *
 * To run a query within a React component, call `useRelaysQuery` and pass it any options that fit your needs.
 * When your component renders, `useRelaysQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRelaysQuery({
 *   variables: {
 *   },
 * });
 */
export function useRelaysQuery(
  baseOptions?: Apollo.QueryHookOptions<RelaysQuery, RelaysQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<RelaysQuery, RelaysQueryVariables>(
    RelaysDocument,
    options
  );
}
export function useRelaysLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<RelaysQuery, RelaysQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<RelaysQuery, RelaysQueryVariables>(
    RelaysDocument,
    options
  );
}
export type RelaysQueryHookResult = ReturnType<typeof useRelaysQuery>;
export type RelaysLazyQueryHookResult = ReturnType<typeof useRelaysLazyQuery>;
export type RelaysQueryResult = Apollo.QueryResult<
  RelaysQuery,
  RelaysQueryVariables
>;
