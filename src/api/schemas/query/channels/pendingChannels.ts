import {
  getPendingChannels as getLnPendingChannels,
  getNode,
} from 'ln-service';
import { logger } from '../../../helpers/logger';
import { GraphQLList } from 'graphql';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { getAuthLnd, getErrorMsg } from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';
import { PendingChannelType } from '../../types/QueryType';

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

export const getPendingChannels = {
  type: new GraphQLList(PendingChannelType),
  args: defaultParams,
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, 'pendingChannels');

    const lnd = getAuthLnd(params.auth);

    try {
      const pendingChannels: PendingChannelListProps = await getLnPendingChannels(
        {
          lnd,
        }
      );

      const channels = pendingChannels.pending_channels.map(async channel => {
        const nodeInfo = await getNode({
          lnd,
          is_omitting_channels: true,
          public_key: channel.partner_public_key,
        });

        return {
          ...channel,
          partner_node_info: {
            ...nodeInfo,
          },
        };
      });
      return channels;
    } catch (error) {
      params.logger &&
        logger.error('Error getting pending channels: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
