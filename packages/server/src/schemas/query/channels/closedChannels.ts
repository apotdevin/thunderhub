import { GraphQLList, GraphQLString } from 'graphql';
import { getClosedChannels as getLnClosedChannels, getNode } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { getErrorMsg, getAuthLnd } from '../../../helpers/helpers';

import { defaultParams } from '../../../helpers/defaultProps';
import { ClosedChannelType } from '../../types/QueryType';

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

export const getClosedChannels = {
    type: new GraphQLList(ClosedChannelType),
    args: {
        ...defaultParams,
        type: { type: GraphQLString },
    },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'closedChannels');

        const lnd = getAuthLnd(params.auth);

        try {
            const closedChannels: ChannelListProps = await getLnClosedChannels({
                lnd,
            });
            const channels = closedChannels.channels.map(async (channel) => {
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
                logger.error('Error getting closed channels: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};
