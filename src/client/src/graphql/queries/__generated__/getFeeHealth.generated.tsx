import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type GetFeeHealthQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetFeeHealthQuery = {
  __typename?: 'Query';
  getFeeHealth: {
    __typename?: 'ChannelsFeeHealth';
    score: number;
    channels: {
      __typename?: 'ChannelFeeHealth';
      id: string;
      partnerSide: {
        __typename?: 'FeeHealth';
        score: number;
        rate: number;
        base: string;
        rateScore: number;
        baseScore: number;
        rateOver: boolean;
        baseOver: boolean;
      };
      mySide: {
        __typename?: 'FeeHealth';
        score: number;
        rate: number;
        base: string;
        rateScore: number;
        baseScore: number;
        rateOver: boolean;
        baseOver: boolean;
      };
      partner: {
        __typename?: 'Node';
        node: { __typename?: 'NodeType'; alias: string };
      };
    };
  };
};

export const GetFeeHealthDocument = gql`
  query GetFeeHealth {
    getFeeHealth {
      score
      channels {
        id
        partnerSide {
          score
          rate
          base
          rateScore
          baseScore
          rateOver
          baseOver
        }
        mySide {
          score
          rate
          base
          rateScore
          baseScore
          rateOver
          baseOver
        }
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
 * __useGetFeeHealthQuery__
 *
 * To run a query within a React component, call `useGetFeeHealthQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFeeHealthQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFeeHealthQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetFeeHealthQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetFeeHealthQuery,
    GetFeeHealthQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetFeeHealthQuery, GetFeeHealthQueryVariables>(
    GetFeeHealthDocument,
    options
  );
}
export function useGetFeeHealthLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetFeeHealthQuery,
    GetFeeHealthQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetFeeHealthQuery, GetFeeHealthQueryVariables>(
    GetFeeHealthDocument,
    options
  );
}
export type GetFeeHealthQueryHookResult = ReturnType<
  typeof useGetFeeHealthQuery
>;
export type GetFeeHealthLazyQueryHookResult = ReturnType<
  typeof useGetFeeHealthLazyQuery
>;
export type GetFeeHealthQueryResult = Apollo.QueryResult<
  GetFeeHealthQuery,
  GetFeeHealthQueryVariables
>;
