import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type VerifyMessageQueryVariables = Types.Exact<{
  message: Types.Scalars['String'];
  signature: Types.Scalars['String'];
}>;

export type VerifyMessageQuery = {
  __typename?: 'Query';
  verifyMessage: string;
};

export const VerifyMessageDocument = gql`
  query VerifyMessage($message: String!, $signature: String!) {
    verifyMessage(message: $message, signature: $signature)
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
 *      message: // value for 'message'
 *      signature: // value for 'signature'
 *   },
 * });
 */
export function useVerifyMessageQuery(
  baseOptions: Apollo.QueryHookOptions<
    VerifyMessageQuery,
    VerifyMessageQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<VerifyMessageQuery, VerifyMessageQueryVariables>(
    VerifyMessageDocument,
    options
  );
}
export function useVerifyMessageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    VerifyMessageQuery,
    VerifyMessageQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<VerifyMessageQuery, VerifyMessageQueryVariables>(
    VerifyMessageDocument,
    options
  );
}
export type VerifyMessageQueryHookResult = ReturnType<
  typeof useVerifyMessageQuery
>;
export type VerifyMessageLazyQueryHookResult = ReturnType<
  typeof useVerifyMessageLazyQuery
>;
export type VerifyMessageQueryResult = Apollo.QueryResult<
  VerifyMessageQuery,
  VerifyMessageQueryVariables
>;
