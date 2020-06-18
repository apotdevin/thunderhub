import gql from 'graphql-tag';

export const BOS_REBALANCE = gql`
  mutation BosRebalance($auth: authType!) {
    bosRebalance(auth: $auth) {
      increase {
        increased_inbound_on
        liquidity_inbound
        liquidity_inbound_opening
        liquidity_inbound_pending
        liquidity_outbound
        liquidity_outbound_opening
        liquidity_outbound_pending
      }
      decrease {
        decreased_inbound_on
        liquidity_inbound
        liquidity_inbound_opening
        liquidity_inbound_pending
        liquidity_outbound
        liquidity_outbound_opening
        liquidity_outbound_pending
      }
      result {
        rebalanced
        rebalance_fees_spent
      }
    }
  }
`;
