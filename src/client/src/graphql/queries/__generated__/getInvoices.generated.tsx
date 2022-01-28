import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetInvoicesQueryVariables = Types.Exact<{
  token?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type GetInvoicesQuery = {
  __typename?: 'Query';
  getInvoices: {
    __typename?: 'GetInvoicesType';
    next?: string | null | undefined;
    invoices: Array<{
      __typename?: 'InvoiceType';
      chain_address?: string | null | undefined;
      confirmed_at?: string | null | undefined;
      created_at: string;
      description: string;
      description_hash?: string | null | undefined;
      expires_at: string;
      id: string;
      is_canceled?: boolean | null | undefined;
      is_confirmed: boolean;
      is_held?: boolean | null | undefined;
      is_private: boolean;
      is_push?: boolean | null | undefined;
      received: number;
      received_mtokens: string;
      request?: string | null | undefined;
      secret: string;
      tokens: string;
      type: string;
      date: string;
      payments: Array<{
        __typename?: 'InvoicePayment';
        in_channel: string;
        messages?:
          | { __typename?: 'MessageType'; message?: string | null | undefined }
          | null
          | undefined;
      }>;
    }>;
  };
};

export const GetInvoicesDocument = gql`
  query GetInvoices($token: String) {
    getInvoices(token: $token) {
      next
      invoices {
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
          in_channel
          messages {
            message
          }
        }
      }
    }
  }
`;

/**
 * __useGetInvoicesQuery__
 *
 * To run a query within a React component, call `useGetInvoicesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInvoicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInvoicesQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useGetInvoicesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetInvoicesQuery,
    GetInvoicesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetInvoicesQuery, GetInvoicesQueryVariables>(
    GetInvoicesDocument,
    options
  );
}
export function useGetInvoicesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetInvoicesQuery,
    GetInvoicesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetInvoicesQuery, GetInvoicesQueryVariables>(
    GetInvoicesDocument,
    options
  );
}
export type GetInvoicesQueryHookResult = ReturnType<typeof useGetInvoicesQuery>;
export type GetInvoicesLazyQueryHookResult = ReturnType<
  typeof useGetInvoicesLazyQuery
>;
export type GetInvoicesQueryResult = Apollo.QueryResult<
  GetInvoicesQuery,
  GetInvoicesQueryVariables
>;
