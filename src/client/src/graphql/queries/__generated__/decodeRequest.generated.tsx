import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DecodeRequestQueryVariables = Types.Exact<{
  request: Types.Scalars['String']['input'];
}>;

export type DecodeRequestQuery = {
  __typename?: 'Query';
  decodeRequest: {
    __typename?: 'DecodeInvoice';
    chain_address?: string | null;
    cltv_delta?: number | null;
    description: string;
    description_hash?: string | null;
    destination: string;
    expires_at: string;
    id: string;
    tokens: number;
    destination_node?: {
      __typename?: 'Node';
      node?: { __typename?: 'NodeType'; alias: string } | null;
    } | null;
    routes: Array<
      Array<{
        __typename?: 'Route';
        base_fee_mtokens?: string | null;
        channel?: string | null;
        cltv_delta?: number | null;
        fee_rate?: number | null;
        public_key: string;
      }>
    >;
  };
};

export const DecodeRequestDocument = gql`
  query DecodeRequest($request: String!) {
    decodeRequest(request: $request) {
      chain_address
      cltv_delta
      description
      description_hash
      destination
      destination_node {
        node {
          alias
        }
      }
      expires_at
      id
      routes {
        base_fee_mtokens
        channel
        cltv_delta
        fee_rate
        public_key
      }
      tokens
    }
  }
`;

/**
 * __useDecodeRequestQuery__
 *
 * To run a query within a React component, call `useDecodeRequestQuery` and pass it any options that fit your needs.
 * When your component renders, `useDecodeRequestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDecodeRequestQuery({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useDecodeRequestQuery(
  baseOptions: Apollo.QueryHookOptions<
    DecodeRequestQuery,
    DecodeRequestQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DecodeRequestQuery, DecodeRequestQueryVariables>(
    DecodeRequestDocument,
    options
  );
}
export function useDecodeRequestLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DecodeRequestQuery,
    DecodeRequestQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DecodeRequestQuery, DecodeRequestQueryVariables>(
    DecodeRequestDocument,
    options
  );
}
export function useDecodeRequestSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    DecodeRequestQuery,
    DecodeRequestQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    DecodeRequestQuery,
    DecodeRequestQueryVariables
  >(DecodeRequestDocument, options);
}
export type DecodeRequestQueryHookResult = ReturnType<
  typeof useDecodeRequestQuery
>;
export type DecodeRequestLazyQueryHookResult = ReturnType<
  typeof useDecodeRequestLazyQuery
>;
export type DecodeRequestSuspenseQueryHookResult = ReturnType<
  typeof useDecodeRequestSuspenseQuery
>;
export type DecodeRequestQueryResult = Apollo.QueryResult<
  DecodeRequestQuery,
  DecodeRequestQueryVariables
>;
