import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetForwardsListQueryVariables = Types.Exact<{
  days: Types.Scalars['Float']['input'];
  limit?: Types.InputMaybe<Types.Scalars['Float']['input']>;
  offset?: Types.InputMaybe<Types.Scalars['Float']['input']>;
}>;

export type GetForwardsListQuery = {
  __typename?: 'Query';
  getForwards: {
    __typename?: 'GetForwards';
    summary: { __typename?: 'ForwardSummary'; count: number };
    list: Array<{
      __typename?: 'Forward';
      id: string;
      created_at: string;
      fee: number;
      fee_mtokens: string;
      incoming_channel: string;
      mtokens: string;
      outgoing_channel: string;
      tokens: number;
    }>;
  };
};

export type GetForwardsGraphQueryVariables = Types.Exact<{
  days: Types.Scalars['Float']['input'];
}>;

export type GetForwardsGraphQuery = {
  __typename?: 'Query';
  getForwards: {
    __typename?: 'GetForwards';
    summary: { __typename?: 'ForwardSummary'; count: number };
    by_time: Array<{
      __typename?: 'ForwardTimeSeries';
      date: string;
      tokens: number;
      fee: number;
      count: number;
    }>;
  };
};

export type GetForwardsChannelsQueryVariables = Types.Exact<{
  days: Types.Scalars['Float']['input'];
}>;

export type GetForwardsChannelsQuery = {
  __typename?: 'Query';
  getForwards: {
    __typename?: 'GetForwards';
    by_channel: Array<{
      __typename?: 'AggregatedChannelForwards';
      id: string;
      channel?: string | null;
      incoming: {
        __typename?: 'AggregatedSideStats';
        id: string;
        count: number;
        fee: number;
        fee_mtokens: string;
        mtokens: string;
        tokens: number;
      };
      outgoing: {
        __typename?: 'AggregatedSideStats';
        id: string;
        count: number;
        fee: number;
        fee_mtokens: string;
        mtokens: string;
        tokens: number;
      };
      channel_info?: {
        __typename?: 'ChannelInfo';
        node2_info: {
          __typename?: 'BaseNodeInfo';
          alias: string;
          public_key: string;
        };
      } | null;
    }>;
    by_incoming: Array<{
      __typename?: 'AggregatedChannelSideForwards';
      id: string;
      count: number;
      fee: number;
      fee_mtokens: string;
      mtokens: string;
      tokens: number;
      channel?: string | null;
    }>;
    by_outgoing: Array<{
      __typename?: 'AggregatedChannelSideForwards';
      id: string;
      count: number;
      fee: number;
      fee_mtokens: string;
      mtokens: string;
      tokens: number;
      channel?: string | null;
    }>;
    by_route: Array<{
      __typename?: 'AggregatedRouteForwards';
      id: string;
      count: number;
      fee: number;
      fee_mtokens: string;
      mtokens: string;
      tokens: number;
      route: string;
      incoming_channel: string;
      outgoing_channel: string;
    }>;
  };
};

export type GetForwardsSummaryQueryVariables = Types.Exact<{
  days: Types.Scalars['Float']['input'];
}>;

export type GetForwardsSummaryQuery = {
  __typename?: 'Query';
  getForwards: {
    __typename?: 'GetForwards';
    summary: {
      __typename?: 'ForwardSummary';
      count: number;
      day: {
        __typename?: 'ForwardTimeSummary';
        count: number;
        fee: number;
        fee_mtokens: string;
        tokens: number;
      };
      week: {
        __typename?: 'ForwardTimeSummary';
        count: number;
        fee: number;
        fee_mtokens: string;
        tokens: number;
      };
      month: {
        __typename?: 'ForwardTimeSummary';
        count: number;
        fee: number;
        fee_mtokens: string;
        tokens: number;
      };
      year: {
        __typename?: 'ForwardTimeSummary';
        count: number;
        fee: number;
        fee_mtokens: string;
        tokens: number;
      };
    };
  };
};

export const GetForwardsListDocument = gql`
  query GetForwardsList($days: Float!, $limit: Float, $offset: Float) {
    getForwards(days: $days) {
      summary {
        count
      }
      list(limit: $limit, offset: $offset) {
        id
        created_at
        fee
        fee_mtokens
        incoming_channel
        mtokens
        outgoing_channel
        tokens
      }
    }
  }
`;

/**
 * __useGetForwardsListQuery__
 *
 * To run a query within a React component, call `useGetForwardsListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetForwardsListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetForwardsListQuery({
 *   variables: {
 *      days: // value for 'days'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetForwardsListQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetForwardsListQuery,
    GetForwardsListQueryVariables
  > &
    (
      | { variables: GetForwardsListQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetForwardsListQuery, GetForwardsListQueryVariables>(
    GetForwardsListDocument,
    options
  );
}
export function useGetForwardsListLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetForwardsListQuery,
    GetForwardsListQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetForwardsListQuery,
    GetForwardsListQueryVariables
  >(GetForwardsListDocument, options);
}
// @ts-ignore
export function useGetForwardsListSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetForwardsListQuery,
    GetForwardsListQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  GetForwardsListQuery,
  GetForwardsListQueryVariables
>;
export function useGetForwardsListSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetForwardsListQuery,
        GetForwardsListQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetForwardsListQuery | undefined,
  GetForwardsListQueryVariables
>;
export function useGetForwardsListSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetForwardsListQuery,
        GetForwardsListQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetForwardsListQuery,
    GetForwardsListQueryVariables
  >(GetForwardsListDocument, options);
}
export type GetForwardsListQueryHookResult = ReturnType<
  typeof useGetForwardsListQuery
>;
export type GetForwardsListLazyQueryHookResult = ReturnType<
  typeof useGetForwardsListLazyQuery
>;
export type GetForwardsListSuspenseQueryHookResult = ReturnType<
  typeof useGetForwardsListSuspenseQuery
>;
export type GetForwardsListQueryResult = Apollo.QueryResult<
  GetForwardsListQuery,
  GetForwardsListQueryVariables
>;
export const GetForwardsGraphDocument = gql`
  query GetForwardsGraph($days: Float!) {
    getForwards(days: $days) {
      summary {
        count
      }
      by_time {
        date
        tokens
        fee
        count
      }
    }
  }
`;

/**
 * __useGetForwardsGraphQuery__
 *
 * To run a query within a React component, call `useGetForwardsGraphQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetForwardsGraphQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetForwardsGraphQuery({
 *   variables: {
 *      days: // value for 'days'
 *   },
 * });
 */
export function useGetForwardsGraphQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetForwardsGraphQuery,
    GetForwardsGraphQueryVariables
  > &
    (
      | { variables: GetForwardsGraphQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetForwardsGraphQuery, GetForwardsGraphQueryVariables>(
    GetForwardsGraphDocument,
    options
  );
}
export function useGetForwardsGraphLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetForwardsGraphQuery,
    GetForwardsGraphQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetForwardsGraphQuery,
    GetForwardsGraphQueryVariables
  >(GetForwardsGraphDocument, options);
}
// @ts-ignore
export function useGetForwardsGraphSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetForwardsGraphQuery,
    GetForwardsGraphQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  GetForwardsGraphQuery,
  GetForwardsGraphQueryVariables
>;
export function useGetForwardsGraphSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetForwardsGraphQuery,
        GetForwardsGraphQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetForwardsGraphQuery | undefined,
  GetForwardsGraphQueryVariables
>;
export function useGetForwardsGraphSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetForwardsGraphQuery,
        GetForwardsGraphQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetForwardsGraphQuery,
    GetForwardsGraphQueryVariables
  >(GetForwardsGraphDocument, options);
}
export type GetForwardsGraphQueryHookResult = ReturnType<
  typeof useGetForwardsGraphQuery
>;
export type GetForwardsGraphLazyQueryHookResult = ReturnType<
  typeof useGetForwardsGraphLazyQuery
>;
export type GetForwardsGraphSuspenseQueryHookResult = ReturnType<
  typeof useGetForwardsGraphSuspenseQuery
>;
export type GetForwardsGraphQueryResult = Apollo.QueryResult<
  GetForwardsGraphQuery,
  GetForwardsGraphQueryVariables
>;
export const GetForwardsChannelsDocument = gql`
  query GetForwardsChannels($days: Float!) {
    getForwards(days: $days) {
      by_channel {
        id
        incoming {
          id
          count
          fee
          fee_mtokens
          mtokens
          tokens
        }
        outgoing {
          id
          count
          fee
          fee_mtokens
          mtokens
          tokens
        }
        channel
        channel_info {
          node2_info {
            alias
            public_key
          }
        }
      }
      by_incoming {
        id
        count
        fee
        fee_mtokens
        mtokens
        tokens
        channel
      }
      by_outgoing {
        id
        count
        fee
        fee_mtokens
        mtokens
        tokens
        channel
      }
      by_route {
        id
        count
        fee
        fee_mtokens
        mtokens
        tokens
        route
        incoming_channel
        outgoing_channel
      }
    }
  }
`;

/**
 * __useGetForwardsChannelsQuery__
 *
 * To run a query within a React component, call `useGetForwardsChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetForwardsChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetForwardsChannelsQuery({
 *   variables: {
 *      days: // value for 'days'
 *   },
 * });
 */
export function useGetForwardsChannelsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetForwardsChannelsQuery,
    GetForwardsChannelsQueryVariables
  > &
    (
      | { variables: GetForwardsChannelsQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetForwardsChannelsQuery,
    GetForwardsChannelsQueryVariables
  >(GetForwardsChannelsDocument, options);
}
export function useGetForwardsChannelsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetForwardsChannelsQuery,
    GetForwardsChannelsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetForwardsChannelsQuery,
    GetForwardsChannelsQueryVariables
  >(GetForwardsChannelsDocument, options);
}
// @ts-ignore
export function useGetForwardsChannelsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetForwardsChannelsQuery,
    GetForwardsChannelsQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  GetForwardsChannelsQuery,
  GetForwardsChannelsQueryVariables
>;
export function useGetForwardsChannelsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetForwardsChannelsQuery,
        GetForwardsChannelsQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetForwardsChannelsQuery | undefined,
  GetForwardsChannelsQueryVariables
>;
export function useGetForwardsChannelsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetForwardsChannelsQuery,
        GetForwardsChannelsQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetForwardsChannelsQuery,
    GetForwardsChannelsQueryVariables
  >(GetForwardsChannelsDocument, options);
}
export type GetForwardsChannelsQueryHookResult = ReturnType<
  typeof useGetForwardsChannelsQuery
>;
export type GetForwardsChannelsLazyQueryHookResult = ReturnType<
  typeof useGetForwardsChannelsLazyQuery
>;
export type GetForwardsChannelsSuspenseQueryHookResult = ReturnType<
  typeof useGetForwardsChannelsSuspenseQuery
>;
export type GetForwardsChannelsQueryResult = Apollo.QueryResult<
  GetForwardsChannelsQuery,
  GetForwardsChannelsQueryVariables
>;
export const GetForwardsSummaryDocument = gql`
  query GetForwardsSummary($days: Float!) {
    getForwards(days: $days) {
      summary {
        count
        day {
          count
          fee
          fee_mtokens
          tokens
        }
        week {
          count
          fee
          fee_mtokens
          tokens
        }
        month {
          count
          fee
          fee_mtokens
          tokens
        }
        year {
          count
          fee
          fee_mtokens
          tokens
        }
      }
    }
  }
`;

/**
 * __useGetForwardsSummaryQuery__
 *
 * To run a query within a React component, call `useGetForwardsSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetForwardsSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetForwardsSummaryQuery({
 *   variables: {
 *      days: // value for 'days'
 *   },
 * });
 */
export function useGetForwardsSummaryQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetForwardsSummaryQuery,
    GetForwardsSummaryQueryVariables
  > &
    (
      | { variables: GetForwardsSummaryQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetForwardsSummaryQuery,
    GetForwardsSummaryQueryVariables
  >(GetForwardsSummaryDocument, options);
}
export function useGetForwardsSummaryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetForwardsSummaryQuery,
    GetForwardsSummaryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetForwardsSummaryQuery,
    GetForwardsSummaryQueryVariables
  >(GetForwardsSummaryDocument, options);
}
// @ts-ignore
export function useGetForwardsSummarySuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetForwardsSummaryQuery,
    GetForwardsSummaryQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  GetForwardsSummaryQuery,
  GetForwardsSummaryQueryVariables
>;
export function useGetForwardsSummarySuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetForwardsSummaryQuery,
        GetForwardsSummaryQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetForwardsSummaryQuery | undefined,
  GetForwardsSummaryQueryVariables
>;
export function useGetForwardsSummarySuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetForwardsSummaryQuery,
        GetForwardsSummaryQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetForwardsSummaryQuery,
    GetForwardsSummaryQueryVariables
  >(GetForwardsSummaryDocument, options);
}
export type GetForwardsSummaryQueryHookResult = ReturnType<
  typeof useGetForwardsSummaryQuery
>;
export type GetForwardsSummaryLazyQueryHookResult = ReturnType<
  typeof useGetForwardsSummaryLazyQuery
>;
export type GetForwardsSummarySuspenseQueryHookResult = ReturnType<
  typeof useGetForwardsSummarySuspenseQuery
>;
export type GetForwardsSummaryQueryResult = Apollo.QueryResult<
  GetForwardsSummaryQuery,
  GetForwardsSummaryQueryVariables
>;
