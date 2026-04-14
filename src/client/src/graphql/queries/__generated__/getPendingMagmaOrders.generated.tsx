import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetPendingMagmaOrdersQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetPendingMagmaOrdersQuery = {
  __typename?: 'Query';
  getPendingMagmaOrders?: {
    __typename?: 'MagmaPendingOrders';
    purchases: Array<{
      __typename?: 'MagmaOrder';
      id: string;
      createdAt: string;
      status: string;
      paymentStatus?: string | null;
      timeout?: number | null;
      channelId?: string | null;
      source: {
        __typename?: 'MagmaOrderParty';
        pubkey?: string | null;
        alias?: string | null;
      };
      destination: {
        __typename?: 'MagmaOrderParty';
        pubkey?: string | null;
        alias?: string | null;
      };
      amount: { __typename?: 'MagmaOrderAmount'; sats?: string | null };
      fees: {
        __typename?: 'MagmaOrderFees';
        seller?: {
          __typename?: 'MagmaOrderFeeAmount';
          sats?: number | null;
        } | null;
        buyer?: {
          __typename?: 'MagmaOrderFeeAmount';
          sats?: number | null;
        } | null;
      };
    }>;
    sales: Array<{
      __typename?: 'MagmaOrder';
      id: string;
      createdAt: string;
      status: string;
      paymentStatus?: string | null;
      timeout?: number | null;
      channelId?: string | null;
      source: {
        __typename?: 'MagmaOrderParty';
        pubkey?: string | null;
        alias?: string | null;
      };
      destination: {
        __typename?: 'MagmaOrderParty';
        pubkey?: string | null;
        alias?: string | null;
      };
      amount: { __typename?: 'MagmaOrderAmount'; sats?: string | null };
      fees: {
        __typename?: 'MagmaOrderFees';
        seller?: {
          __typename?: 'MagmaOrderFeeAmount';
          sats?: number | null;
        } | null;
        buyer?: {
          __typename?: 'MagmaOrderFeeAmount';
          sats?: number | null;
        } | null;
      };
    }>;
  } | null;
};

export const GetPendingMagmaOrdersDocument = gql`
  query GetPendingMagmaOrders {
    getPendingMagmaOrders {
      purchases {
        id
        createdAt
        status
        paymentStatus
        source {
          pubkey
          alias
        }
        destination {
          pubkey
          alias
        }
        amount {
          sats
        }
        fees {
          seller {
            sats
          }
          buyer {
            sats
          }
        }
        timeout
        channelId
      }
      sales {
        id
        createdAt
        status
        paymentStatus
        source {
          pubkey
          alias
        }
        destination {
          pubkey
          alias
        }
        amount {
          sats
        }
        fees {
          seller {
            sats
          }
          buyer {
            sats
          }
        }
        timeout
        channelId
      }
    }
  }
`;

/**
 * __useGetPendingMagmaOrdersQuery__
 *
 * To run a query within a React component, call `useGetPendingMagmaOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPendingMagmaOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPendingMagmaOrdersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPendingMagmaOrdersQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetPendingMagmaOrdersQuery,
    GetPendingMagmaOrdersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetPendingMagmaOrdersQuery,
    GetPendingMagmaOrdersQueryVariables
  >(GetPendingMagmaOrdersDocument, options);
}
export function useGetPendingMagmaOrdersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetPendingMagmaOrdersQuery,
    GetPendingMagmaOrdersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetPendingMagmaOrdersQuery,
    GetPendingMagmaOrdersQueryVariables
  >(GetPendingMagmaOrdersDocument, options);
}
// @ts-ignore
export function useGetPendingMagmaOrdersSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetPendingMagmaOrdersQuery,
    GetPendingMagmaOrdersQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  GetPendingMagmaOrdersQuery,
  GetPendingMagmaOrdersQueryVariables
>;
export function useGetPendingMagmaOrdersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetPendingMagmaOrdersQuery,
        GetPendingMagmaOrdersQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetPendingMagmaOrdersQuery | undefined,
  GetPendingMagmaOrdersQueryVariables
>;
export function useGetPendingMagmaOrdersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetPendingMagmaOrdersQuery,
        GetPendingMagmaOrdersQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetPendingMagmaOrdersQuery,
    GetPendingMagmaOrdersQueryVariables
  >(GetPendingMagmaOrdersDocument, options);
}
export type GetPendingMagmaOrdersQueryHookResult = ReturnType<
  typeof useGetPendingMagmaOrdersQuery
>;
export type GetPendingMagmaOrdersLazyQueryHookResult = ReturnType<
  typeof useGetPendingMagmaOrdersLazyQuery
>;
export type GetPendingMagmaOrdersSuspenseQueryHookResult = ReturnType<
  typeof useGetPendingMagmaOrdersSuspenseQuery
>;
export type GetPendingMagmaOrdersQueryResult = Apollo.QueryResult<
  GetPendingMagmaOrdersQuery,
  GetPendingMagmaOrdersQueryVariables
>;
