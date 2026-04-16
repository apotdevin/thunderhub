import { gql } from '@apollo/client';

export const GET_TAP_BALANCES = gql`
  query GetTapBalances($group_by: TapBalanceGroupBy) {
    taproot_assets {
      id
      get_balances(group_by: $group_by) {
        balances {
          asset_id
          group_key
          names
          balance
        }
      }
    }
  }
`;
