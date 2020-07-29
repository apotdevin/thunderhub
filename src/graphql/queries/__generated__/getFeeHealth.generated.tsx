import {
  gql,
  QueryHookOptions,
  useQuery,
  useLazyQuery,
  QueryResult,
  LazyQueryHookOptions,
} from '@apollo/client';
import * as Types from '../../types';

export type GetFeeHealthQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetFeeHealthQuery = { __typename?: 'Query' } & {
  getFeeHealth?: Types.Maybe<
    { __typename?: 'channelsFeeHealth' } & Pick<
      Types.ChannelsFeeHealth,
      'score'
    > & {
        channels?: Types.Maybe<
          Array<
            Types.Maybe<
              { __typename?: 'channelFeeHealth' } & Pick<
                Types.ChannelFeeHealth,
                'id'
              > & {
                  partnerSide?: Types.Maybe<
                    { __typename?: 'feeHealth' } & Pick<
                      Types.FeeHealth,
                      | 'score'
                      | 'rate'
                      | 'base'
                      | 'rateScore'
                      | 'baseScore'
                      | 'rateOver'
                      | 'baseOver'
                    >
                  >;
                  mySide?: Types.Maybe<
                    { __typename?: 'feeHealth' } & Pick<
                      Types.FeeHealth,
                      | 'score'
                      | 'rate'
                      | 'base'
                      | 'rateScore'
                      | 'baseScore'
                      | 'rateOver'
                      | 'baseOver'
                    >
                  >;
                  partner?: Types.Maybe<
                    { __typename?: 'Node' } & {
                      node: { __typename?: 'nodeType' } & Pick<
                        Types.NodeType,
                        'alias'
                      >;
                    }
                  >;
                }
            >
          >
        >;
      }
  >;
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
  baseOptions?: QueryHookOptions<GetFeeHealthQuery, GetFeeHealthQueryVariables>
) {
  return useQuery<GetFeeHealthQuery, GetFeeHealthQueryVariables>(
    GetFeeHealthDocument,
    baseOptions
  );
}
export function useGetFeeHealthLazyQuery(
  baseOptions?: LazyQueryHookOptions<
    GetFeeHealthQuery,
    GetFeeHealthQueryVariables
  >
) {
  return useLazyQuery<GetFeeHealthQuery, GetFeeHealthQueryVariables>(
    GetFeeHealthDocument,
    baseOptions
  );
}
export type GetFeeHealthQueryHookResult = ReturnType<
  typeof useGetFeeHealthQuery
>;
export type GetFeeHealthLazyQueryHookResult = ReturnType<
  typeof useGetFeeHealthLazyQuery
>;
export type GetFeeHealthQueryResult = QueryResult<
  GetFeeHealthQuery,
  GetFeeHealthQueryVariables
>;
