import { gql } from '@apollo/client';

export const BOS_REBALANCE = gql`
  mutation BosRebalance(
    $avoid: [String]
    $in_through: String
    $is_avoiding_high_inbound: Boolean
    $max_fee: Int
    $max_fee_rate: Int
    $max_rebalance: Int
    $node: String
    $out_channels: [String]
    $out_through: String
    $target: Int
  ) {
    bosRebalance(
      avoid: $avoid
      in_through: $in_through
      is_avoiding_high_inbound: $is_avoiding_high_inbound
      max_fee: $max_fee
      max_fee_rate: $max_fee_rate
      max_rebalance: $max_rebalance
      node: $node
      out_channels: $out_channels
      out_through: $out_through
      target: $target
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
