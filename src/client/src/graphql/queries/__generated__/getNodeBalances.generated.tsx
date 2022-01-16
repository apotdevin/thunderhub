import * as Types from '../../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetNodeBalancesQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetNodeBalancesQuery = {
  __typename?: 'Query';
  getNodeBalances: {
    __typename?: 'Balances';
    onchain: {
      __typename?: 'OnChainBalance';
      confirmed: string;
      pending: string;
      closing: string;
    };
    lightning: {
      __typename?: 'LightningBalance';
      confirmed: string;
      active: string;
      commit: string;
      pending: string;
    };
  };
};

export const GetNodeBalancesDocument = gql`
  query GetNodeBalances {
    getNodeBalances {
      onchain {
        confirmed
        pending
        closing
      }
      lightning {
        confirmed
        active
        commit
        pending
      }
    }
  }
`;

/**
 * __useGetNodeBalancesQuery__
 *
 * To run a query within a React component, call `useGetNodeBalancesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNodeBalancesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNodeBalancesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetNodeBalancesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetNodeBalancesQuery,
    GetNodeBalancesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetNodeBalancesQuery, GetNodeBalancesQueryVariables>(
    GetNodeBalancesDocument,
    options
  );
}
export function useGetNodeBalancesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetNodeBalancesQuery,
    GetNodeBalancesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetNodeBalancesQuery,
    GetNodeBalancesQueryVariables
  >(GetNodeBalancesDocument, options);
}
export type GetNodeBalancesQueryHookResult = ReturnType<
  typeof useGetNodeBalancesQuery
>;
export type GetNodeBalancesLazyQueryHookResult = ReturnType<
  typeof useGetNodeBalancesLazyQuery
>;
export type GetNodeBalancesQueryResult = Apollo.QueryResult<
  GetNodeBalancesQuery,
  GetNodeBalancesQueryVariables
>;
