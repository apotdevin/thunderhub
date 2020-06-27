import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type GetInOutQueryVariables = Types.Exact<{
  auth: Types.AuthType;
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
  query GetInOut($auth: authType!, $time: String) {
    getInOut(auth: $auth, time: $time) {
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
 *      auth: // value for 'auth'
 *      time: // value for 'time'
 *   },
 * });
 */
export function useGetInOutQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetInOutQuery,
    GetInOutQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetInOutQuery, GetInOutQueryVariables>(
    GetInOutDocument,
    baseOptions
  );
}
export function useGetInOutLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetInOutQuery,
    GetInOutQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<GetInOutQuery, GetInOutQueryVariables>(
    GetInOutDocument,
    baseOptions
  );
}
export type GetInOutQueryHookResult = ReturnType<typeof useGetInOutQuery>;
export type GetInOutLazyQueryHookResult = ReturnType<
  typeof useGetInOutLazyQuery
>;
export type GetInOutQueryResult = ApolloReactCommon.QueryResult<
  GetInOutQuery,
  GetInOutQueryVariables
>;
