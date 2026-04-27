import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetTradeReadinessQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetTradeReadinessQuery = {
  __typename?: 'Query';
  rails: {
    __typename?: 'RailsQueries';
    id: string;
    trade_readiness: {
      __typename?: 'TradeReadinessResult';
      node_online: boolean;
      public_key?: string | null;
      alias?: string | null;
      has_tapd: boolean;
      onchain_balance_sats: string;
      pending_onchain_balance_sats: string;
      deposit_address?: string | null;
      has_channel: boolean;
      has_active_channel: boolean;
      recommended_node?: {
        __typename?: 'RecommendedNode';
        pubkey: string;
        sockets: Array<string>;
      } | null;
    };
  };
};

export const GetTradeReadinessDocument = gql`
  query GetTradeReadiness {
    rails {
      id
      trade_readiness {
        node_online
        public_key
        alias
        has_tapd
        onchain_balance_sats
        pending_onchain_balance_sats
        deposit_address
        has_channel
        has_active_channel
        recommended_node {
          pubkey
          sockets
        }
      }
    }
  }
`;

/**
 * __useGetTradeReadinessQuery__
 *
 * To run a query within a React component, call `useGetTradeReadinessQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTradeReadinessQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTradeReadinessQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTradeReadinessQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetTradeReadinessQuery,
    GetTradeReadinessQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetTradeReadinessQuery,
    GetTradeReadinessQueryVariables
  >(GetTradeReadinessDocument, options);
}
export function useGetTradeReadinessLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTradeReadinessQuery,
    GetTradeReadinessQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetTradeReadinessQuery,
    GetTradeReadinessQueryVariables
  >(GetTradeReadinessDocument, options);
}
// @ts-ignore
export function useGetTradeReadinessSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetTradeReadinessQuery,
    GetTradeReadinessQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  GetTradeReadinessQuery,
  GetTradeReadinessQueryVariables
>;
export function useGetTradeReadinessSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTradeReadinessQuery,
        GetTradeReadinessQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetTradeReadinessQuery | undefined,
  GetTradeReadinessQueryVariables
>;
export function useGetTradeReadinessSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTradeReadinessQuery,
        GetTradeReadinessQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetTradeReadinessQuery,
    GetTradeReadinessQueryVariables
  >(GetTradeReadinessDocument, options);
}
export type GetTradeReadinessQueryHookResult = ReturnType<
  typeof useGetTradeReadinessQuery
>;
export type GetTradeReadinessLazyQueryHookResult = ReturnType<
  typeof useGetTradeReadinessLazyQuery
>;
export type GetTradeReadinessSuspenseQueryHookResult = ReturnType<
  typeof useGetTradeReadinessSuspenseQuery
>;
export type GetTradeReadinessQueryResult = Apollo.QueryResult<
  GetTradeReadinessQuery,
  GetTradeReadinessQueryVariables
>;
