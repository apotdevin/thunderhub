import { gql } from '@apollo/client';

export const GET_TAP_BALANCES = gql`
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
