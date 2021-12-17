import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {};
export type GetInvoiceStatusChangeQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;

export type GetInvoiceStatusChangeQuery = {
  __typename?: 'Query';
  getInvoiceStatusChange: string;
};

export const GetInvoiceStatusChangeDocument = gql`
  query GetInvoiceStatusChange($id: String!) {
    getInvoiceStatusChange(id: $id)
  }
`;

/**
 * __useGetInvoiceStatusChangeQuery__
 *
 * To run a query within a React component, call `useGetInvoiceStatusChangeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInvoiceStatusChangeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInvoiceStatusChangeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetInvoiceStatusChangeQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetInvoiceStatusChangeQuery,
    GetInvoiceStatusChangeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetInvoiceStatusChangeQuery,
    GetInvoiceStatusChangeQueryVariables
  >(GetInvoiceStatusChangeDocument, options);
}
export function useGetInvoiceStatusChangeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetInvoiceStatusChangeQuery,
    GetInvoiceStatusChangeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetInvoiceStatusChangeQuery,
    GetInvoiceStatusChangeQueryVariables
  >(GetInvoiceStatusChangeDocument, options);
}
export type GetInvoiceStatusChangeQueryHookResult = ReturnType<
  typeof useGetInvoiceStatusChangeQuery
>;
export type GetInvoiceStatusChangeLazyQueryHookResult = ReturnType<
  typeof useGetInvoiceStatusChangeLazyQuery
>;
export type GetInvoiceStatusChangeQueryResult = Apollo.QueryResult<
  GetInvoiceStatusChangeQuery,
  GetInvoiceStatusChangeQueryVariables
>;
