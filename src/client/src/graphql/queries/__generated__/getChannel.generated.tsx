import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetChannelQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;

export type GetChannelQuery = {
  __typename?: 'Query';
  getChannel: {
    __typename?: 'SingleChannel';
    partner_node_policies?:
      | {
          __typename?: 'NodePolicy';
          node?:
            | {
                __typename?: 'Node';
                node?:
                  | { __typename?: 'NodeType'; alias: string }
                  | null
                  | undefined;
              }
            | null
            | undefined;
        }
      | null
      | undefined;
  };
};

export type GetChannelInfoQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;

export type GetChannelInfoQuery = {
  __typename?: 'Query';
  getChannel: {
    __typename?: 'SingleChannel';
    transaction_id: string;
    transaction_vout: number;
    node_policies?:
      | {
          __typename?: 'NodePolicy';
          base_fee_mtokens?: string | null | undefined;
          max_htlc_mtokens?: string | null | undefined;
          min_htlc_mtokens?: string | null | undefined;
          fee_rate?: number | null | undefined;
          cltv_delta?: number | null | undefined;
        }
      | null
      | undefined;
    partner_node_policies?:
      | {
          __typename?: 'NodePolicy';
          node?:
            | {
                __typename?: 'Node';
                node?:
                  | { __typename?: 'NodeType'; alias: string }
                  | null
                  | undefined;
              }
            | null
            | undefined;
        }
      | null
      | undefined;
  };
};

export const GetChannelDocument = gql`
  query GetChannel($id: String!) {
    getChannel(id: $id) {
      partner_node_policies {
        node {
          node {
            alias
          }
        }
      }
    }
  }
`;

/**
 * __useGetChannelQuery__
 *
 * To run a query within a React component, call `useGetChannelQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetChannelQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetChannelQuery,
    GetChannelQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetChannelQuery, GetChannelQueryVariables>(
    GetChannelDocument,
    options
  );
}
export function useGetChannelLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetChannelQuery,
    GetChannelQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetChannelQuery, GetChannelQueryVariables>(
    GetChannelDocument,
    options
  );
}
export type GetChannelQueryHookResult = ReturnType<typeof useGetChannelQuery>;
export type GetChannelLazyQueryHookResult = ReturnType<
  typeof useGetChannelLazyQuery
>;
export type GetChannelQueryResult = Apollo.QueryResult<
  GetChannelQuery,
  GetChannelQueryVariables
>;
export const GetChannelInfoDocument = gql`
  query GetChannelInfo($id: String!) {
    getChannel(id: $id) {
      transaction_id
      transaction_vout
      node_policies {
        base_fee_mtokens
        max_htlc_mtokens
        min_htlc_mtokens
        fee_rate
        cltv_delta
      }
      partner_node_policies {
        node {
          node {
            alias
          }
        }
      }
    }
  }
`;

/**
 * __useGetChannelInfoQuery__
 *
 * To run a query within a React component, call `useGetChannelInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelInfoQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetChannelInfoQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetChannelInfoQuery,
    GetChannelInfoQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetChannelInfoQuery, GetChannelInfoQueryVariables>(
    GetChannelInfoDocument,
    options
  );
}
export function useGetChannelInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetChannelInfoQuery,
    GetChannelInfoQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetChannelInfoQuery, GetChannelInfoQueryVariables>(
    GetChannelInfoDocument,
    options
  );
}
export type GetChannelInfoQueryHookResult = ReturnType<
  typeof useGetChannelInfoQuery
>;
export type GetChannelInfoLazyQueryHookResult = ReturnType<
  typeof useGetChannelInfoLazyQuery
>;
export type GetChannelInfoQueryResult = Apollo.QueryResult<
  GetChannelInfoQuery,
  GetChannelInfoQueryVariables
>;
