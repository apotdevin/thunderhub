import { getChannelBalance as getLnChannelBalance } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { ChannelBalanceType } from '../../../schemaTypes/query/channels/channelBalance';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { GraphQLNonNull } from 'graphql';
import { getAuthLnd, getErrorMsg } from '../../../helpers/helpers';
import { AuthType } from '../../../schemaTypes/Auth';

interface ChannelBalanceProps {
    channel_balance: number;
    pending_balance: number;
}

export const getChannelBalance = {
    type: ChannelBalanceType,
    args: { auth: { type: new GraphQLNonNull(AuthType) } },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'channelBalance');

        const lnd = getAuthLnd(params.auth);

        try {
            const channelBalance: ChannelBalanceProps = await getLnChannelBalance(
                {
                    lnd,
                },
            );
            return {
                confirmedBalance: channelBalance.channel_balance,
                pendingBalance: channelBalance.pending_balance,
            };
        } catch (error) {
            logger.error('Error getting channel balance: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};
