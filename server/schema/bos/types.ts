import { gql } from 'apollo-server-micro';

export const bosTypes = gql`
  type bosIncreaseType {
    increased_inbound_on: String
    liquidity_inbound: String
    liquidity_inbound_opening: String
    liquidity_inbound_pending: String
    liquidity_outbound: String
    liquidity_outbound_opening: String
    liquidity_outbound_pending: String
  }
  type bosDecreaseType {
    decreased_inbound_on: String
    liquidity_inbound: String
    liquidity_inbound_opening: String
    liquidity_inbound_pending: String
    liquidity_outbound: String
    liquidity_outbound_opening: String
    liquidity_outbound_pending: String
  }

  type bosResultType {
    rebalanced: String
    rebalance_fees_spent: String
  }

  type bosRebalanceResultType {
    increase: bosIncreaseType
    decrease: bosDecreaseType
    result: bosResultType
  }
`;
