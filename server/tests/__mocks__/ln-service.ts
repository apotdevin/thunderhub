export const getNetworkInfo = () =>
  Promise.resolve({
    average_channel_size: 1000,
    channel_count: 123,
    max_channel_size: 456,
    median_channel_size: 789,
    min_channel_size: 100,
    node_count: 10000,
    not_recently_updated_policy_count: 10,
    total_capacity: 10000,
  });

export const getWalletInfo = () =>
  Promise.resolve({
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
  });

export const getClosedChannels = () =>
  Promise.resolve({
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
  });

export const getChainBalance = () =>
  Promise.resolve({ chain_balance: 1000000 });

export const getPendingChainBalance = () =>
  Promise.resolve({ pending_chain_balance: 1000000 });

export const authenticatedLndGrpc = jest.fn().mockReturnValue({});
