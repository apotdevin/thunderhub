import {
    getPendingChannels as getLnPendingChannels,
    getNode,
} from 'ln-service';
import { logger } from '../../../helpers/logger';
import { PendingChannelType } from '../../../schemaTypes/query/info/pendingChannels';
import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { getAuthLnd, getErrorMsg } from '../../../helpers/helpers';

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
    args: { auth: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'pendingChannels');

        const lnd = getAuthLnd(params.auth);

        try {
            const pendingChannels: PendingChannelListProps = await getLnPendingChannels(
                {
                    lnd,
                },
            );

            const channels = pendingChannels.pending_channels.map(
                async channel => {
                    const nodeInfo = await getNode({
                        lnd,
                        is_omitting_channels: true,
                        public_key: channel.partner_public_key,
                    });

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
                        sent: channel.sent,
                        transactionFee: channel.transaction_fee,
                        transactionId: channel.transaction_id,
                        transactionVout: channel.transaction_vout,
                        partnerNodeInfo: {
                            alias: nodeInfo.alias,
                            capacity: nodeInfo.capacity,
                            channelCount: nodeInfo.channel_count,
                            color: nodeInfo.color,
                            lastUpdate: nodeInfo.updated_at,
                        },
                    };
                },
            );
            return channels;
        } catch (error) {
            logger.error('Error getting pending channels: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};
