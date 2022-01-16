import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetNodeBosHistoryQueryVariables = Types.Exact<{
  pubkey: Types.Scalars['String'];
}>;

export type GetNodeBosHistoryQuery = {
  __typename?: 'Query';
  getNodeBosHistory: {
    __typename?: 'NodeBosHistory';
    info: {
      __typename?: 'BosScoreInfo';
      count: number;
      first?:
        | {
            __typename?: 'BosScore';
            position: number;
            score: number;
            updated: string;
          }
        | null
        | undefined;
      last?:
        | {
            __typename?: 'BosScore';
            position: number;
            score: number;
            updated: string;
          }
        | null
        | undefined;
    };
    scores: Array<{
      __typename?: 'BosScore';
      position: number;
      score: number;
      updated: string;
    }>;
  };
};

export const GetNodeBosHistoryDocument = gql`
  query GetNodeBosHistory($pubkey: String!) {
    getNodeBosHistory(pubkey: $pubkey) {
      info {
        count
        first {
          position
          score
          updated
        }
        last {
          position
          score
          updated
        }
      }
      scores {
        position
        score
        updated
      }
    }
  }
`;

/**
 * __useGetNodeBosHistoryQuery__
 *
 * To run a query within a React component, call `useGetNodeBosHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNodeBosHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNodeBosHistoryQuery({
 *   variables: {
 *      pubkey: // value for 'pubkey'
 *   },
 * });
 */
export function useGetNodeBosHistoryQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetNodeBosHistoryQuery,
    GetNodeBosHistoryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetNodeBosHistoryQuery,
    GetNodeBosHistoryQueryVariables
  >(GetNodeBosHistoryDocument, options);
}
export function useGetNodeBosHistoryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetNodeBosHistoryQuery,
    GetNodeBosHistoryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetNodeBosHistoryQuery,
    GetNodeBosHistoryQueryVariables
  >(GetNodeBosHistoryDocument, options);
}
export type GetNodeBosHistoryQueryHookResult = ReturnType<
  typeof useGetNodeBosHistoryQuery
>;
export type GetNodeBosHistoryLazyQueryHookResult = ReturnType<
  typeof useGetNodeBosHistoryLazyQuery
>;
export type GetNodeBosHistoryQueryResult = Apollo.QueryResult<
  GetNodeBosHistoryQuery,
  GetNodeBosHistoryQueryVariables
>;
