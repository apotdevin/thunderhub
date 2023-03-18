import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type NostrProfileQueryVariables = Types.Exact<{
  pubkey: Types.Scalars['String'];
}>;

export type NostrProfileQuery = {
  __typename?: 'Query';
  getNostrProfile: {
    __typename?: 'NostrProfile';
    profile: {
      __typename?: 'NostrEvent';
      kind: number;
      tags: Array<Array<string>>;
      content: string;
      created_at: number;
      pubkey: string;
      id: string;
      sig: string;
    };
    attestation: {
      __typename?: 'NostrEvent';
      kind: number;
      tags: Array<Array<string>>;
      content: string;
      created_at: number;
      pubkey: string;
      id: string;
      sig: string;
    };
  };
};

export const NostrProfileDocument = gql`
  query NostrProfile($pubkey: String!) {
    getNostrProfile(pubkey: $pubkey) {
      profile {
        kind
        tags
        content
        created_at
        pubkey
        id
        sig
      }
      attestation {
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
 * __useNostrProfileQuery__
 *
 * To run a query within a React component, call `useNostrProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useNostrProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNostrProfileQuery({
 *   variables: {
 *      pubkey: // value for 'pubkey'
 *   },
 * });
 */
export function useNostrProfileQuery(
  baseOptions: Apollo.QueryHookOptions<
    NostrProfileQuery,
    NostrProfileQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<NostrProfileQuery, NostrProfileQueryVariables>(
    NostrProfileDocument,
    options
  );
}
export function useNostrProfileLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    NostrProfileQuery,
    NostrProfileQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<NostrProfileQuery, NostrProfileQueryVariables>(
    NostrProfileDocument,
    options
  );
}
export type NostrProfileQueryHookResult = ReturnType<
  typeof useNostrProfileQuery
>;
export type NostrProfileLazyQueryHookResult = ReturnType<
  typeof useNostrProfileLazyQuery
>;
export type NostrProfileQueryResult = Apollo.QueryResult<
  NostrProfileQuery,
  NostrProfileQueryVariables
>;
