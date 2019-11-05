import { getChannelBalance } from "ln-service";
import { logger } from "../../../helpers/logger";
import { ChannelBalanceType } from "../../../schemaTypes/query/info/channelBalance";
import { requestLimiter } from "../../../helpers/rateLimiter";

interface ChannelBalanceProps {
  channel_balance: number;
  pending_balance: number;
}

export const channelBalance = {
  type: ChannelBalanceType,
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, params, "channelBalance", 1, "1s");
    const { lnd } = context;

    try {
      const channelBalance: ChannelBalanceProps = await getChannelBalance({
        lnd: lnd
      });
      return {
        confirmedBalance: channelBalance.channel_balance,
        pendingBalance: channelBalance.pending_balance
      };
    } catch (error) {
      logger.error("Error getting channel balance: %o", error);
      throw new Error("Failed to get channel balance.");
    }
  }
};
