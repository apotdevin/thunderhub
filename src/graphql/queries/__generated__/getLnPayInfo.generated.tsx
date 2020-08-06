import * as Apollo from '@apollo/client';
import * as Types from '../../types';

const gql = Apollo.gql;

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
  baseOptions?: Apollo.QueryHookOptions<
    GetLnPayInfoQuery,
    GetLnPayInfoQueryVariables
  >
) {
  return Apollo.useQuery<GetLnPayInfoQuery, GetLnPayInfoQueryVariables>(
    GetLnPayInfoDocument,
    baseOptions
  );
}
export function useGetLnPayInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLnPayInfoQuery,
    GetLnPayInfoQueryVariables
  >
) {
  return Apollo.useLazyQuery<GetLnPayInfoQuery, GetLnPayInfoQueryVariables>(
    GetLnPayInfoDocument,
    baseOptions
  );
}
export type GetLnPayInfoQueryHookResult = ReturnType<
  typeof useGetLnPayInfoQuery
>;
export type GetLnPayInfoLazyQueryHookResult = ReturnType<
  typeof useGetLnPayInfoLazyQuery
>;
export type GetLnPayInfoQueryResult = Apollo.QueryResult<
  GetLnPayInfoQuery,
  GetLnPayInfoQueryVariables
>;
