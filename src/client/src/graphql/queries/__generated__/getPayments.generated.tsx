import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetPaymentsQueryVariables = Types.Exact<{
  token?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type GetPaymentsQuery = {
  __typename?: 'Query';
  getPayments: {
    __typename?: 'GetPaymentsType';
    next?: string | null | undefined;
    payments: Array<{
      __typename?: 'PaymentType';
      created_at: string;
      destination: string;
      fee: number;
      fee_mtokens: string;
      id: string;
      index?: number | null | undefined;
      is_confirmed: boolean;
      is_outgoing: boolean;
      mtokens: string;
      request?: string | null | undefined;
      safe_fee: number;
      safe_tokens?: number | null | undefined;
      secret: string;
      tokens: string;
      type: string;
      date: string;
      destination_node: {
        __typename?: 'Node';
        node?:
          | { __typename?: 'NodeType'; alias: string; public_key: string }
          | null
          | undefined;
      };
      hops: Array<{
        __typename?: 'Node';
        node?:
          | { __typename?: 'NodeType'; alias: string; public_key: string }
          | null
          | undefined;
      }>;
    }>;
  };
};

export const GetPaymentsDocument = gql`
  query GetPayments($token: String) {
    getPayments(token: $token) {
      next
      payments {
        created_at
        destination
        destination_node {
          node {
            alias
            public_key
          }
        }
        fee
        fee_mtokens
        hops {
          node {
            alias
            public_key
          }
        }
        id
        index
        is_confirmed
        is_outgoing
        mtokens
        request
        safe_fee
        safe_tokens
        secret
        tokens
        type
        date
      }
    }
  }
`;

/**
 * __useGetPaymentsQuery__
 *
 * To run a query within a React component, call `useGetPaymentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPaymentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPaymentsQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useGetPaymentsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetPaymentsQuery,
    GetPaymentsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetPaymentsQuery, GetPaymentsQueryVariables>(
    GetPaymentsDocument,
    options
  );
}
export function useGetPaymentsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetPaymentsQuery,
    GetPaymentsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetPaymentsQuery, GetPaymentsQueryVariables>(
    GetPaymentsDocument,
    options
  );
}
export type GetPaymentsQueryHookResult = ReturnType<typeof useGetPaymentsQuery>;
export type GetPaymentsLazyQueryHookResult = ReturnType<
  typeof useGetPaymentsLazyQuery
>;
export type GetPaymentsQueryResult = Apollo.QueryResult<
  GetPaymentsQuery,
  GetPaymentsQueryVariables
>;
