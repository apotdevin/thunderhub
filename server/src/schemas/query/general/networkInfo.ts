import { getNetworkInfo as getLnNetworkInfo } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { getAuthLnd, getErrorMsg } from '../../../helpers/helpers';

import { defaultParams } from '../../../helpers/defaultProps';
import { NetworkInfoType } from '../../types/QueryType';

interface NetworkInfoProps {
    average_channel_size: number;
    channel_count: number;
    max_channel_size: number;
    median_channel_size: number;
    min_channel_size: number;
    node_count: number;
    not_recently_updated_policy_count: number;
    total_capacity: number;
}

export const getNetworkInfo = {
    type: NetworkInfoType,
    args: defaultParams,
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'networkInfo');

        const lnd = getAuthLnd(params.auth);

        try {
            const info: NetworkInfoProps = await getLnNetworkInfo({ lnd });

            return {
                averageChannelSize: info.average_channel_size,
                channelCount: info.channel_count,
                maxChannelSize: info.max_channel_size,
                medianChannelSize: info.median_channel_size,
                minChannelSize: info.min_channel_size,
                nodeCount: info.node_count,
                notRecentlyUpdatedPolicyCount:
                    info.not_recently_updated_policy_count,
                totalCapacity: info.total_capacity,
            };
        } catch (error) {
            params.logger &&
                logger.error('Error getting network info: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};
