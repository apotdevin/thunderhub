import { gql } from '@apollo/client';

export const GET_TAP_BALANCES = gql`
  query GetTapBalances($groupBy: TapBalanceGroupBy) {
    getTapBalances(groupBy: $groupBy) {
      balances {
        assetId
        groupKey
        name
        balance
      }
    }
  }
`;
