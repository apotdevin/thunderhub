import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../../types';

export type GetUtxosQueryVariables = Types.Exact<{
  auth: Types.AuthType;
}>;

export type GetUtxosQuery = { __typename?: 'Query' } & {
  getUtxos?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'getUtxosType' } & Pick<
          Types.GetUtxosType,
          | 'address'
          | 'address_format'
          | 'confirmation_count'
          | 'output_script'
          | 'tokens'
          | 'transaction_id'
          | 'transaction_vout'
        >
      >
    >
  >;
};

export const GetUtxosDocument = gql`
  query GetUtxos($auth: authType!) {
    getUtxos(auth: $auth) {
      address
      address_format
      confirmation_count
      output_script
      tokens
      transaction_id
      transaction_vout
    }
  }
`;

/**
 * __useGetUtxosQuery__
 *
 * To run a query within a React component, call `useGetUtxosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUtxosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUtxosQuery({
 *   variables: {
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useGetUtxosQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetUtxosQuery,
    GetUtxosQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<GetUtxosQuery, GetUtxosQueryVariables>(
    GetUtxosDocument,
    baseOptions
  );
}
export function useGetUtxosLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetUtxosQuery,
    GetUtxosQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<GetUtxosQuery, GetUtxosQueryVariables>(
    GetUtxosDocument,
    baseOptions
  );
}
export type GetUtxosQueryHookResult = ReturnType<typeof useGetUtxosQuery>;
export type GetUtxosLazyQueryHookResult = ReturnType<
  typeof useGetUtxosLazyQuery
>;
export type GetUtxosQueryResult = ApolloReactCommon.QueryResult<
  GetUtxosQuery,
  GetUtxosQueryVariables
>;
