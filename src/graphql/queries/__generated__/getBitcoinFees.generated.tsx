import {
  gql,
  QueryHookOptions,
  useQuery,
  useLazyQuery,
  QueryResult,
  LazyQueryHookOptions,
} from '@apollo/client';
import * as Types from '../../types';

export type GetBitcoinFeesQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetBitcoinFeesQuery = { __typename?: 'Query' } & {
  getBitcoinFees?: Types.Maybe<
    { __typename?: 'bitcoinFeeType' } & Pick<
      Types.BitcoinFeeType,
      'fast' | 'halfHour' | 'hour'
    >
  >;
};

export const GetBitcoinFeesDocument = gql`
  query GetBitcoinFees {
    getBitcoinFees {
      fast
      halfHour
      hour
    }
  }
`;

/**
 * __useGetBitcoinFeesQuery__
 *
 * To run a query within a React component, call `useGetBitcoinFeesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBitcoinFeesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBitcoinFeesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBitcoinFeesQuery(
  baseOptions?: QueryHookOptions<
    GetBitcoinFeesQuery,
    GetBitcoinFeesQueryVariables
  >
) {
  return useQuery<GetBitcoinFeesQuery, GetBitcoinFeesQueryVariables>(
    GetBitcoinFeesDocument,
    baseOptions
  );
}
export function useGetBitcoinFeesLazyQuery(
  baseOptions?: LazyQueryHookOptions<
    GetBitcoinFeesQuery,
    GetBitcoinFeesQueryVariables
  >
) {
  return useLazyQuery<GetBitcoinFeesQuery, GetBitcoinFeesQueryVariables>(
    GetBitcoinFeesDocument,
    baseOptions
  );
}
export type GetBitcoinFeesQueryHookResult = ReturnType<
  typeof useGetBitcoinFeesQuery
>;
export type GetBitcoinFeesLazyQueryHookResult = ReturnType<
  typeof useGetBitcoinFeesLazyQuery
>;
export type GetBitcoinFeesQueryResult = QueryResult<
  GetBitcoinFeesQuery,
  GetBitcoinFeesQueryVariables
>;
