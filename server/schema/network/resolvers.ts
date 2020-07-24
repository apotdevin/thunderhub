import { getNetworkInfo } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { getLnd } from 'server/helpers/helpers';
import { to } from 'server/helpers/async';

interface NetworkInfoProps {
  average_channel_size: number;
  channel_count: number;
  max_channel_size: number;
  median_channel_size: number;
  min_channel_size: number;
  node_count: number;
  not_recently_updated_policy_count: number;
  total_capacity: number;
}

export const networkResolvers = {
  Query: {
    getNetworkInfo: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'networkInfo');

      const { lnd } = context;

      const info: NetworkInfoProps = await to(getNetworkInfo({ lnd }));

      return {
        averageChannelSize: info.average_channel_size,
        channelCount: info.channel_count,
        maxChannelSize: info.max_channel_size,
        medianChannelSize: info.median_channel_size,
        minChannelSize: info.min_channel_size,
        nodeCount: info.node_count,
        notRecentlyUpdatedPolicyCount: info.not_recently_updated_policy_count,
        totalCapacity: info.total_capacity,
      };
    },
  },
};
