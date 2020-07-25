import * as Types from '../../types';

import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';

export type GetWalletInfoQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetWalletInfoQuery = { __typename?: 'Query' } & {
  getWalletInfo?: Types.Maybe<
    { __typename?: 'walletInfoType' } & Pick<
      Types.WalletInfoType,
      | 'build_tags'
      | 'commit_hash'
      | 'is_autopilotrpc_enabled'
      | 'is_chainrpc_enabled'
      | 'is_invoicesrpc_enabled'
      | 'is_signrpc_enabled'
      | 'is_walletrpc_enabled'
      | 'is_watchtowerrpc_enabled'
      | 'is_wtclientrpc_enabled'
    >
  >;
};

export const GetWalletInfoDocument = gql`
  query GetWalletInfo {
    getWalletInfo {
      build_tags
      commit_hash
      is_autopilotrpc_enabled
      is_chainrpc_enabled
      is_invoicesrpc_enabled
      is_signrpc_enabled
      is_walletrpc_enabled
      is_watchtowerrpc_enabled
      is_wtclientrpc_enabled
    }
  }
`;

/**
 * __useGetWalletInfoQuery__
 *
 * To run a query within a React component, call `useGetWalletInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWalletInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWalletInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetWalletInfoQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetWalletInfoQuery,
    GetWalletInfoQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetWalletInfoQuery,
    GetWalletInfoQueryVariables
  >(GetWalletInfoDocument, baseOptions);
}
export function useGetWalletInfoLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetWalletInfoQuery,
    GetWalletInfoQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetWalletInfoQuery,
    GetWalletInfoQueryVariables
  >(GetWalletInfoDocument, baseOptions);
}
export type GetWalletInfoQueryHookResult = ReturnType<
  typeof useGetWalletInfoQuery
>;
export type GetWalletInfoLazyQueryHookResult = ReturnType<
  typeof useGetWalletInfoLazyQuery
>;
export type GetWalletInfoQueryResult = ApolloReactCommon.QueryResult<
  GetWalletInfoQuery,
  GetWalletInfoQueryVariables
>;
