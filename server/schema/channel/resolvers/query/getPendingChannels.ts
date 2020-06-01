import {
  getPendingChannels as getLnPendingChannels,
  getNode,
} from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { to, toWithError } from 'server/helpers/async';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { getAuthLnd, getCorrectAuth } from 'server/helpers/helpers';

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
  transaction_fee: number;
  transaction_id: string;
  transaction_vout: number;
}

export const getPendingChannels = async (
  _: undefined,
  params: any,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'pendingChannels');

  const auth = getCorrectAuth(params.auth, context);
  const lnd = getAuthLnd(auth);

  const pendingChannels: PendingChannelListProps = await to(
    getLnPendingChannels({ lnd })
  );

  const channels = pendingChannels.pending_channels.map(async channel => {
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
