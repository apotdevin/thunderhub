import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  type channelBalanceType {
    confirmedBalance: Int
    pendingBalance: Int
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

  # A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the
  # date-time format outlined in section 5.6 of the RFC 3339 profile of the ISO
  # 8601 standard for representation of dates and times using the Gregorian calendar.
  scalar DateTime

  type DecodeRoutesType {
    base_fee_mtokens: String
    channel: String
    cltv_delta: Int
    fee_rate: Int
    public_key: String
  }

  type forwardType {
    created_at: String
    fee: Int
    fee_mtokens: String
    incoming_channel: String
    incoming_alias: String
    incoming_color: String
    mtokens: String
    outgoing_channel: String
    outgoing_alias: String
    outgoing_color: String
    tokens: Int
  }

  type getForwardType {
    token: String
    forwards: [forwardType]
  }

  type getResumeType {
    token: String
    resume: String
  }

  type getTransactionsType {
    block_id: String
    confirmation_count: Int
    confirmation_height: Int
    created_at: String
    fee: Int
    id: String
    output_addresses: [String]
    tokens: Int
  }

  type hopsType {
    channel: String
    channel_capacity: Int
    fee_mtokens: String
    forward_mtokens: String
    timeout: Int
  }

  type invoiceType {
    chainAddress: String
    createdAt: DateTime
    description: String
    id: String
    request: String
    secret: String
    tokens: Int
  }

  type networkInfoType {
    averageChannelSize: String
    channelCount: Int
    maxChannelSize: Int
    medianChannelSize: Int
    minChannelSize: Int
    nodeCount: Int
    notRecentlyUpdatedPolicyCount: Int
    totalCapacity: String
  }

  type openChannelType {
    transactionId: String
    transactionOutputIndex: String
  }

  type parsePaymentType {
    chainAddresses: [String]
    cltvDelta: Int
    createdAt: DateTime
    description: String
    descriptionHash: String
    destination: String
    expiresAt: DateTime
    id: String
    isExpired: Boolean
    mTokens: String
    network: String
    routes: [PaymentRouteType]
    tokens: Int
  }

  type PaymentRouteType {
    mTokenFee: String
    channel: String
    cltvDelta: Int
    feeRate: Int
    publicKey: String
  }

  type payType {
    fee: Int
    fee_mtokens: String
    hops: [hopsType]
    id: String
    is_confirmed: Boolean
    is_outgoing: Boolean
    mtokens: String
    secret: String
    safe_fee: Int
    safe_tokens: Int
    tokens: Int
  }

  type peerType {
    bytes_received: Int
    bytes_sent: Int
    is_inbound: Boolean
    is_sync_peer: Boolean
    ping_time: Int
    public_key: String
    socket: String
    tokens_received: Int
    tokens_sent: Int
    partner_node_info: nodeType
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

  type walletInfoType {
    build_tags: [String]
    commit_hash: String
    is_autopilotrpc_enabled: Boolean
    is_chainrpc_enabled: Boolean
    is_invoicesrpc_enabled: Boolean
    is_signrpc_enabled: Boolean
    is_walletrpc_enabled: Boolean
    is_watchtowerrpc_enabled: Boolean
    is_wtclientrpc_enabled: Boolean
  }
`;
