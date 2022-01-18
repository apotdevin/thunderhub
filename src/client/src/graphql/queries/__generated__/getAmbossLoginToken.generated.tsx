import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetAmbossLoginTokenQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetAmbossLoginTokenQuery = {
  __typename?: 'Query';
  getAmbossLoginToken: string;
};

export const GetAmbossLoginTokenDocument = gql`
  query GetAmbossLoginToken {
    getAmbossLoginToken
  }
`;

/**
 * __useGetAmbossLoginTokenQuery__
 *
 * To run a query within a React component, call `useGetAmbossLoginTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAmbossLoginTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAmbossLoginTokenQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAmbossLoginTokenQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetAmbossLoginTokenQuery,
    GetAmbossLoginTokenQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetAmbossLoginTokenQuery,
    GetAmbossLoginTokenQueryVariables
  >(GetAmbossLoginTokenDocument, options);
}
export function useGetAmbossLoginTokenLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAmbossLoginTokenQuery,
    GetAmbossLoginTokenQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetAmbossLoginTokenQuery,
    GetAmbossLoginTokenQueryVariables
  >(GetAmbossLoginTokenDocument, options);
}
export type GetAmbossLoginTokenQueryHookResult = ReturnType<
  typeof useGetAmbossLoginTokenQuery
>;
export type GetAmbossLoginTokenLazyQueryHookResult = ReturnType<
  typeof useGetAmbossLoginTokenLazyQuery
>;
export type GetAmbossLoginTokenQueryResult = Apollo.QueryResult<
  GetAmbossLoginTokenQuery,
  GetAmbossLoginTokenQueryVariables
>;
