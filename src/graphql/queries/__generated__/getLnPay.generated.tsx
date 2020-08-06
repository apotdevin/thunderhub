import * as Apollo from '@apollo/client';
import * as Types from '../../types';

const gql = Apollo.gql;

export type GetLnPayQueryVariables = Types.Exact<{
  amount: Types.Scalars['Int'];
}>;

export type GetLnPayQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'getLnPay'
>;

export const GetLnPayDocument = gql`
  query GetLnPay($amount: Int!) {
    getLnPay(amount: $amount)
  }
`;

/**
 * __useGetLnPayQuery__
 *
 * To run a query within a React component, call `useGetLnPayQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLnPayQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLnPayQuery({
 *   variables: {
 *      amount: // value for 'amount'
 *   },
 * });
 */
export function useGetLnPayQuery(
  baseOptions?: Apollo.QueryHookOptions<GetLnPayQuery, GetLnPayQueryVariables>
) {
  return Apollo.useQuery<GetLnPayQuery, GetLnPayQueryVariables>(
    GetLnPayDocument,
    baseOptions
  );
}
export function useGetLnPayLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLnPayQuery,
    GetLnPayQueryVariables
  >
) {
  return Apollo.useLazyQuery<GetLnPayQuery, GetLnPayQueryVariables>(
    GetLnPayDocument,
    baseOptions
  );
}
export type GetLnPayQueryHookResult = ReturnType<typeof useGetLnPayQuery>;
export type GetLnPayLazyQueryHookResult = ReturnType<
  typeof useGetLnPayLazyQuery
>;
export type GetLnPayQueryResult = Apollo.QueryResult<
  GetLnPayQuery,
  GetLnPayQueryVariables
>;
