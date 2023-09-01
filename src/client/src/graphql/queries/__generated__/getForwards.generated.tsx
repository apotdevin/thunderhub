import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetForwardsQueryVariables = Types.Exact<{
  days: Types.Scalars['Float']['input'];
}>;

export type GetForwardsQuery = {
  __typename?: 'Query';
  getForwards: Array<{
    __typename?: 'Forward';
    created_at: string;
    fee: number;
    fee_mtokens: string;
    incoming_channel: string;
    mtokens: string;
    outgoing_channel: string;
    tokens: number;
    incoming_channel_info?: {
      __typename?: 'ChannelInfo';
      node1_info: { __typename?: 'BaseNodeInfo'; alias: string };
      node2_info: { __typename?: 'BaseNodeInfo'; alias: string };
    } | null;
    outgoing_channel_info?: {
      __typename?: 'ChannelInfo';
      node1_info: { __typename?: 'BaseNodeInfo'; alias: string };
      node2_info: { __typename?: 'BaseNodeInfo'; alias: string };
    } | null;
  }>;
};

export type GetBasicForwardsQueryVariables = Types.Exact<{
  days: Types.Scalars['Float']['input'];
}>;

export type GetBasicForwardsQuery = {
  __typename?: 'Query';
  getForwards: Array<{
    __typename?: 'Forward';
    created_at: string;
    fee: number;
    fee_mtokens: string;
    mtokens: string;
    tokens: number;
  }>;
};

export const GetForwardsDocument = gql`
  query GetForwards($days: Float!) {
    getForwards(days: $days) {
      created_at
      fee
      fee_mtokens
      incoming_channel
      mtokens
      outgoing_channel
      tokens
      incoming_channel_info {
        node1_info {
          alias
        }
        node2_info {
          alias
        }
      }
      outgoing_channel_info {
        node1_info {
          alias
        }
        node2_info {
          alias
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
export type GetForwardsQueryHookResult = ReturnType<typeof useGetForwardsQuery>;
export type GetForwardsLazyQueryHookResult = ReturnType<
  typeof useGetForwardsLazyQuery
>;
export type GetForwardsQueryResult = Apollo.QueryResult<
  GetForwardsQuery,
  GetForwardsQueryVariables
>;
export const GetBasicForwardsDocument = gql`
  query GetBasicForwards($days: Float!) {
    getForwards(days: $days) {
      created_at
      fee
      fee_mtokens
      mtokens
      tokens
    }
  }
`;

/**
 * __useGetBasicForwardsQuery__
 *
 * To run a query within a React component, call `useGetBasicForwardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBasicForwardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBasicForwardsQuery({
 *   variables: {
 *      days: // value for 'days'
 *   },
 * });
 */
export function useGetBasicForwardsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetBasicForwardsQuery,
    GetBasicForwardsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetBasicForwardsQuery, GetBasicForwardsQueryVariables>(
    GetBasicForwardsDocument,
    options
  );
}
export function useGetBasicForwardsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetBasicForwardsQuery,
    GetBasicForwardsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetBasicForwardsQuery,
    GetBasicForwardsQueryVariables
  >(GetBasicForwardsDocument, options);
}
export type GetBasicForwardsQueryHookResult = ReturnType<
  typeof useGetBasicForwardsQuery
>;
export type GetBasicForwardsLazyQueryHookResult = ReturnType<
  typeof useGetBasicForwardsLazyQuery
>;
export type GetBasicForwardsQueryResult = Apollo.QueryResult<
  GetBasicForwardsQuery,
  GetBasicForwardsQueryVariables
>;
