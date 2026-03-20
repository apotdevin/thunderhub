import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;

export type GetTapBalancesQueryVariables = {
  groupBy?: string | null;
  filter?: string | null;
};

export type GetTapBalancesQuery = {
  __typename?: 'Query';
  getTapBalances: {
    __typename?: 'TapBalances';
    balances: {
      __typename?: 'TapAssetBalanceEntry';
      assetId?: string | null;
      groupKey?: string | null;
      name?: string | null;
      balance?: string | null;
    }[];
  };
};

export const GetTapBalancesDocument = gql`
  query GetTapBalances($groupBy: String, $filter: String) {
    getTapBalances(groupBy: $groupBy, filter: $filter) {
      balances {
        assetId
        groupKey
        name
        balance
      }
    }
  }
`;

export function useGetTapBalancesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetTapBalancesQuery,
    GetTapBalancesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTapBalancesQuery, GetTapBalancesQueryVariables>(
    GetTapBalancesDocument,
    options
  );
}
