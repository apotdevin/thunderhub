import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type FollowListQueryVariables = Types.Exact<{
  myPubkey: Types.Scalars['String'];
}>;

export type FollowListQuery = {
  __typename?: 'Query';
  getFollowList: { __typename?: 'FollowList'; following: Array<string> };
};

export const FollowListDocument = gql`
  query FollowList($myPubkey: String!) {
    getFollowList(myPubkey: $myPubkey) {
      following
    }
  }
`;

/**
 * __useFollowListQuery__
 *
 * To run a query within a React component, call `useFollowListQuery` and pass it any options that fit your needs.
 * When your component renders, `useFollowListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFollowListQuery({
 *   variables: {
 *      myPubkey: // value for 'myPubkey'
 *   },
 * });
 */
export function useFollowListQuery(
  baseOptions: Apollo.QueryHookOptions<
    FollowListQuery,
    FollowListQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<FollowListQuery, FollowListQueryVariables>(
    FollowListDocument,
    options
  );
}
export function useFollowListLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    FollowListQuery,
    FollowListQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<FollowListQuery, FollowListQueryVariables>(
    FollowListDocument,
    options
  );
}
export type FollowListQueryHookResult = ReturnType<typeof useFollowListQuery>;
export type FollowListLazyQueryHookResult = ReturnType<
  typeof useFollowListLazyQuery
>;
export type FollowListQueryResult = Apollo.QueryResult<
  FollowListQuery,
  FollowListQueryVariables
>;
