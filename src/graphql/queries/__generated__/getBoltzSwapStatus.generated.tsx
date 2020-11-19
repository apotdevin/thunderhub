/* eslint-disable */
import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GetBoltzSwapStatusQueryVariables = Types.Exact<{
  ids: Array<Types.Maybe<Types.Scalars['String']>>;
}>;


export type GetBoltzSwapStatusQuery = (
  { __typename?: 'Query' }
  & { getBoltzSwapStatus: Array<Types.Maybe<(
    { __typename?: 'BoltzSwap' }
    & Pick<Types.BoltzSwap, 'id'>
    & { boltz?: Types.Maybe<(
      { __typename?: 'BoltzSwapStatus' }
      & Pick<Types.BoltzSwapStatus, 'status'>
      & { transaction?: Types.Maybe<(
        { __typename?: 'BoltzSwapTransaction' }
        & Pick<Types.BoltzSwapTransaction, 'id' | 'hex' | 'eta'>
      )> }
    )> }
  )>> }
);


export const GetBoltzSwapStatusDocument = gql`
    query GetBoltzSwapStatus($ids: [String]!) {
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
export function useGetBoltzSwapStatusQuery(baseOptions: Apollo.QueryHookOptions<GetBoltzSwapStatusQuery, GetBoltzSwapStatusQueryVariables>) {
        return Apollo.useQuery<GetBoltzSwapStatusQuery, GetBoltzSwapStatusQueryVariables>(GetBoltzSwapStatusDocument, baseOptions);
      }
export function useGetBoltzSwapStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBoltzSwapStatusQuery, GetBoltzSwapStatusQueryVariables>) {
          return Apollo.useLazyQuery<GetBoltzSwapStatusQuery, GetBoltzSwapStatusQueryVariables>(GetBoltzSwapStatusDocument, baseOptions);
        }
export type GetBoltzSwapStatusQueryHookResult = ReturnType<typeof useGetBoltzSwapStatusQuery>;
export type GetBoltzSwapStatusLazyQueryHookResult = ReturnType<typeof useGetBoltzSwapStatusLazyQuery>;
export type GetBoltzSwapStatusQueryResult = Apollo.QueryResult<GetBoltzSwapStatusQuery, GetBoltzSwapStatusQueryVariables>;