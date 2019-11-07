import { GraphQLList } from "graphql";
import { getChannels } from "ln-service";
import { logger } from "../../../helpers/logger";
import { ChannelType } from "../../../schemaTypes/query/info/channels";
import { requestLimiter } from "../../../helpers/rateLimiter";

interface ChannelListProps {
  channels: ChannelProps[];
}

interface ChannelProps {
  capacity: number;
  commit_transaction_fee: number;
  commit_transaction_weight: number;
  id: string;
  is_active: boolean;
  is_closing: boolean;
  is_opening: boolean;
  is_partner_initiated: boolean;
  is_private: boolean;
  is_static_remote_key: boolean;
  local_balance: number;
  local_reserve: number;
  partner_public_key: string;
  pending_payments: [];
  received: number;
  remote_balance: number;
  remote_reserve: number;
  sent: number;
  time_offline: number;
  time_online: number;
  transaction_id: string;
  transaction_vout: number;
  unsettled_balance: number;
}

export const channels = {
  type: new GraphQLList(ChannelType),
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, params, "channels", 1, "1s");
    const { lnd } = context;

    try {
      const channelList: ChannelListProps = await getChannels({
        lnd: lnd
      });

      const channels = channelList.channels.map((channel, index) => {
        return {
          capacity: channel.capacity,
          id: channel.id,
          isActive: channel.is_active,
          isClosing: channel.is_closing,
          isOpening: channel.is_opening,
          isPartnerInitiated: channel.is_partner_initiated,
          isPrivate: channel.is_private,
          localBalance: channel.local_balance,
          localReserve: channel.local_reserve,
          partnerPublicKey: channel.partner_public_key,
          recieved: channel.received,
          remoteBalance: channel.remote_balance,
          remoteReserve: channel.remote_reserve,
          sent: channel.sent
        };
      });

      return channels;
    } catch (error) {
      logger.error("Error getting channels: %o", error);
      throw new Error("Failed to get channels.");
    }
  }
};
