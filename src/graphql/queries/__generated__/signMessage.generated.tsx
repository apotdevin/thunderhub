import {
  gql,
  QueryHookOptions,
  useQuery,
  useLazyQuery,
  QueryResult,
  LazyQueryHookOptions,
} from '@apollo/client';
import * as Types from '../../types';

export type SignMessageQueryVariables = Types.Exact<{
  message: Types.Scalars['String'];
}>;

export type SignMessageQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'signMessage'
>;

export const SignMessageDocument = gql`
  query SignMessage($message: String!) {
    signMessage(message: $message)
  }
`;

/**
 * __useSignMessageQuery__
 *
 * To run a query within a React component, call `useSignMessageQuery` and pass it any options that fit your needs.
 * When your component renders, `useSignMessageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSignMessageQuery({
 *   variables: {
 *      message: // value for 'message'
 *   },
 * });
 */
export function useSignMessageQuery(
  baseOptions?: QueryHookOptions<SignMessageQuery, SignMessageQueryVariables>
) {
  return useQuery<SignMessageQuery, SignMessageQueryVariables>(
    SignMessageDocument,
    baseOptions
  );
}
export function useSignMessageLazyQuery(
  baseOptions?: LazyQueryHookOptions<
    SignMessageQuery,
    SignMessageQueryVariables
  >
) {
  return useLazyQuery<SignMessageQuery, SignMessageQueryVariables>(
    SignMessageDocument,
    baseOptions
  );
}
export type SignMessageQueryHookResult = ReturnType<typeof useSignMessageQuery>;
export type SignMessageLazyQueryHookResult = ReturnType<
  typeof useSignMessageLazyQuery
>;
export type SignMessageQueryResult = QueryResult<
  SignMessageQuery,
  SignMessageQueryVariables
>;
