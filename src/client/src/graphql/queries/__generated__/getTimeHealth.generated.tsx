import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type GetTimeHealthQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetTimeHealthQuery = {
  __typename?: 'Query';
  getTimeHealth: {
    __typename?: 'ChannelsTimeHealth';
    score: number;
    channels: {
      __typename?: 'ChannelTimeHealth';
      id: string;
      score: number;
      significant: boolean;
      monitoredTime: number;
      monitoredUptime: number;
      monitoredDowntime: number;
      partner: {
        __typename?: 'Node';
        node: { __typename?: 'NodeType'; alias: string };
      };
    };
  };
};

export const GetTimeHealthDocument = gql`
  query GetTimeHealth {
    getTimeHealth {
      score
      channels {
        id
        score
        significant
        monitoredTime
        monitoredUptime
        monitoredDowntime
        partner {
          node {
            alias
          }
        }
      }
    }
  }
`;

/**
 * __useGetTimeHealthQuery__
 *
 * To run a query within a React component, call `useGetTimeHealthQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTimeHealthQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTimeHealthQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTimeHealthQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetTimeHealthQuery,
    GetTimeHealthQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTimeHealthQuery, GetTimeHealthQueryVariables>(
    GetTimeHealthDocument,
    options
  );
}
export function useGetTimeHealthLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTimeHealthQuery,
    GetTimeHealthQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTimeHealthQuery, GetTimeHealthQueryVariables>(
    GetTimeHealthDocument,
    options
  );
}
export type GetTimeHealthQueryHookResult = ReturnType<
  typeof useGetTimeHealthQuery
>;
export type GetTimeHealthLazyQueryHookResult = ReturnType<
  typeof useGetTimeHealthLazyQuery
>;
export type GetTimeHealthQueryResult = Apollo.QueryResult<
  GetTimeHealthQuery,
  GetTimeHealthQueryVariables
>;
