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

export const authenticatedLndGrpc = jest.fn().mockReturnValue({});
