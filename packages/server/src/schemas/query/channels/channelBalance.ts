import { getChannelBalance as getLnChannelBalance } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { getAuthLnd, getErrorMsg } from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';
import { ChannelBalanceType } from '../../types/QueryType';

interface ChannelBalanceProps {
    channel_balance: number;
    pending_balance: number;
}

export const getChannelBalance = {
    type: ChannelBalanceType,
    args: defaultParams,
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
            params.logger &&
                logger.error('Error getting channel balance: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};
