import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetPaymentQueryVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;

export type GetPaymentQuery = {
  __typename?: 'Query';
  getPayment: {
    __typename?: 'PaymentType';
    created_at: string;
    destination: string;
    fee: number;
    fee_mtokens: string;
    id: string;
    is_confirmed: boolean;
    is_outgoing: boolean;
    mtokens: string;
    request?: string | null;
    safe_fee: number;
    safe_tokens?: number | null;
    secret: string;
    tokens: string;
    type: string;
    date: string;
    destination_node: {
      __typename?: 'Node';
      node?: {
        __typename?: 'NodeType';
        alias: string;
        public_key: string;
      } | null;
    };
    hops: Array<{
      __typename?: 'Node';
      node?: {
        __typename?: 'NodeType';
        alias: string;
        public_key: string;
      } | null;
    }>;
  };
};

export const GetPaymentDocument = gql`
  query GetPayment($id: String!) {
    getPayment(id: $id) {
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
`;

/**
 * __useGetPaymentQuery__
 *
 * To run a query within a React component, call `useGetPaymentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPaymentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPaymentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPaymentQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetPaymentQuery,
    GetPaymentQueryVariables
  > &
    (
      | { variables: GetPaymentQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetPaymentQuery, GetPaymentQueryVariables>(
    GetPaymentDocument,
    options
  );
}
export function useGetPaymentLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetPaymentQuery,
    GetPaymentQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetPaymentQuery, GetPaymentQueryVariables>(
    GetPaymentDocument,
    options
  );
}
// @ts-ignore
export function useGetPaymentSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetPaymentQuery,
    GetPaymentQueryVariables
  >
): Apollo.UseSuspenseQueryResult<GetPaymentQuery, GetPaymentQueryVariables>;
export function useGetPaymentSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetPaymentQuery, GetPaymentQueryVariables>
): Apollo.UseSuspenseQueryResult<
  GetPaymentQuery | undefined,
  GetPaymentQueryVariables
>;
export function useGetPaymentSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetPaymentQuery, GetPaymentQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetPaymentQuery, GetPaymentQueryVariables>(
    GetPaymentDocument,
    options
  );
}
export type GetPaymentQueryHookResult = ReturnType<typeof useGetPaymentQuery>;
export type GetPaymentLazyQueryHookResult = ReturnType<
  typeof useGetPaymentLazyQuery
>;
export type GetPaymentSuspenseQueryHookResult = ReturnType<
  typeof useGetPaymentSuspenseQuery
>;
export type GetPaymentQueryResult = Apollo.QueryResult<
  GetPaymentQuery,
  GetPaymentQueryVariables
>;
