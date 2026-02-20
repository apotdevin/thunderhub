import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetBoltzInfoQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetBoltzInfoQuery = {
  __typename?: 'Query';
  getBoltzInfo: {
    __typename?: 'BoltzInfoType';
    max: number;
    min: number;
    feePercent: number;
  };
};

export const GetBoltzInfoDocument = gql`
  query GetBoltzInfo {
    getBoltzInfo {
      max
      min
      feePercent
    }
  }
`;

/**
 * __useGetBoltzInfoQuery__
 *
 * To run a query within a React component, call `useGetBoltzInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBoltzInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBoltzInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBoltzInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetBoltzInfoQuery,
    GetBoltzInfoQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetBoltzInfoQuery, GetBoltzInfoQueryVariables>(
    GetBoltzInfoDocument,
    options
  );
}
export function useGetBoltzInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetBoltzInfoQuery,
    GetBoltzInfoQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetBoltzInfoQuery, GetBoltzInfoQueryVariables>(
    GetBoltzInfoDocument,
    options
  );
}
// @ts-ignore
export function useGetBoltzInfoSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetBoltzInfoQuery,
    GetBoltzInfoQueryVariables
  >
): Apollo.UseSuspenseQueryResult<GetBoltzInfoQuery, GetBoltzInfoQueryVariables>;
export function useGetBoltzInfoSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetBoltzInfoQuery,
        GetBoltzInfoQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetBoltzInfoQuery | undefined,
  GetBoltzInfoQueryVariables
>;
export function useGetBoltzInfoSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetBoltzInfoQuery,
        GetBoltzInfoQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetBoltzInfoQuery, GetBoltzInfoQueryVariables>(
    GetBoltzInfoDocument,
    options
  );
}
export type GetBoltzInfoQueryHookResult = ReturnType<
  typeof useGetBoltzInfoQuery
>;
export type GetBoltzInfoLazyQueryHookResult = ReturnType<
  typeof useGetBoltzInfoLazyQuery
>;
export type GetBoltzInfoSuspenseQueryHookResult = ReturnType<
  typeof useGetBoltzInfoSuspenseQuery
>;
export type GetBoltzInfoQueryResult = Apollo.QueryResult<
  GetBoltzInfoQuery,
  GetBoltzInfoQueryVariables
>;
