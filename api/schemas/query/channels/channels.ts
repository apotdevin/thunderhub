import { GraphQLList, GraphQLBoolean } from 'graphql';
import { getChannels as getLnChannels, getNode } from 'ln-service';
import { ContextType } from 'api/types/apiTypes';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';
import { ChannelType } from '../../types/QueryType';

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
  time_offline: any;
  time_online: any;
  transaction_id: string;
  transaction_vout: number;
  unsettled_balance: number;
}

export const getChannels = {
  type: new GraphQLList(ChannelType),
  args: {
    ...defaultParams,
    active: { type: GraphQLBoolean },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'channels');

    const auth = getCorrectAuth(params.auth, context);
    const lnd = getAuthLnd(auth);

    try {
      const channelList: ChannelListProps = await getLnChannels({
        lnd,
        is_active: params.active,
      });

      const getChannelList = () =>
        Promise.all(
          channelList.channels.map(async channel => {
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
          })
        );

      const channels = await getChannelList();
      return channels;
    } catch (error) {
      logger.error('Error getting channels: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
