import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type GetVolumeHealthQueryVariables = {
  auth: Types.AuthType;
};

export type GetVolumeHealthQuery = { __typename?: 'Query' } & {
  getVolumeHealth?: Types.Maybe<
    { __typename?: 'channelsHealth' } & Pick<Types.ChannelsHealth, 'score'> & {
        channels?: Types.Maybe<
          Array<
            Types.Maybe<
              { __typename?: 'channelHealth' } & Pick<
                Types.ChannelHealth,
                'id' | 'score'
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

export const GetVolumeHealthDocument = gql`
  query GetVolumeHealth($auth: authType!) {
    getVolumeHealth(auth: $auth) {
      score
      channels {
        id
        score
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
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetVolumeHealthQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetVolumeHealthQuery,
    GetVolumeHealthQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetVolumeHealthQuery,
    GetVolumeHealthQueryVariables
  >(GetVolumeHealthDocument, baseOptions);
}
export function useGetVolumeHealthLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetVolumeHealthQuery,
    GetVolumeHealthQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetVolumeHealthQuery,
    GetVolumeHealthQueryVariables
  >(GetVolumeHealthDocument, baseOptions);
}
export type GetVolumeHealthQueryHookResult = ReturnType<
  typeof useGetVolumeHealthQuery
>;
export type GetVolumeHealthLazyQueryHookResult = ReturnType<
  typeof useGetVolumeHealthLazyQuery
>;
export type GetVolumeHealthQueryResult = ApolloReactCommon.QueryResult<
  GetVolumeHealthQuery,
  GetVolumeHealthQueryVariables
>;
