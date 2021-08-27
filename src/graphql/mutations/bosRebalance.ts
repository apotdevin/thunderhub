import { gql } from '@apollo/client';

export const BOS_REBALANCE = gql`
  mutation BosRebalance(
    $avoid: [String]
    $in_through: String
    $max_fee: Int
    $max_fee_rate: Int
    $max_rebalance: Int
    $timeout_minutes: Int
    $node: String
    $out_through: String
    $out_inbound: Int
  ) {
    bosRebalance(
      avoid: $avoid
      in_through: $in_through
      max_fee: $max_fee
      max_fee_rate: $max_fee_rate
      max_rebalance: $max_rebalance
      timeout_minutes: $timeout_minutes
      node: $node
      out_through: $out_through
      out_inbound: $out_inbound
    ) {
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
