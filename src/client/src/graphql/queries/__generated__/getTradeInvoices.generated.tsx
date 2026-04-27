import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetTradeInvoicesQueryVariables = Types.Exact<{
  token?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type GetTradeInvoicesQuery = {
  __typename?: 'Query';
  trade: {
    __typename?: 'TradeQueries';
    trade_invoices: {
      __typename?: 'GetTradeInvoicesResult';
      next?: string | null;
      invoices: Array<{
        __typename?: 'TradeInvoice';
        id: string;
        direction: string;
        group_key?: string | null;
        asset_id?: string | null;
        asset_amount: string;
        asset_symbol?: string | null;
        asset_precision?: number | null;
        sats: string;
        is_confirmed: boolean;
        is_canceled?: boolean | null;
        created_at: string;
        confirmed_at?: string | null;
      }>;
    };
  };
};

export const GetTradeInvoicesDocument = gql`
  query GetTradeInvoices($token: String) {
    trade {
      trade_invoices(token: $token) {
        invoices {
          id
          direction
          group_key
          asset_id
          asset_amount
          asset_symbol
          asset_precision
          sats
          is_confirmed
          is_canceled
          created_at
          confirmed_at
        }
        next
      }
    }
  }
`;

/**
 * __useGetTradeInvoicesQuery__
 *
 * To run a query within a React component, call `useGetTradeInvoicesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTradeInvoicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTradeInvoicesQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useGetTradeInvoicesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetTradeInvoicesQuery,
    GetTradeInvoicesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTradeInvoicesQuery, GetTradeInvoicesQueryVariables>(
    GetTradeInvoicesDocument,
    options
  );
}
export function useGetTradeInvoicesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTradeInvoicesQuery,
    GetTradeInvoicesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetTradeInvoicesQuery,
    GetTradeInvoicesQueryVariables
  >(GetTradeInvoicesDocument, options);
}
// @ts-ignore
export function useGetTradeInvoicesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetTradeInvoicesQuery,
    GetTradeInvoicesQueryVariables
  >
): Apollo.UseSuspenseQueryResult<
  GetTradeInvoicesQuery,
  GetTradeInvoicesQueryVariables
>;
export function useGetTradeInvoicesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTradeInvoicesQuery,
        GetTradeInvoicesQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetTradeInvoicesQuery | undefined,
  GetTradeInvoicesQueryVariables
>;
export function useGetTradeInvoicesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTradeInvoicesQuery,
        GetTradeInvoicesQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetTradeInvoicesQuery,
    GetTradeInvoicesQueryVariables
  >(GetTradeInvoicesDocument, options);
}
export type GetTradeInvoicesQueryHookResult = ReturnType<
  typeof useGetTradeInvoicesQuery
>;
export type GetTradeInvoicesLazyQueryHookResult = ReturnType<
  typeof useGetTradeInvoicesLazyQuery
>;
export type GetTradeInvoicesSuspenseQueryHookResult = ReturnType<
  typeof useGetTradeInvoicesSuspenseQuery
>;
export type GetTradeInvoicesQueryResult = Apollo.QueryResult<
  GetTradeInvoicesQuery,
  GetTradeInvoicesQueryVariables
>;
