import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetAccountQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetAccountQuery = {
  __typename?: 'Query';
  getAccount: {
    __typename?: 'ServerAccount';
    name: string;
    id: string;
    loggedIn: boolean;
    type: string;
    twofaEnabled: boolean;
    peerSwapEnabled: boolean;
  };
};

export const GetAccountDocument = gql`
  query GetAccount {
    getAccount {
      name
      id
      loggedIn
      type
      twofaEnabled
      peerSwapEnabled
    }
  }
`;

/**
 * __useGetAccountQuery__
 *
 * To run a query within a React component, call `useGetAccountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAccountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAccountQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAccountQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetAccountQuery,
    GetAccountQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAccountQuery, GetAccountQueryVariables>(
    GetAccountDocument,
    options
  );
}
export function useGetAccountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAccountQuery,
    GetAccountQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAccountQuery, GetAccountQueryVariables>(
    GetAccountDocument,
    options
  );
}
export type GetAccountQueryHookResult = ReturnType<typeof useGetAccountQuery>;
export type GetAccountLazyQueryHookResult = ReturnType<
  typeof useGetAccountLazyQuery
>;
export type GetAccountQueryResult = Apollo.QueryResult<
  GetAccountQuery,
  GetAccountQueryVariables
>;
