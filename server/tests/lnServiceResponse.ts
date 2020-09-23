export const payResponse = {
  fee: 123,
  fee_mtokens: '500000',
  hops: [
    {
      channel: 'xxx',
      channel_capacity: 123,
      fee_mtokens: '50000',
      forward_mtokens: 5000,
      timeout: 123,
    },
    {
      channel: 'xxx',
      channel_capacity: 123,
      fee_mtokens: '50000',
      forward_mtokens: 5000,
      timeout: 123,
    },
  ],
  id: 'id',
  is_confirmed: false,
  is_outgoing: false,
  mtokens: '1000',
  secret: 'secret',
  safe_fee: 1,
  safe_tokens: 1,
  tokens: 1,
};

export const decodePaymentRequestResponse = {
  chain_address: 'string',
  cltv_delta: 1000,
  description: 'string',
  description_hash: 'string',
  destination: 'string',
  expires_at: '2011-10-05T14:48:00.000Z',
  features: [
    {
      bit: 1000,
      is_known: true,
      is_required: true,
      type: 'string',
    },
  ],
  id: 'string',
  mtokens: '10000',
  payment: 'string',
  routes: [
    [
      {
        base_fee_mtokens: '10000',
        channel: 'string',
        cltv_delta: 1000,
        fee_rate: 1000,
        public_key: 'string',
      },
    ],
  ],
  safe_tokens: 1000,
  tokens: 1000,
};

export const getBackupsResponse = {
  backup: 'string',
  channels: {
    backup: 'string',
    transaction_id: 'string',
    transaction_vout: 1,
  },
};

export const getNetworkInfoResponse = {
  average_channel_size: 1000,
  channel_count: 123,
  max_channel_size: 456,
  median_channel_size: 789,
  min_channel_size: 100,
  node_count: 10000,
  not_recently_updated_policy_count: 10,
  total_capacity: 10000,
};

export const getWalletInfoResponse = {
  chains: ['abc', 'def'],
  color: 'color',
  active_channels_count: 1,
  alias: 'TestNode',
  current_block_hash: 'asd',
  current_block_height: 123456,
  is_synced_to_chain: true,
  is_synced_to_graph: true,
  latest_block_at: 'time',
  peers_count: 1,
  pending_channels_count: 2,
  public_key: 'key',
  uris: ['uri', 'uri2'],
  version: 'version',
};

export const getClosedChannelsResponse = {
  channels: [
    {
      capacity: 10000,
      close_confirm_height: 123,
      close_transaction_id: 'fghijk',
      final_local_balance: 123,
      final_time_locked_balance: 123,
      id: 'id',
      is_breach_close: false,
      is_cooperative_close: true,
      is_funding_cancel: false,
      is_local_force_close: false,
      is_remote_force_close: false,
      partner_public_key: 'abcdef',
      transaction_id: '123',
      transaction_vout: 1,
    },
    {
      capacity: 10000,
      close_confirm_height: 123,
      close_transaction_id: 'fghijk',
      final_local_balance: 123,
      final_time_locked_balance: 123,
      id: 'id',
      is_breach_close: false,
      is_cooperative_close: true,
      is_funding_cancel: false,
      is_local_force_close: false,
      is_remote_force_close: false,
      partner_public_key: 'abcdef',
      transaction_id: '123',
      transaction_vout: 1,
    },
    {
      capacity: 10000,
      close_confirm_height: 123,
      close_transaction_id: 'fghijk',
      final_local_balance: 123,
      final_time_locked_balance: 123,
      id: 'id',
      is_breach_close: false,
      is_cooperative_close: true,
      is_funding_cancel: false,
      is_local_force_close: false,
      is_remote_force_close: false,
      partner_public_key: 'abcdef',
      transaction_id: '123',
      transaction_vout: 1,
    },
  ],
};

export const getChainBalanceResponse = { chain_balance: 1000000 };

export const getPendingChainBalanceResponse = {
  pending_chain_balance: 1000000,
};

export const getChainTransactionsResponse = {
  transactions: [
    {
      block_id: 'string',
      confirmation_count: 1000,
      confirmation_height: 1000,
      created_at: '2011-10-05T14:48:00.000Z',
      description: 'string',
      fee: 1000,
      id: 'string',
      is_confirmed: true,
      is_outgoing: true,
      output_addresses: ['string', 'string'],
      tokens: 1000,
      transaction: 'string',
    },
    {
      block_id: 'string',
      confirmation_count: 1000,
      confirmation_height: 1000,
      created_at: '2011-10-05T14:48:00.000Z',
      description: 'string',
      fee: 1000,
      id: 'string',
      is_confirmed: true,
      is_outgoing: true,
      output_addresses: ['string', 'string'],
      tokens: 1000,
      transaction: 'string',
    },
  ],
};

export const getChannelsResponse = {
  channels: [
    {
      capacity: 1000,
      commit_transaction_fee: 1000,
      commit_transaction_weight: 1000,
      cooperative_close_address: 'string',
      id: '100x1x1',
      is_active: true,
      is_closing: true,
      is_opening: true,
      is_partner_initiated: false,
      is_private: true,
      is_static_remote_key: true,
      local_balance: 1000,
      local_given: 1000,
      local_reserve: 1000,
      partner_public_key: 'string',
      pending_payments: [
        {
          id: 'string',
          is_outgoing: true,
          timeout: 1000,
          tokens: 1000,
        },
      ],
      received: 1000,
      remote_balance: 1000,
      remote_given: 1000,
      remote_reserve: 1000,
      sent: 1000,
      time_offline: 1000,
      time_online: 1000,
      transaction_id: 'string',
      transaction_vout: 1000,
      unsettled_balance: 1000,
    },
    {
      capacity: 1000,
      commit_transaction_fee: 1000,
      commit_transaction_weight: 1000,
      cooperative_close_address: 'string',
      id: '100x1x1',
      is_active: true,
      is_closing: true,
      is_opening: true,
      is_partner_initiated: true,
      is_private: true,
      is_static_remote_key: true,
      local_balance: 1000,
      local_given: 1000,
      local_reserve: 1000,
      partner_public_key: 'string',
      pending_payments: [
        {
          id: 'string',
          is_outgoing: true,
          timeout: 1000,
          tokens: 1000,
        },
      ],
      received: 1000,
      remote_balance: 1000,
      remote_given: 1000,
      remote_reserve: 1000,
      sent: 1000,
      time_offline: 1000,
      time_online: 1000,
      transaction_id: 'string',
      transaction_vout: 1000,
      unsettled_balance: 1000,
    },
    {
      capacity: 1000,
      commit_transaction_fee: 1000,
      commit_transaction_weight: 1000,
      cooperative_close_address: 'string',
      id: '100x1x1',
      is_active: true,
      is_closing: true,
      is_opening: true,
      is_partner_initiated: false,
      is_private: true,
      is_static_remote_key: true,
      local_balance: 1000,
      local_given: 1000,
      local_reserve: 1000,
      partner_public_key: 'string',
      pending_payments: [
        {
          id: 'string',
          is_outgoing: true,
          timeout: 1000,
          tokens: 1000,
        },
      ],
      received: 1000,
      remote_balance: 1000,
      remote_given: 1000,
      remote_reserve: 1000,
      sent: 1000,
      time_offline: 1000,
      time_online: 1000,
      transaction_id: 'string',
      transaction_vout: 1000,
      unsettled_balance: 1000,
    },
  ],
};

export const getNodeResponse = {
  alias: 'string',
  capacity: 1000,
  channel_count: 1000,
  channels: [
    {
      capacity: 1000,
      id: '100x1x1',
      policies: [
        {
          base_fee_mtokens: '10000',
          cltv_delta: 1000,
          fee_rate: 1000,
          is_disabled: true,
          max_htlc_mtokens: '10000',
          min_htlc_mtokens: '10000',
          public_key: 'string',
          updated_at: '2011-10-05T14:48:00.000Z',
        },
      ],
      transaction_id: 'string',
      transaction_vout: 1000,
      updated_at: '2011-10-05T14:48:00.000Z',
    },
  ],
  color: 'string',
  features: [
    {
      bit: 1000,
      is_known: true,
      is_required: true,
      type: 'string',
    },
  ],
  sockets: [
    {
      socket: 'string',
      type: 'string',
    },
  ],
  updated_at: '2011-10-05T14:48:00.000Z',
};

export const probeForRouteResponse = {
  route: {
    confidence: 1000,
    fee: 1000,
    fee_mtokens: 'string',
    hops: [
      {
        channel: 'string',
        channel_capacity: 1000,
        fee: 1000,
        fee_mtokens: 'string',
        forward: 1000,
        forward_mtokens: 'string',
        public_key: 'string',
        timeout: 1000,
      },
    ],
    messages: [
      {
        type: 'string',
        value: 'string',
      },
    ],
    mtokens: 'string',
    payment: 'string',
    safe_fee: 1000,
    safe_tokens: 1000,
    timeout: 1000,
    tokens: 1000,
    total_mtokens: 'string',
  },
};

export const getChannelResponse = {
  capacity: 1000,
  id: '100x1x1',
  policies: [
    {
      base_fee_mtokens: '2000',
      cltv_delta: 1000,
      fee_rate: 1000,
      is_disabled: true,
      max_htlc_mtokens: '10000',
      min_htlc_mtokens: '10000',
      public_key: 'string',
      updated_at: '2011-10-05T14:48:00.000Z',
    },
  ],
  transaction_id: 'string',
  transaction_vout: 1000,
  updated_at: '2011-10-05T14:48:00.000Z',
};

export const getForwardsResponse = {
  forwards: [
    {
      created_at: '2011-10-05T14:48:00.000Z',
      fee: 1000,
      fee_mtokens: 'string',
      incoming_channel: '1',
      mtokens: 'string',
      outgoing_channel: '2',
      tokens: 1000,
    },
    {
      created_at: '2011-10-05T14:48:00.000Z',
      fee: 1000,
      fee_mtokens: 'string',
      incoming_channel: '12',
      mtokens: 'string',
      outgoing_channel: '22',
      tokens: 1000,
    },
    {
      created_at: '2011-10-05T14:48:00.000Z',
      fee: 1000,
      fee_mtokens: 'string',
      incoming_channel: '1',
      mtokens: 'string',
      outgoing_channel: '2',
      tokens: 1000,
    },
    {
      created_at: '2011-10-05T14:48:00.000Z',
      fee: 1000,
      fee_mtokens: 'string',
      incoming_channel: '1',
      mtokens: 'string',
      outgoing_channel: '2',
      tokens: 1000,
    },
  ],
  next: 'string',
};

export const getInvoicesResponse = {
  invoices: [
    {
      chain_address: 'string',
      confirmed_at: 'string',
      created_at: 'string',
      description: 'string',
      description_hash: 'string',
      expires_at: 'string',
      features: [
        {
          bit: 1000,
          is_known: true,
          is_required: true,
          type: 'string',
        },
      ],
      id: 'string',
      is_canceled: true,
      is_confirmed: true,
      is_held: true,
      is_private: true,
      is_push: true,
      payments: [
        {
          confirmed_at: 'string',
          created_at: 'string',
          created_height: 1000,
          in_channel: 'string',
          is_canceled: true,
          is_confirmed: true,
          is_held: true,
          messages: [
            {
              type: 'string',
              value: 'string',
            },
          ],
          mtokens: 'string',
          pending_index: 1000,
          tokens: 1000,
          total_mtokens: 'string',
        },
      ],
      received: 1000,
      received_mtokens: 'string',
      request: 'string',
      secret: 'string',
      tokens: 1000,
    },
  ],
  next: 'string',
};

export const getChannelBalance = {
  channel_balance: 1000000,
  pending_balance: 50000,
};

export const getPeersResponse = {
  peers: [
    {
      bytes_received: 1000,
      bytes_sent: 1000,
      features: [
        {
          bit: 1000,
          is_known: true,
          is_required: true,
          type: 'string',
        },
      ],
      is_inbound: true,
      is_sync_peer: true,
      ping_time: 1000,
      public_key: 'abc',
      socket: 'string',
      tokens_received: 1000,
      tokens_sent: 1000,
    },
    {
      bytes_received: 1000,
      bytes_sent: 1000,
      features: [
        {
          bit: 1000,
          is_known: true,
          is_required: true,
          type: 'string',
        },
      ],
      is_inbound: true,
      is_sync_peer: true,
      ping_time: 1000,
      public_key: 'def',
      socket: 'string',
      tokens_received: 1000,
      tokens_sent: 1000,
    },
  ],
};

export const getPendingChannelsResponse = {
  pending_channels: [
    {
      close_transaction_id: 'string',
      is_active: true,
      is_closing: true,
      is_opening: true,
      is_partner_initiated: true,
      local_balance: 1000,
      local_reserve: 1000,
      partner_public_key: 'string',
      pending_balance: 1000,
      pending_payments: [
        {
          is_incoming: true,
          timelock_height: 1000,
          tokens: 1000,
          transaction_id: 'string',
          transaction_vout: 1000,
        },
      ],
      received: 1000,
      recovered_tokens: 1000,
      remote_balance: 1000,
      remote_reserve: 1000,
      sent: 1000,
      timelock_expiration: 1000,
      transaction_fee: 1000,
      transaction_id: 'string',
      transaction_vout: 1000,
      transaction_weight: 1000,
    },
    {
      close_transaction_id: 'string',
      is_active: true,
      is_closing: true,
      is_opening: true,
      is_partner_initiated: true,
      local_balance: 1000,
      local_reserve: 1000,
      partner_public_key: 'string',
      pending_balance: 1000,
      pending_payments: [
        {
          is_incoming: true,
          timelock_height: 1000,
          tokens: 1000,
          transaction_id: 'string',
          transaction_vout: 1000,
        },
      ],
      received: 1000,
      recovered_tokens: 1000,
      remote_balance: 1000,
      remote_reserve: 1000,
      sent: 1000,
      timelock_expiration: 1000,
      transaction_fee: 1000,
      transaction_id: 'string',
      transaction_vout: 1000,
      transaction_weight: 1000,
    },
    {
      close_transaction_id: 'string',
      is_active: true,
      is_closing: true,
      is_opening: true,
      is_partner_initiated: true,
      local_balance: 1000,
      local_reserve: 1000,
      partner_public_key: 'string',
      pending_balance: 1000,
      pending_payments: [
        {
          is_incoming: true,
          timelock_height: 1000,
          tokens: 1000,
          transaction_id: 'string',
          transaction_vout: 1000,
        },
      ],
      received: 1000,
      recovered_tokens: 1000,
      remote_balance: 1000,
      remote_reserve: 1000,
      sent: 1000,
      timelock_expiration: 1000,
      transaction_fee: 1000,
      transaction_id: 'string',
      transaction_vout: 1000,
      transaction_weight: 1000,
    },
  ],
};

export const getPayments = {
  payments: [
    {
      attempts: [
        {
          failure: {
            code: 1000,
            details: {
              channel: 'string',
              height: 1000,
              index: 1000,
              mtokens: 'string',
              policy: {
                base_fee_mtokens: 'string',
                cltv_delta: 1000,
                fee_rate: 1000,
                is_disabled: true,
                max_htlc_mtokens: 'string',
                min_htlc_mtokens: 'string',
                updated_at: 'string',
              },
              timeout_height: 1000,
              update: {
                chain: 'string',
                channel_flags: 1000,
                extra_opaque_data: 'string',
                message_flags: 1000,
                signature: 'string',
              },
            },
            message: 'string',
          },
          is_confirmed: true,
          is_failed: true,
          is_pending: true,
          route: {
            fee: 1000,
            fee_mtokens: 'string',
            hops: [
              {
                channel: 'string',
                channel_capacity: 1000,
                fee: 1000,
                fee_mtokens: 'string',
                forward: 1000,
                forward_mtokens: 'string',
                public_key: 'string',
                timeout: 1000,
              },
            ],
            mtokens: 'string',
            payment: 'string',
            timeout: 1000,
            tokens: 1000,
            total_mtokens: 'string',
          },
        },
      ],
      created_at: 'string',
      destination: 'string',
      fee: 1000,
      fee_mtokens: 'string',
      hops: ['string', 'string'],
      id: 'string',
      index: 1000,
      is_confirmed: true,
      is_outgoing: true,
      mtokens: 'string',
      request: 'string',
      safe_fee: 1000,
      safe_tokens: 1000,
      secret: 'string',
      tokens: 1000,
    },
  ],
  next: 'string',
};

export const getUtxosResponse = {
  utxos: [
    {
      address: 'string',
      address_format: 'string',
      confirmation_count: 1000,
      output_script: 'string',
      tokens: 1000,
      transaction_id: 'string',
      transaction_vout: 1000,
    },
    {
      address: 'string',
      address_format: 'string',
      confirmation_count: 1000,
      output_script: 'string',
      tokens: 1000,
      transaction_id: 'string',
      transaction_vout: 1000,
    },
  ],
};

export const getWalletVersionResponse = {
  build_tags: ['string', 'string'],
  commit_hash: 'string',
  is_autopilotrpc_enabled: true,
  is_chainrpc_enabled: true,
  is_invoicesrpc_enabled: true,
  is_signrpc_enabled: true,
  is_walletrpc_enabled: true,
  is_watchtowerrpc_enabled: true,
  is_wtclientrpc_enabled: true,
  version: 'string',
};

export const signMessageResponse = {
  signature: 'signature',
};

export const verifyBackupsResponse = {
  is_valid: true,
};

export const verifyMessageResponse = {
  signed_by: 'abc',
};

export const getPublicKeyResponse = {
  public_key: 'public_key',
};
