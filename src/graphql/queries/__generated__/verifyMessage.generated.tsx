import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type VerifyMessageQueryVariables = Types.Exact<{
  auth: Types.AuthType;
  message: Types.Scalars['String'];
  signature: Types.Scalars['String'];
}>;

export type VerifyMessageQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'verifyMessage'
>;

export const VerifyMessageDocument = gql`
  query VerifyMessage(
    $auth: authType!
    $message: String!
    $signature: String!
  ) {
    verifyMessage(auth: $auth, message: $message, signature: $signature)
  }
`;

/**
 * __useVerifyMessageQuery__
 *
 * To run a query within a React component, call `useVerifyMessageQuery` and pass it any options that fit your needs.
 * When your component renders, `useVerifyMessageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVerifyMessageQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *      message: // value for 'message'
 *      signature: // value for 'signature'
 *   },
 * });
 */
export function useVerifyMessageQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    VerifyMessageQuery,
    VerifyMessageQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    VerifyMessageQuery,
    VerifyMessageQueryVariables
  >(VerifyMessageDocument, baseOptions);
}
export function useVerifyMessageLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    VerifyMessageQuery,
    VerifyMessageQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    VerifyMessageQuery,
    VerifyMessageQueryVariables
  >(VerifyMessageDocument, baseOptions);
}
export type VerifyMessageQueryHookResult = ReturnType<
  typeof useVerifyMessageQuery
>;
export type VerifyMessageLazyQueryHookResult = ReturnType<
  typeof useVerifyMessageLazyQuery
>;
export type VerifyMessageQueryResult = ApolloReactCommon.QueryResult<
  VerifyMessageQuery,
  VerifyMessageQueryVariables
>;
