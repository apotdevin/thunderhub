import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetMagmaOrdersQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetMagmaOrdersQuery = {
  __typename?: 'Query';
  magma: {
    __typename?: 'MagmaQueries';
    id: string;
    orders: {
      __typename?: 'MagmaOrderQueries';
      find_many?: {
        __typename?: 'MagmaPendingOrders';
        magmaUrl: string;
        purchases: Array<{
          __typename?: 'MagmaOrder';
          id: string;
          createdAt: string;
          status: string;
          paymentStatus?: string | null;
          timeout?: string | null;
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
          timeout?: string | null;
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
  };
};

export const GetMagmaOrdersDocument = gql`
  query GetMagmaOrders {
    magma {
      id
      orders {
        find_many {
          magmaUrl
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
    }
  }
`;

/**
 * __useGetMagmaOrdersQuery__
 *
 * To run a query within a React component, call `useGetMagmaOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMagmaOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMagmaOrdersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMagmaOrdersQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetMagmaOrdersQuery,
    GetMagmaOrdersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetMagmaOrdersQuery, GetMagmaOrdersQueryVariables>(
    GetMagmaOrdersDocument,
    options
  );
}
export function useGetMagmaOrdersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetMagmaOrdersQuery,
    GetMagmaOrdersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetMagmaOrdersQuery, GetMagmaOrdersQueryVariables>(
    GetMagmaOrdersDocument,
    options
  );
}
// @ts-ignore
export function useGetMagmaOrdersSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetMagmaOrdersQuery,
    GetMagmaOrdersQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  GetMagmaOrdersQuery,
  GetMagmaOrdersQueryVariables
>;
export function useGetMagmaOrdersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetMagmaOrdersQuery,
        GetMagmaOrdersQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetMagmaOrdersQuery | undefined,
  GetMagmaOrdersQueryVariables
>;
export function useGetMagmaOrdersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetMagmaOrdersQuery,
        GetMagmaOrdersQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetMagmaOrdersQuery,
    GetMagmaOrdersQueryVariables
  >(GetMagmaOrdersDocument, options);
}
export type GetMagmaOrdersQueryHookResult = ReturnType<
  typeof useGetMagmaOrdersQuery
>;
export type GetMagmaOrdersLazyQueryHookResult = ReturnType<
  typeof useGetMagmaOrdersLazyQuery
>;
export type GetMagmaOrdersSuspenseQueryHookResult = ReturnType<
  typeof useGetMagmaOrdersSuspenseQuery
>;
export type GetMagmaOrdersQueryResult = Apollo.QueryResult<
  GetMagmaOrdersQuery,
  GetMagmaOrdersQueryVariables
>;
