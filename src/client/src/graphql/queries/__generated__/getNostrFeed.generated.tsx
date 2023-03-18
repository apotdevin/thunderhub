import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type NostrFeedQueryVariables = Types.Exact<{
  myPubkey: Types.Scalars['String'];
}>;

export type NostrFeedQuery = {
  __typename?: 'Query';
  getNostrFeed: {
    __typename?: 'NostrFeed';
    feed: Array<{
      __typename?: 'NostrEvent';
      kind: number;
      tags: Array<Array<string>>;
      content: string;
      created_at: number;
      pubkey: string;
      id: string;
      sig: string;
    }>;
  };
};

export const NostrFeedDocument = gql`
  query NostrFeed($myPubkey: String!) {
    getNostrFeed(myPubkey: $myPubkey) {
      feed {
        kind
        tags
        content
        created_at
        pubkey
        id
        sig
      }
    }
  }
`;

/**
 * __useNostrFeedQuery__
 *
 * To run a query within a React component, call `useNostrFeedQuery` and pass it any options that fit your needs.
 * When your component renders, `useNostrFeedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNostrFeedQuery({
 *   variables: {
 *      myPubkey: // value for 'myPubkey'
 *   },
 * });
 */
export function useNostrFeedQuery(
  baseOptions: Apollo.QueryHookOptions<NostrFeedQuery, NostrFeedQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<NostrFeedQuery, NostrFeedQueryVariables>(
    NostrFeedDocument,
    options
  );
}
export function useNostrFeedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    NostrFeedQuery,
    NostrFeedQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<NostrFeedQuery, NostrFeedQueryVariables>(
    NostrFeedDocument,
    options
  );
}
export type NostrFeedQueryHookResult = ReturnType<typeof useNostrFeedQuery>;
export type NostrFeedLazyQueryHookResult = ReturnType<
  typeof useNostrFeedLazyQuery
>;
export type NostrFeedQueryResult = Apollo.QueryResult<
  NostrFeedQuery,
  NostrFeedQueryVariables
>;
