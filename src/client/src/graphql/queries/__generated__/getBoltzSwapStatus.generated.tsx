import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetBoltzSwapStatusQueryVariables = Types.Exact<{
  ids: Array<Types.Scalars['String']> | Types.Scalars['String'];
}>;

export type GetBoltzSwapStatusQuery = {
  __typename?: 'Query';
  getBoltzSwapStatus: Array<{
    __typename?: 'BoltzSwap';
    id?: string | null;
    boltz?: {
      __typename?: 'BoltzSwapStatus';
      status: string;
      transaction?: {
        __typename?: 'BoltzSwapTransaction';
        id?: string | null;
        hex?: string | null;
        eta?: number | null;
      } | null;
    } | null;
  }>;
};

export const GetBoltzSwapStatusDocument = gql`
  query GetBoltzSwapStatus($ids: [String!]!) {
    getBoltzSwapStatus(ids: $ids) {
      id
      boltz {
        status
        transaction {
          id
          hex
          eta
        }
      }
    }
  }
`;

/**
 * __useGetBoltzSwapStatusQuery__
 *
 * To run a query within a React component, call `useGetBoltzSwapStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBoltzSwapStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBoltzSwapStatusQuery({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useGetBoltzSwapStatusQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetBoltzSwapStatusQuery,
    GetBoltzSwapStatusQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetBoltzSwapStatusQuery,
    GetBoltzSwapStatusQueryVariables
  >(GetBoltzSwapStatusDocument, options);
}
export function useGetBoltzSwapStatusLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetBoltzSwapStatusQuery,
    GetBoltzSwapStatusQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetBoltzSwapStatusQuery,
    GetBoltzSwapStatusQueryVariables
  >(GetBoltzSwapStatusDocument, options);
}
export type GetBoltzSwapStatusQueryHookResult = ReturnType<
  typeof useGetBoltzSwapStatusQuery
>;
export type GetBoltzSwapStatusLazyQueryHookResult = ReturnType<
  typeof useGetBoltzSwapStatusLazyQuery
>;
export type GetBoltzSwapStatusQueryResult = Apollo.QueryResult<
  GetBoltzSwapStatusQuery,
  GetBoltzSwapStatusQueryVariables
>;
