import { getNetworkInfo as getLnNetworkInfo } from "ln-service";
import { logger } from "../../../helpers/logger";
import { requestLimiter } from "../../../helpers/rateLimiter";
import { NetworkInfoType } from "../../../schemaTypes/query/info/networkInfo";

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

export const getNetworkInfo = {
  type: NetworkInfoType,
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, params, "networkInfo", 1, "1s");
    const { lnd } = context;

    try {
      const info: NetworkInfoProps = await getLnNetworkInfo({
        lnd: lnd
      });

      return {
        averageChannelSize: info.average_channel_size,
        channelCount: info.channel_count,
        maxChannelSize: info.max_channel_size,
        medianChannelSize: info.median_channel_size,
        minChannelSize: info.min_channel_size,
        nodeCount: info.node_count,
        notRecentlyUpdatedPolicyCount: info.not_recently_updated_policy_count,
        totalCapacity: info.total_capacity
      };
    } catch (error) {
      logger.error("Error getting network info: %o", error);
      throw new Error("Failed to get network info.");
    }
  }
};
