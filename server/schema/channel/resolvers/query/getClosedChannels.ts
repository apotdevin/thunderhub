import { getClosedChannels as getLnClosedChannels, getNode } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { to, toWithError } from 'server/helpers/async';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { getAuthLnd, getCorrectAuth } from 'server/helpers/helpers';

interface ChannelListProps {
  channels: ChannelProps[];
}

interface ChannelProps {
  capacity: number;
  close_confirm_height: number;
  close_transaction_id: string;
  final_local_balance: number;
  final_time_locked_balance: number;
  id: string;
  is_breach_close: boolean;
  is_cooperative_close: boolean;
  is_funding_cancel: boolean;
  is_local_force_close: boolean;
  is_remote_force_close: boolean;
  partner_public_key: string;
  transaction_id: string;
  transaction_vout: number;
}

export const getClosedChannels = async (
  _: undefined,
  params: any,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'closedChannels');

  const auth = getCorrectAuth(params.auth, context);
  const lnd = getAuthLnd(auth);

  const closedChannels: ChannelListProps = await to(
    getLnClosedChannels({ lnd })
  );

  const channels = closedChannels.channels.map(async channel => {
    const [nodeInfo, nodeError] = await toWithError(
      getNode({
        lnd,
        is_omitting_channels: true,
        public_key: channel.partner_public_key,
      })
    );

    nodeError &&
      logger.debug(
        `Error getting node with public key ${channel.partner_public_key}: %o`,
        nodeError
      );

    return {
      ...channel,
      partner_node_info: {
        ...(!nodeError && nodeInfo),
      },
    };
  });
  return channels;
};
