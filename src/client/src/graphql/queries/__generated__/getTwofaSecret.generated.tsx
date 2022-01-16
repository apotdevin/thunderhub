import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetTwofaSecretQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetTwofaSecretQuery = {
  __typename?: 'Query';
  getTwofaSecret: { __typename?: 'TwofaResult'; secret: string; url: string };
};

export const GetTwofaSecretDocument = gql`
  query GetTwofaSecret {
    getTwofaSecret {
      secret
      url
    }
  }
`;

/**
 * __useGetTwofaSecretQuery__
 *
 * To run a query within a React component, call `useGetTwofaSecretQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTwofaSecretQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTwofaSecretQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTwofaSecretQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetTwofaSecretQuery,
    GetTwofaSecretQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTwofaSecretQuery, GetTwofaSecretQueryVariables>(
    GetTwofaSecretDocument,
    options
  );
}
export function useGetTwofaSecretLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTwofaSecretQuery,
    GetTwofaSecretQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTwofaSecretQuery, GetTwofaSecretQueryVariables>(
    GetTwofaSecretDocument,
    options
  );
}
export type GetTwofaSecretQueryHookResult = ReturnType<
  typeof useGetTwofaSecretQuery
>;
export type GetTwofaSecretLazyQueryHookResult = ReturnType<
  typeof useGetTwofaSecretLazyQuery
>;
export type GetTwofaSecretQueryResult = Apollo.QueryResult<
  GetTwofaSecretQuery,
  GetTwofaSecretQueryVariables
>;
