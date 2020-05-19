import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type GetRoutesQueryVariables = {
  auth: Types.AuthType;
  outgoing: Types.Scalars['String'];
  incoming: Types.Scalars['String'];
  tokens: Types.Scalars['Int'];
  maxFee?: Types.Maybe<Types.Scalars['Int']>;
};

export type GetRoutesQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'getRoutes'
>;

export const GetRoutesDocument = gql`
  query GetRoutes(
    $auth: authType!
    $outgoing: String!
    $incoming: String!
    $tokens: Int!
    $maxFee: Int
  ) {
    getRoutes(
      auth: $auth
      outgoing: $outgoing
      incoming: $incoming
      tokens: $tokens
      maxFee: $maxFee
    )
  }
`;

/**
 * __useGetRoutesQuery__
 *
 * To run a query within a React component, call `useGetRoutesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoutesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoutesQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *      outgoing: // value for 'outgoing'
 *      incoming: // value for 'incoming'
 *      tokens: // value for 'tokens'
 *      maxFee: // value for 'maxFee'
 *   },
 * });
 */
export function useGetRoutesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetRoutesQuery,
    GetRoutesQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetRoutesQuery, GetRoutesQueryVariables>(
    GetRoutesDocument,
    baseOptions
  );
}
export function useGetRoutesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetRoutesQuery,
    GetRoutesQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<GetRoutesQuery, GetRoutesQueryVariables>(
    GetRoutesDocument,
    baseOptions
  );
}
export type GetRoutesQueryHookResult = ReturnType<typeof useGetRoutesQuery>;
export type GetRoutesLazyQueryHookResult = ReturnType<
  typeof useGetRoutesLazyQuery
>;
export type GetRoutesQueryResult = ApolloReactCommon.QueryResult<
  GetRoutesQuery,
  GetRoutesQueryVariables
>;
