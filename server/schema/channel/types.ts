import { gql } from 'apollo-server-micro';

export const channelTypes = gql`
  type policyType {
    base_fee_mtokens: String
    cltv_delta: Int
    fee_rate: Int
    is_disabled: Boolean
    max_htlc_mtokens: String
    min_htlc_mtokens: String
    public_key: String!
    updated_at: String
    my_node: Boolean
    node: Node
  }

  type singleChannelType {
    capacity: Int!
    id: String!
    policies: [policyType!]!
    transaction_id: String!
    transaction_vout: Int!
    updated_at: String
  }

  type Channel {
    channel: singleChannelType
  }

  type channelFeeType {
    alias: String
    color: String
    baseFee: Float
    feeRate: Int
    transactionId: String
    transactionVout: Int
    public_key: String
  }

  type channelReportType {
    local: Int
    remote: Int
    maxIn: Int
    maxOut: Int
  }

  type channelBalanceType {
    confirmedBalance: Int
    pendingBalance: Int
  }

  type channelType {
    capacity: Int
    commit_transaction_fee: Int
    commit_transaction_weight: Int
    id: String
    is_active: Boolean
    is_closing: Boolean
    is_opening: Boolean
    is_partner_initiated: Boolean
    is_private: Boolean
    is_static_remote_key: Boolean
    local_balance: Int
    local_reserve: Int
    partner_public_key: String
    received: Int
    remote_balance: Int
    remote_reserve: Int
    sent: Int
    time_offline: Int
    time_online: Int
    transaction_id: String
    transaction_vout: Int
    unsettled_balance: Int
    partner_node_info: nodeType
  }

  type closeChannelType {
    transactionId: String
    transactionOutputIndex: String
  }

  type closedChannelType {
    capacity: Int
    close_confirm_height: Int
    close_transaction_id: String
    final_local_balance: Int
    final_time_locked_balance: Int
    id: String
    is_breach_close: Boolean
    is_cooperative_close: Boolean
    is_funding_cancel: Boolean
    is_local_force_close: Boolean
    is_remote_force_close: Boolean
    partner_public_key: String
    transaction_id: String
    transaction_vout: Int
    partner_node_info: nodeType
  }

  type openChannelType {
    transactionId: String
    transactionOutputIndex: String
  }

  type pendingChannelType {
    close_transaction_id: String
    is_active: Boolean
    is_closing: Boolean
    is_opening: Boolean
    local_balance: Int
    local_reserve: Int
    partner_public_key: String
    received: Int
    remote_balance: Int
    remote_reserve: Int
    sent: Int
    transaction_fee: Int
    transaction_id: String
    transaction_vout: Int
    partner_node_info: nodeType
  }
`;
