import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type GetForwardsQueryVariables = {
  auth: Types.AuthType;
  time?: Types.Maybe<Types.Scalars['String']>;
};

export type GetForwardsQuery = { __typename?: 'Query' } & {
  getForwards?: Types.Maybe<
    { __typename?: 'getForwardType' } & Pick<Types.GetForwardType, 'token'> & {
        forwards?: Types.Maybe<
          Array<
            Types.Maybe<
              { __typename?: 'forwardType' } & Pick<
                Types.ForwardType,
                | 'created_at'
                | 'fee'
                | 'fee_mtokens'
                | 'incoming_channel'
                | 'incoming_alias'
                | 'incoming_color'
                | 'mtokens'
                | 'outgoing_channel'
                | 'outgoing_alias'
                | 'outgoing_color'
                | 'tokens'
              >
            >
          >
        >;
      }
  >;
};

export const GetForwardsDocument = gql`
  query GetForwards($auth: authType!, $time: String) {
    getForwards(auth: $auth, time: $time) {
      forwards {
        created_at
        fee
        fee_mtokens
        incoming_channel
        incoming_alias
        incoming_color
        mtokens
        outgoing_channel
        outgoing_alias
        outgoing_color
        tokens
      }
      token
    }
  }
`;

/**
 * __useGetForwardsQuery__
 *
 * To run a query within a React component, call `useGetForwardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetForwardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetForwardsQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *      time: // value for 'time'
 *   },
 * });
 */
export function useGetForwardsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetForwardsQuery,
    GetForwardsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetForwardsQuery, GetForwardsQueryVariables>(
    GetForwardsDocument,
    baseOptions
  );
}
export function useGetForwardsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetForwardsQuery,
    GetForwardsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetForwardsQuery,
    GetForwardsQueryVariables
  >(GetForwardsDocument, baseOptions);
}
export type GetForwardsQueryHookResult = ReturnType<typeof useGetForwardsQuery>;
export type GetForwardsLazyQueryHookResult = ReturnType<
  typeof useGetForwardsLazyQuery
>;
export type GetForwardsQueryResult = ApolloReactCommon.QueryResult<
  GetForwardsQuery,
  GetForwardsQueryVariables
>;
