import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetInvoiceQueryVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;

export type GetInvoiceQuery = {
  __typename?: 'Query';
  getInvoice: {
    __typename?: 'InvoiceType';
    chain_address?: string | null;
    confirmed_at?: string | null;
    created_at: string;
    description: string;
    description_hash?: string | null;
    expires_at: string;
    id: string;
    is_canceled?: boolean | null;
    is_confirmed: boolean;
    is_held?: boolean | null;
    is_private: boolean;
    is_push?: boolean | null;
    received: number;
    received_mtokens: string;
    request?: string | null;
    secret: string;
    tokens: string;
    type: string;
    date: string;
    payments: Array<{
      __typename?: 'InvoicePayment';
      canceled_at?: string | null;
      confirmed_at?: string | null;
      created_at: string;
      created_height: number;
      is_canceled: boolean;
      is_confirmed: boolean;
      is_held: boolean;
      mtokens: string;
      pending_index?: number | null;
      timeout: number;
      tokens: number;
      total_mtokens?: string | null;
      in_channel: string;
      messages?: { __typename?: 'MessageType'; message?: string | null } | null;
    }>;
  };
};

export const GetInvoiceDocument = gql`
  query GetInvoice($id: String!) {
    getInvoice(id: $id) {
      chain_address
      confirmed_at
      created_at
      description
      description_hash
      expires_at
      id
      is_canceled
      is_confirmed
      is_held
      is_private
      is_push
      received
      received_mtokens
      request
      secret
      tokens
      type
      date
      payments {
        canceled_at
        confirmed_at
        created_at
        created_height
        is_canceled
        is_confirmed
        is_held
        mtokens
        pending_index
        timeout
        tokens
        total_mtokens
        in_channel
        messages {
          message
        }
      }
    }
  }
`;

/**
 * __useGetInvoiceQuery__
 *
 * To run a query within a React component, call `useGetInvoiceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInvoiceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInvoiceQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetInvoiceQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetInvoiceQuery,
    GetInvoiceQueryVariables
  > &
    (
      | { variables: GetInvoiceQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetInvoiceQuery, GetInvoiceQueryVariables>(
    GetInvoiceDocument,
    options
  );
}
export function useGetInvoiceLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetInvoiceQuery,
    GetInvoiceQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetInvoiceQuery, GetInvoiceQueryVariables>(
    GetInvoiceDocument,
    options
  );
}
// @ts-ignore
export function useGetInvoiceSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetInvoiceQuery,
    GetInvoiceQueryVariables
  >
): Apollo.UseSuspenseQueryResult<GetInvoiceQuery, GetInvoiceQueryVariables>;
export function useGetInvoiceSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetInvoiceQuery, GetInvoiceQueryVariables>
): Apollo.UseSuspenseQueryResult<
  GetInvoiceQuery | undefined,
  GetInvoiceQueryVariables
>;
export function useGetInvoiceSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetInvoiceQuery, GetInvoiceQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetInvoiceQuery, GetInvoiceQueryVariables>(
    GetInvoiceDocument,
    options
  );
}
export type GetInvoiceQueryHookResult = ReturnType<typeof useGetInvoiceQuery>;
export type GetInvoiceLazyQueryHookResult = ReturnType<
  typeof useGetInvoiceLazyQuery
>;
export type GetInvoiceSuspenseQueryHookResult = ReturnType<
  typeof useGetInvoiceSuspenseQuery
>;
export type GetInvoiceQueryResult = Apollo.QueryResult<
  GetInvoiceQuery,
  GetInvoiceQueryVariables
>;
