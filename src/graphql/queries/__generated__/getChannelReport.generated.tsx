import * as Types from '../../types';

import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';

export type GetLiquidReportQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetLiquidReportQuery = { __typename?: 'Query' } & {
  getChannelReport?: Types.Maybe<
    { __typename?: 'channelReportType' } & Pick<
      Types.ChannelReportType,
      'local' | 'remote' | 'maxIn' | 'maxOut' | 'commit'
    >
  >;
};

export const GetLiquidReportDocument = gql`
  query GetLiquidReport {
    getChannelReport {
      local
      remote
      maxIn
      maxOut
      commit
    }
  }
`;

/**
 * __useGetLiquidReportQuery__
 *
 * To run a query within a React component, call `useGetLiquidReportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLiquidReportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLiquidReportQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLiquidReportQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetLiquidReportQuery,
    GetLiquidReportQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetLiquidReportQuery,
    GetLiquidReportQueryVariables
  >(GetLiquidReportDocument, baseOptions);
}
export function useGetLiquidReportLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetLiquidReportQuery,
    GetLiquidReportQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetLiquidReportQuery,
    GetLiquidReportQueryVariables
  >(GetLiquidReportDocument, baseOptions);
}
export type GetLiquidReportQueryHookResult = ReturnType<
  typeof useGetLiquidReportQuery
>;
export type GetLiquidReportLazyQueryHookResult = ReturnType<
  typeof useGetLiquidReportLazyQuery
>;
export type GetLiquidReportQueryResult = ApolloReactCommon.QueryResult<
  GetLiquidReportQuery,
  GetLiquidReportQueryVariables
>;
