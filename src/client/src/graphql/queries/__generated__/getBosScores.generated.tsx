import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type GetBosScoresQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetBosScoresQuery = {
  __typename?: 'Query';
  getBosScores: Array<{
    __typename?: 'BosScore';
    alias: string;
    public_key: string;
    score: number;
    updated: string;
    position: number;
  }>;
};

export const GetBosScoresDocument = gql`
  query GetBosScores {
    getBosScores {
      alias
      public_key
      score
      updated
      position
    }
  }
`;

/**
 * __useGetBosScoresQuery__
 *
 * To run a query within a React component, call `useGetBosScoresQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBosScoresQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBosScoresQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBosScoresQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetBosScoresQuery,
    GetBosScoresQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetBosScoresQuery, GetBosScoresQueryVariables>(
    GetBosScoresDocument,
    options
  );
}
export function useGetBosScoresLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetBosScoresQuery,
    GetBosScoresQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetBosScoresQuery, GetBosScoresQueryVariables>(
    GetBosScoresDocument,
    options
  );
}
export type GetBosScoresQueryHookResult = ReturnType<
  typeof useGetBosScoresQuery
>;
export type GetBosScoresLazyQueryHookResult = ReturnType<
  typeof useGetBosScoresLazyQuery
>;
export type GetBosScoresQueryResult = Apollo.QueryResult<
  GetBosScoresQuery,
  GetBosScoresQueryVariables
>;
