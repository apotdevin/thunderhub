import { getChannels } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { GraphQLNonNull } from 'graphql';
import { getAuthLnd, getErrorMsg } from '../../../helpers/helpers';
import { ChannelReportType } from '../../../schemaTypes/query/channels/channelReport';
import { AuthType } from '../../../schemaTypes/Auth';

interface GetChannelsProps {
    channels: ChannelsProps[];
}

interface ChannelsProps {
    remote_balance: number;
    local_balance: number;
}

export const getChannelReport = {
    type: ChannelReportType,
    args: { auth: { type: new GraphQLNonNull(AuthType) } },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'channelReport');

        const lnd = getAuthLnd(params.auth);

        try {
            const channels: GetChannelsProps = await getChannels({ lnd });

            if (channels.channels.length <= 0) {
                return;
            }

            const maxOutgoing = Math.max.apply(
                Math,
                channels.channels.map(o => {
                    return o.local_balance;
                }),
            );

            const maxIncoming = Math.max.apply(
                Math,
                channels.channels.map(o => {
                    return o.remote_balance;
                }),
            );

            const consolidated = channels.channels.reduce((p, c) => {
                return {
                    remote_balance: p.remote_balance + c.remote_balance,
                    local_balance: p.local_balance + c.local_balance,
                };
            });

            return {
                local: consolidated.local_balance,
                remote: consolidated.remote_balance,
                maxIn: maxIncoming,
                maxOut: maxOutgoing,
            };
        } catch (error) {
            logger.error('Error getting channel report: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};
