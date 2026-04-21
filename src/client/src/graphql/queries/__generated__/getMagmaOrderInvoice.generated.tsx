import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetMagmaOrderInvoiceQueryVariables = Types.Exact<{
  orderId: Types.Scalars['String']['input'];
}>;

export type GetMagmaOrderInvoiceQuery = {
  __typename?: 'Query';
  magma: {
    __typename?: 'MagmaQueries';
    id: string;
    orders: {
      __typename?: 'MagmaOrderQueries';
      get_invoice: {
        __typename?: 'MagmaOrderInvoice';
        invoice?: string | null;
      };
    };
  };
};

export const GetMagmaOrderInvoiceDocument = gql`
  query GetMagmaOrderInvoice($orderId: String!) {
    magma {
      id
      orders {
        get_invoice(orderId: $orderId) {
          invoice
        }
      }
    }
  }
`;

/**
 * __useGetMagmaOrderInvoiceQuery__
 *
 * To run a query within a React component, call `useGetMagmaOrderInvoiceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMagmaOrderInvoiceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMagmaOrderInvoiceQuery({
 *   variables: {
 *      orderId: // value for 'orderId'
 *   },
 * });
 */
export function useGetMagmaOrderInvoiceQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetMagmaOrderInvoiceQuery,
    GetMagmaOrderInvoiceQueryVariables
  > &
    (
      | {
          variables: GetMagmaOrderInvoiceQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetMagmaOrderInvoiceQuery,
    GetMagmaOrderInvoiceQueryVariables
  >(GetMagmaOrderInvoiceDocument, options);
}
export function useGetMagmaOrderInvoiceLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetMagmaOrderInvoiceQuery,
    GetMagmaOrderInvoiceQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetMagmaOrderInvoiceQuery,
    GetMagmaOrderInvoiceQueryVariables
  >(GetMagmaOrderInvoiceDocument, options);
}
export type GetMagmaOrderInvoiceQueryHookResult = ReturnType<
  typeof useGetMagmaOrderInvoiceQuery
>;
export type GetMagmaOrderInvoiceLazyQueryHookResult = ReturnType<
  typeof useGetMagmaOrderInvoiceLazyQuery
>;
export type GetMagmaOrderInvoiceQueryResult = Apollo.QueryResult<
  GetMagmaOrderInvoiceQuery,
  GetMagmaOrderInvoiceQueryVariables
>;
