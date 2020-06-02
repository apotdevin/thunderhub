import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type GetTimeHealthQueryVariables = {
  auth: Types.AuthType;
};

export type GetTimeHealthQuery = { __typename?: 'Query' } & {
  getTimeHealth?: Types.Maybe<
    { __typename?: 'channelsTimeHealth' } & Pick<
      Types.ChannelsTimeHealth,
      'score'
    > & {
        channels?: Types.Maybe<
          Array<
            Types.Maybe<
              { __typename?: 'channelTimeHealth' } & Pick<
                Types.ChannelTimeHealth,
                'id' | 'score' | 'monitoredTime'
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

export const GetTimeHealthDocument = gql`
  query GetTimeHealth($auth: authType!) {
    getTimeHealth(auth: $auth) {
      score
      channels {
        id
        score
        monitoredTime
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
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetTimeHealthQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetTimeHealthQuery,
    GetTimeHealthQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetTimeHealthQuery,
    GetTimeHealthQueryVariables
  >(GetTimeHealthDocument, baseOptions);
}
export function useGetTimeHealthLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetTimeHealthQuery,
    GetTimeHealthQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetTimeHealthQuery,
    GetTimeHealthQueryVariables
  >(GetTimeHealthDocument, baseOptions);
}
export type GetTimeHealthQueryHookResult = ReturnType<
  typeof useGetTimeHealthQuery
>;
export type GetTimeHealthLazyQueryHookResult = ReturnType<
  typeof useGetTimeHealthLazyQuery
>;
export type GetTimeHealthQueryResult = ApolloReactCommon.QueryResult<
  GetTimeHealthQuery,
  GetTimeHealthQueryVariables
>;
