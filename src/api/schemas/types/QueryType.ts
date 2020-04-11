import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
} from 'graphql';

export const ChannelBalanceType = new GraphQLObjectType({
  name: 'channelBalanceType',
  fields: () => {
    return {
      confirmedBalance: { type: GraphQLInt },
      pendingBalance: { type: GraphQLInt },
    };
  },
});

export const ChannelFeeType = new GraphQLObjectType({
  name: 'channelFeeType',
  fields: () => {
    return {
      alias: { type: GraphQLString },
      color: { type: GraphQLString },
      baseFee: { type: GraphQLInt },
      feeRate: { type: GraphQLInt },
      transactionId: { type: GraphQLString },
      transactionVout: { type: GraphQLInt },
    };
  },
});

export const ChannelReportType = new GraphQLObjectType({
  name: 'channelReportType',
  fields: () => {
    return {
      local: { type: GraphQLInt },
      remote: { type: GraphQLInt },
      maxIn: { type: GraphQLInt },
      maxOut: { type: GraphQLInt },
    };
  },
});

export const PartnerNodeType = new GraphQLObjectType({
  name: 'partnerNodeType',
  fields: () => {
    return {
      alias: { type: GraphQLString },
      capacity: { type: GraphQLString },
      channel_count: { type: GraphQLInt },
      color: { type: GraphQLString },
      updated_at: { type: GraphQLString },
    };
  },
});

export const ChannelType = new GraphQLObjectType({
  name: 'channelType',
  fields: () => {
    return {
      capacity: { type: GraphQLInt },
      commit_transaction_fee: { type: GraphQLInt },
      commit_transaction_weight: { type: GraphQLInt },
      id: { type: GraphQLString },
      is_active: { type: GraphQLBoolean },
      is_closing: { type: GraphQLBoolean },
      is_opening: { type: GraphQLBoolean },
      is_partner_initiated: { type: GraphQLBoolean },
      is_private: { type: GraphQLBoolean },
      is_static_remote_key: { type: GraphQLBoolean },
      local_balance: { type: GraphQLInt },
      local_reserve: { type: GraphQLInt },
      partner_public_key: { type: GraphQLString },
      received: { type: GraphQLInt },
      remote_balance: { type: GraphQLInt },
      remote_reserve: { type: GraphQLInt },
      sent: { type: GraphQLInt },
      time_offline: { type: GraphQLInt },
      time_online: { type: GraphQLInt },
      transaction_id: { type: GraphQLString },
      transaction_vout: { type: GraphQLInt },
      unsettled_balance: { type: GraphQLInt },
      partner_node_info: { type: PartnerNodeType },
    };
  },
});

export const ClosedChannelType = new GraphQLObjectType({
  name: 'closedChannelType',
  fields: () => {
    return {
      capacity: { type: GraphQLInt },
      close_confirm_height: { type: GraphQLInt },
      close_transaction_id: { type: GraphQLString },
      final_local_balance: { type: GraphQLInt },
      final_time_locked_balance: { type: GraphQLInt },
      id: { type: GraphQLString },
      is_breach_close: { type: GraphQLBoolean },
      is_cooperative_close: { type: GraphQLBoolean },
      is_funding_cancel: { type: GraphQLBoolean },
      is_local_force_close: { type: GraphQLBoolean },
      is_remote_force_close: { type: GraphQLBoolean },
      partner_public_key: { type: GraphQLString },
      transaction_id: { type: GraphQLString },
      transaction_vout: { type: GraphQLInt },
      partner_node_info: { type: PartnerNodeType },
    };
  },
});

export const PendingChannelType = new GraphQLObjectType({
  name: 'pendingChannelType',
  fields: () => {
    return {
      close_transaction_id: { type: GraphQLString },
      is_active: { type: GraphQLBoolean },
      is_closing: { type: GraphQLBoolean },
      is_opening: { type: GraphQLBoolean },
      local_balance: { type: GraphQLInt },
      local_reserve: { type: GraphQLInt },
      partner_public_key: { type: GraphQLString },
      received: { type: GraphQLInt },
      remote_balance: { type: GraphQLInt },
      remote_reserve: { type: GraphQLInt },
      sent: { type: GraphQLInt },
      transaction_fee: { type: GraphQLInt },
      transaction_id: { type: GraphQLString },
      transaction_vout: { type: GraphQLInt },
      partner_node_info: { type: PartnerNodeType },
    };
  },
});

export const PeerType = new GraphQLObjectType({
  name: 'peerType',
  fields: () => {
    return {
      bytes_received: { type: GraphQLInt },
      bytes_sent: { type: GraphQLInt },
      is_inbound: { type: GraphQLBoolean },
      is_sync_peer: { type: GraphQLBoolean },
      ping_time: { type: GraphQLInt },
      public_key: { type: GraphQLString },
      socket: { type: GraphQLString },
      tokens_received: { type: GraphQLInt },
      tokens_sent: { type: GraphQLInt },
      partner_node_info: { type: PartnerNodeType },
    };
  },
});

export const BitcoinFeeType = new GraphQLObjectType({
  name: 'bitcoinFeeType',
  fields: () => {
    return {
      fast: { type: GraphQLInt },
      halfHour: { type: GraphQLInt },
      hour: { type: GraphQLInt },
    };
  },
});

export const InOutType = new GraphQLObjectType({
  name: 'InOutType',
  fields: () => {
    return {
      invoices: { type: GraphQLString },
      payments: { type: GraphQLString },
      confirmedInvoices: { type: GraphQLInt },
      unConfirmedInvoices: { type: GraphQLInt },
    };
  },
});

export const NetworkInfoType = new GraphQLObjectType({
  name: 'networkInfoType',
  fields: () => {
    return {
      averageChannelSize: { type: GraphQLString },
      channelCount: { type: GraphQLInt },
      maxChannelSize: { type: GraphQLString },
      medianChannelSize: { type: GraphQLString },
      minChannelSize: { type: GraphQLInt },
      nodeCount: { type: GraphQLInt },
      notRecentlyUpdatedPolicyCount: { type: GraphQLInt },
      totalCapacity: { type: GraphQLString },
    };
  },
});

export const NodeInfoType = new GraphQLObjectType({
  name: 'nodeInfoType',
  fields: () => {
    return {
      chains: { type: new GraphQLList(GraphQLString) },
      color: { type: GraphQLString },
      active_channels_count: { type: GraphQLInt },
      closed_channels_count: { type: GraphQLInt },
      alias: { type: GraphQLString },
      current_block_hash: { type: GraphQLString },
      current_block_height: { type: GraphQLBoolean },
      is_synced_to_chain: { type: GraphQLBoolean },
      is_synced_to_graph: { type: GraphQLBoolean },
      latest_block_at: { type: GraphQLString },
      peers_count: { type: GraphQLInt },
      pending_channels_count: { type: GraphQLInt },
      public_key: { type: GraphQLString },
      uris: { type: new GraphQLList(GraphQLString) },
      version: { type: GraphQLString },
    };
  },
});

export const GetChainTransactionsType = new GraphQLObjectType({
  name: 'getTransactionsType',
  fields: () => ({
    block_id: { type: GraphQLString },
    confirmation_count: { type: GraphQLInt },
    confirmation_height: { type: GraphQLInt },
    created_at: { type: GraphQLString },
    fee: { type: GraphQLInt },
    id: { type: GraphQLString },
    output_addresses: { type: new GraphQLList(GraphQLString) },
    tokens: { type: GraphQLInt },
  }),
});

export const ForwardType = new GraphQLObjectType({
  name: 'forwardType',
  fields: () => ({
    created_at: { type: GraphQLString },
    fee: { type: GraphQLInt },
    fee_mtokens: { type: GraphQLString },
    incoming_channel: { type: GraphQLString },
    incoming_alias: { type: GraphQLString },
    incoming_color: { type: GraphQLString },
    mtokens: { type: GraphQLString },
    outgoing_channel: { type: GraphQLString },
    outgoing_alias: { type: GraphQLString },
    outgoing_color: { type: GraphQLString },
    tokens: { type: GraphQLInt },
  }),
});

export const GetForwardType = new GraphQLObjectType({
  name: 'getForwardType',
  fields: () => ({
    token: { type: GraphQLString },
    forwards: { type: new GraphQLList(ForwardType) },
  }),
});

export const GetResumeType = new GraphQLObjectType({
  name: 'getResumeType',
  fields: () => ({
    token: { type: GraphQLString },
    resume: { type: GraphQLString },
  }),
});
