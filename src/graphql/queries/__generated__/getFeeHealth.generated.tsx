import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type GetFeeHealthQueryVariables = {
  auth: Types.AuthType;
};

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
                'id' | 'myScore' | 'partnerScore'
              > & {
                  partner?: Types.Maybe<
                    { __typename?: 'Node' } & {
                      node?: Types.Maybe<
                        { __typename?: 'nodeType' } & Pick<
                          Types.NodeType,
                          'alias'
                        >
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
  query GetFeeHealth($auth: authType!) {
    getFeeHealth(auth: $auth) {
      score
      channels {
        id
        myScore
        partnerScore
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
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetFeeHealthQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetFeeHealthQuery,
    GetFeeHealthQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetFeeHealthQuery,
    GetFeeHealthQueryVariables
  >(GetFeeHealthDocument, baseOptions);
}
export function useGetFeeHealthLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetFeeHealthQuery,
    GetFeeHealthQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetFeeHealthQuery,
    GetFeeHealthQueryVariables
  >(GetFeeHealthDocument, baseOptions);
}
export type GetFeeHealthQueryHookResult = ReturnType<
  typeof useGetFeeHealthQuery
>;
export type GetFeeHealthLazyQueryHookResult = ReturnType<
  typeof useGetFeeHealthLazyQuery
>;
export type GetFeeHealthQueryResult = ApolloReactCommon.QueryResult<
  GetFeeHealthQuery,
  GetFeeHealthQueryVariables
>;
