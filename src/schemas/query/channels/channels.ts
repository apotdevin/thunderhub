import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { getChannels as getLnChannels, getNode } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { ChannelType } from '../../../schemaTypes/query/info/channels';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { getAuthLnd, getErrorMsg } from '../../../helpers/helpers';

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

export const getChannels = {
    type: new GraphQLList(ChannelType),
    args: { auth: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'channels');

        const lnd = getAuthLnd(params.auth);

        try {
            const channelList: ChannelListProps = await getLnChannels({
                lnd,
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
                            capacity: channel.capacity,
                            commitTransactionFee:
                                channel.commit_transaction_fee,
                            commitTransactionWeight:
                                channel.commit_transaction_weight,
                            id: channel.id,
                            isActive: channel.is_active,
                            isClosing: channel.is_closing,
                            isOpening: channel.is_opening,
                            isPartnerInitiated: !channel.is_partner_initiated,
                            isPrivate: channel.is_private,
                            isStaticRemoteKey: channel.is_static_remote_key,
                            localBalance: channel.local_balance,
                            localReserve: channel.local_reserve,
                            partnerPublicKey: channel.partner_public_key,
                            received: channel.received,
                            remoteBalance: channel.remote_balance,
                            remoteReserve: channel.remote_reserve,
                            sent: channel.sent,
                            timeOffline: channel.time_offline,
                            timeOnline: channel.time_online,
                            transactionId: channel.transaction_id,
                            transactionVout: channel.transaction_vout,
                            unsettledBalance: channel.unsettled_balance,
                            partnerNodeInfo: {
                                alias: nodeInfo.alias,
                                capacity: nodeInfo.capacity,
                                channelCount: nodeInfo.channel_count,
                                color: nodeInfo.color,
                                lastUpdate: nodeInfo.updated_at,
                            },
                        };
                    }),
                );

            const channels = await getChannelList();
            return channels;
        } catch (error) {
            logger.error('Error getting channels: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};
