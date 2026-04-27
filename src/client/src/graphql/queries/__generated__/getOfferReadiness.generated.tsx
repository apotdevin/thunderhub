import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetOfferReadinessQueryVariables = Types.Exact<{
  input: Types.OfferReadinessInput;
}>;

export type GetOfferReadinessQuery = {
  __typename?: 'Query';
  rails: {
    __typename?: 'RailsQueries';
    id: string;
    offer_readiness: {
      __typename?: 'OfferReadinessResult';
      is_peer_connected: boolean;
      has_pending_order: boolean;
      btc_channels: {
        __typename?: 'ChannelSummary';
        open_count: number;
        pending_count: number;
        total_local_sats: string;
        total_remote_sats: string;
        has_active_channel: boolean;
      };
      asset_channels: {
        __typename?: 'AssetChannelSummary';
        open_count: number;
        pending_count: number;
        total_local_atomic: string;
        total_remote_atomic: string;
        has_active_channel: boolean;
      };
    };
  };
};

export const GetOfferReadinessDocument = gql`
  query GetOfferReadiness($input: OfferReadinessInput!) {
    rails {
      id
      offer_readiness(input: $input) {
        is_peer_connected
        has_pending_order
        btc_channels {
          open_count
          pending_count
          total_local_sats
          total_remote_sats
          has_active_channel
        }
        asset_channels {
          open_count
          pending_count
          total_local_atomic
          total_remote_atomic
          has_active_channel
        }
      }
    }
  }
`;

/**
 * __useGetOfferReadinessQuery__
 *
 * To run a query within a React component, call `useGetOfferReadinessQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOfferReadinessQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOfferReadinessQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetOfferReadinessQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetOfferReadinessQuery,
    GetOfferReadinessQueryVariables
  > &
    (
      | { variables: GetOfferReadinessQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetOfferReadinessQuery,
    GetOfferReadinessQueryVariables
  >(GetOfferReadinessDocument, options);
}
export function useGetOfferReadinessLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetOfferReadinessQuery,
    GetOfferReadinessQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetOfferReadinessQuery,
    GetOfferReadinessQueryVariables
  >(GetOfferReadinessDocument, options);
}
// @ts-ignore
export function useGetOfferReadinessSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetOfferReadinessQuery,
    GetOfferReadinessQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  GetOfferReadinessQuery,
  GetOfferReadinessQueryVariables
>;
export function useGetOfferReadinessSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetOfferReadinessQuery,
        GetOfferReadinessQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetOfferReadinessQuery | undefined,
  GetOfferReadinessQueryVariables
>;
export function useGetOfferReadinessSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetOfferReadinessQuery,
        GetOfferReadinessQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetOfferReadinessQuery,
    GetOfferReadinessQueryVariables
  >(GetOfferReadinessDocument, options);
}
export type GetOfferReadinessQueryHookResult = ReturnType<
  typeof useGetOfferReadinessQuery
>;
export type GetOfferReadinessLazyQueryHookResult = ReturnType<
  typeof useGetOfferReadinessLazyQuery
>;
export type GetOfferReadinessSuspenseQueryHookResult = ReturnType<
  typeof useGetOfferReadinessSuspenseQuery
>;
export type GetOfferReadinessQueryResult = Apollo.QueryResult<
  GetOfferReadinessQuery,
  GetOfferReadinessQueryVariables
>;
