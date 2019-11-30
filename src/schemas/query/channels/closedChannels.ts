import { GraphQLList, GraphQLString, GraphQLNonNull } from 'graphql';
import { getClosedChannels as getLnClosedChannels } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { ClosedChannelType } from '../../../schemaTypes/query/info/closedChannels';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { getErrorMsg, getAuthLnd } from '../../../helpers/helpers';

const BREACH = 'BREACH';
const COOPERATIVE = 'COOPERATIVE';
const FUNDING = 'FUNDING';
const LOCAL = 'LOCAL';
const REMOTE = 'REMOTE';
const UNKNOWN = 'UNKNOWN';

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

const getCloseReason = (
    breach: boolean,
    cooperative: boolean,
    funding: boolean,
    local: boolean,
    remote: boolean,
): string => {
    return breach
        ? BREACH
        : cooperative
        ? COOPERATIVE
        : funding
        ? FUNDING
        : local
        ? LOCAL
        : remote
        ? REMOTE
        : UNKNOWN;
};

export const getClosedChannels = {
    type: new GraphQLList(ClosedChannelType),
    args: {
        type: { type: GraphQLString },
        auth: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, params, 'closedChannels', 1, '1s');
        const lnd = getAuthLnd(params.auth);

        try {
            const closedChannels: ChannelListProps = await getLnClosedChannels({
                lnd: lnd,
            });

            const channels = closedChannels.channels.map(channel => {
                const closeReason = getCloseReason(
                    channel.is_breach_close,
                    channel.is_cooperative_close,
                    channel.is_funding_cancel,
                    channel.is_local_force_close,
                    channel.is_remote_force_close,
                );

                return {
                    capacity: channel.capacity,
                    closeConfirmHeight: channel.close_confirm_height,
                    closeTransactionId: channel.close_transaction_id,
                    finalLocalBalance: channel.final_local_balance,
                    finalTimeLockedBalance: channel.final_time_locked_balance,
                    id: channel.id,
                    closeReason: closeReason,
                    partnerPublicKey: channel.partner_public_key,
                    transactionId: channel.transaction_id,
                    transactionVout: channel.transaction_vout,
                };
            });
            return channels;
        } catch (error) {
            logger.error('Error getting closed channels: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};
