/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type GetVolumeHealthQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetVolumeHealthQuery = { __typename?: 'Query', getVolumeHealth?: { __typename?: 'channelsHealth', score?: number | null | undefined, channels?: Array<{ __typename?: 'channelHealth', id?: string | null | undefined, score?: number | null | undefined, volumeNormalized?: string | null | undefined, averageVolumeNormalized?: string | null | undefined, partner?: { __typename?: 'Node', node: { __typename?: 'nodeType', alias: string } } | null | undefined } | null | undefined> | null | undefined } | null | undefined };


export const GetVolumeHealthDocument = gql`
    query GetVolumeHealth {
  getVolumeHealth {
    score
    channels {
      id
      score
      volumeNormalized
      averageVolumeNormalized
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
 * __useGetVolumeHealthQuery__
 *
 * To run a query within a React component, call `useGetVolumeHealthQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVolumeHealthQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVolumeHealthQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetVolumeHealthQuery(baseOptions?: Apollo.QueryHookOptions<GetVolumeHealthQuery, GetVolumeHealthQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVolumeHealthQuery, GetVolumeHealthQueryVariables>(GetVolumeHealthDocument, options);
      }
export function useGetVolumeHealthLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVolumeHealthQuery, GetVolumeHealthQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVolumeHealthQuery, GetVolumeHealthQueryVariables>(GetVolumeHealthDocument, options);
        }
export type GetVolumeHealthQueryHookResult = ReturnType<typeof useGetVolumeHealthQuery>;
export type GetVolumeHealthLazyQueryHookResult = ReturnType<typeof useGetVolumeHealthLazyQuery>;
export type GetVolumeHealthQueryResult = Apollo.QueryResult<GetVolumeHealthQuery, GetVolumeHealthQueryVariables>;