import * as Types from '../../types';

import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';

export type GetLnPayInfoQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetLnPayInfoQuery = { __typename?: 'Query' } & {
  getLnPayInfo?: Types.Maybe<
    { __typename?: 'lnPayInfoType' } & Pick<Types.LnPayInfoType, 'max' | 'min'>
  >;
};

export const GetLnPayInfoDocument = gql`
  query GetLnPayInfo {
    getLnPayInfo {
      max
      min
    }
  }
`;

/**
 * __useGetLnPayInfoQuery__
 *
 * To run a query within a React component, call `useGetLnPayInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLnPayInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLnPayInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLnPayInfoQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetLnPayInfoQuery,
    GetLnPayInfoQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetLnPayInfoQuery,
    GetLnPayInfoQueryVariables
  >(GetLnPayInfoDocument, baseOptions);
}
export function useGetLnPayInfoLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetLnPayInfoQuery,
    GetLnPayInfoQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetLnPayInfoQuery,
    GetLnPayInfoQueryVariables
  >(GetLnPayInfoDocument, baseOptions);
}
export type GetLnPayInfoQueryHookResult = ReturnType<
  typeof useGetLnPayInfoQuery
>;
export type GetLnPayInfoLazyQueryHookResult = ReturnType<
  typeof useGetLnPayInfoLazyQuery
>;
export type GetLnPayInfoQueryResult = ApolloReactCommon.QueryResult<
  GetLnPayInfoQuery,
  GetLnPayInfoQueryVariables
>;
