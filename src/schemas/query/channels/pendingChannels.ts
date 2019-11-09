import { getPendingChannels as getLnPendingChannels } from "ln-service";
import { logger } from "../../../helpers/logger";
import { PendingChannelType } from "../../../schemaTypes/query/info/pendingChannels";
import { GraphQLList } from "graphql";
import { requestLimiter } from "../../../helpers/rateLimiter";

interface PendingChannelListProps {
  pending_channels: PendingChannelProps[];
}

interface PendingChannelProps {
  close_transaction_id: string;
  is_active: boolean;
  is_closing: boolean;
  is_opening: boolean;
  local_balance: number;
  local_reserve: number;
  partner_public_key: string;
  received: number;
  remote_balance: number;
  remote_reserve: number;
  sent: number;
}

export const getPendingChannels = {
  type: new GraphQLList(PendingChannelType),
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, params, "pendingChannels", 1, "1s");
    const { lnd } = context;

    try {
      const pendingChannels: PendingChannelListProps = await getLnPendingChannels(
        {
          lnd: lnd
        }
      );

      const channels = pendingChannels.pending_channels.map(channel => {
        return {
          closeTransactionId: channel.close_transaction_id,
          isActive: channel.is_active,
          isClosing: channel.is_closing,
          isOpening: channel.is_opening,
          localBalance: channel.local_balance,
          localReserve: channel.local_reserve,
          partnerPublicKey: channel.partner_public_key,
          received: channel.received,
          remoteBalance: channel.remote_balance,
          remoteReserve: channel.remote_reserve,
          sent: channel.sent
        };
      });
      return channels;
    } catch (error) {
      logger.error("Error getting pending channels: %o", error);
      throw new Error("Failed to get pending channels.");
    }
  }
};
