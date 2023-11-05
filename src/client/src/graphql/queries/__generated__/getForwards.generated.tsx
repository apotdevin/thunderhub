import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetForwardsQueryVariables = Types.Exact<{
  days: Types.Scalars['Float']['input'];
}>;

export type GetForwardsQuery = {
  __typename?: 'Query';
  getForwards: {
    __typename?: 'GetForwards';
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
    by_incoming: Array<{
      __typename?: 'AggregatedChannelSideForwards';
      id: string;
      count: number;
      fee: number;
      fee_mtokens: string;
      mtokens: string;
      tokens: number;
      channel?: string | null;
      channel_info?: {
        __typename?: 'ChannelInfo';
        node1_info: {
          __typename?: 'BaseNodeInfo';
          alias: string;
          public_key: string;
        };
        node2_info: {
          __typename?: 'BaseNodeInfo';
          alias: string;
          public_key: string;
        };
      } | null;
    }>;
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
        node1_info: {
          __typename?: 'BaseNodeInfo';
          alias: string;
          public_key: string;
        };
        node2_info: {
          __typename?: 'BaseNodeInfo';
          alias: string;
          public_key: string;
        };
      } | null;
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
      channel_info?: {
        __typename?: 'ChannelInfo';
        node1_info: {
          __typename?: 'BaseNodeInfo';
          alias: string;
          public_key: string;
        };
        node2_info: {
          __typename?: 'BaseNodeInfo';
          alias: string;
          public_key: string;
        };
      } | null;
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
      incoming_channel_info?: {
        __typename?: 'ChannelInfo';
        node1_info: {
          __typename?: 'BaseNodeInfo';
          alias: string;
          public_key: string;
        };
        node2_info: {
          __typename?: 'BaseNodeInfo';
          alias: string;
          public_key: string;
        };
      } | null;
      outgoing_channel_info?: {
        __typename?: 'ChannelInfo';
        node1_info: {
          __typename?: 'BaseNodeInfo';
          alias: string;
          public_key: string;
        };
        node2_info: {
          __typename?: 'BaseNodeInfo';
          alias: string;
          public_key: string;
        };
      } | null;
    }>;
  };
};

export type GetForwardsListQueryVariables = Types.Exact<{
  days: Types.Scalars['Float']['input'];
}>;

export type GetForwardsListQuery = {
  __typename?: 'Query';
  getForwards: {
    __typename?: 'GetForwards';
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

export const GetForwardsDocument = gql`
  query GetForwards($days: Float!) {
    getForwards(days: $days) {
      list {
        id
        created_at
        fee
        fee_mtokens
        incoming_channel
        mtokens
        outgoing_channel
        tokens
      }
      by_incoming {
        id
        count
        fee
        fee_mtokens
        mtokens
        tokens
        channel
        channel_info {
          node1_info {
            alias
            public_key
          }
          node2_info {
            alias
            public_key
          }
        }
      }
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
          node1_info {
            alias
            public_key
          }
          node2_info {
            alias
            public_key
          }
        }
      }
      by_outgoing {
        id
        count
        fee
        fee_mtokens
        mtokens
        tokens
        channel
        channel_info {
          node1_info {
            alias
            public_key
          }
          node2_info {
            alias
            public_key
          }
        }
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
        incoming_channel_info {
          node1_info {
            alias
            public_key
          }
          node2_info {
            alias
            public_key
          }
        }
        outgoing_channel_info {
          node1_info {
            alias
            public_key
          }
          node2_info {
            alias
            public_key
          }
        }
      }
    }
  }
`;

/**
 * __useGetForwardsQuery__
 *
 * To run a query within a React component, call `useGetForwardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetForwardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetForwardsQuery({
 *   variables: {
 *      days: // value for 'days'
 *   },
 * });
 */
export function useGetForwardsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetForwardsQuery,
    GetForwardsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetForwardsQuery, GetForwardsQueryVariables>(
    GetForwardsDocument,
    options
  );
}
export function useGetForwardsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetForwardsQuery,
    GetForwardsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetForwardsQuery, GetForwardsQueryVariables>(
    GetForwardsDocument,
    options
  );
}
export function useGetForwardsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetForwardsQuery,
    GetForwardsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetForwardsQuery, GetForwardsQueryVariables>(
    GetForwardsDocument,
    options
  );
}
export type GetForwardsQueryHookResult = ReturnType<typeof useGetForwardsQuery>;
export type GetForwardsLazyQueryHookResult = ReturnType<
  typeof useGetForwardsLazyQuery
>;
export type GetForwardsSuspenseQueryHookResult = ReturnType<
  typeof useGetForwardsSuspenseQuery
>;
export type GetForwardsQueryResult = Apollo.QueryResult<
  GetForwardsQuery,
  GetForwardsQueryVariables
>;
export const GetForwardsListDocument = gql`
  query GetForwardsList($days: Float!) {
    getForwards(days: $days) {
      list {
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
 *   },
 * });
 */
export function useGetForwardsListQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetForwardsListQuery,
    GetForwardsListQueryVariables
  >
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
export function useGetForwardsListSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetForwardsListQuery,
    GetForwardsListQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
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
