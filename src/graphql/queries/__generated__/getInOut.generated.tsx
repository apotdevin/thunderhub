import * as Apollo from '@apollo/client';
import * as Types from '../../types';

const gql = Apollo.gql;

export type GetInOutQueryVariables = Types.Exact<{
  time?: Types.Maybe<Types.Scalars['String']>;
}>;

export type GetInOutQuery = { __typename?: 'Query' } & {
  getInOut?: Types.Maybe<
    { __typename?: 'InOutType' } & Pick<
      Types.InOutType,
      'invoices' | 'payments' | 'confirmedInvoices' | 'unConfirmedInvoices'
    >
  >;
};

export const GetInOutDocument = gql`
  query GetInOut($time: String) {
    getInOut(time: $time) {
      invoices
      payments
      confirmedInvoices
      unConfirmedInvoices
    }
  }
`;

/**
 * __useGetInOutQuery__
 *
 * To run a query within a React component, call `useGetInOutQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInOutQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInOutQuery({
 *   variables: {
 *      time: // value for 'time'
 *   },
 * });
 */
export function useGetInOutQuery(
  baseOptions?: Apollo.QueryHookOptions<GetInOutQuery, GetInOutQueryVariables>
) {
  return Apollo.useQuery<GetInOutQuery, GetInOutQueryVariables>(
    GetInOutDocument,
    baseOptions
  );
}
export function useGetInOutLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetInOutQuery,
    GetInOutQueryVariables
  >
) {
  return Apollo.useLazyQuery<GetInOutQuery, GetInOutQueryVariables>(
    GetInOutDocument,
    baseOptions
  );
}
export type GetInOutQueryHookResult = ReturnType<typeof useGetInOutQuery>;
export type GetInOutLazyQueryHookResult = ReturnType<
  typeof useGetInOutLazyQuery
>;
export type GetInOutQueryResult = Apollo.QueryResult<
  GetInOutQuery,
  GetInOutQueryVariables
>;
