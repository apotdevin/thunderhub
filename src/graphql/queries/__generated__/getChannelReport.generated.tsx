import * as Apollo from '@apollo/client';
import * as Types from '../../types';

const gql = Apollo.gql;

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
  baseOptions?: Apollo.QueryHookOptions<
    GetLiquidReportQuery,
    GetLiquidReportQueryVariables
  >
) {
  return Apollo.useQuery<GetLiquidReportQuery, GetLiquidReportQueryVariables>(
    GetLiquidReportDocument,
    baseOptions
  );
}
export function useGetLiquidReportLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLiquidReportQuery,
    GetLiquidReportQueryVariables
  >
) {
  return Apollo.useLazyQuery<
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
export type GetLiquidReportQueryResult = Apollo.QueryResult<
  GetLiquidReportQuery,
  GetLiquidReportQueryVariables
>;
