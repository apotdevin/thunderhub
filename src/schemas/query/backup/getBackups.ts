import { getBackups as getLnBackups } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { getAuthLnd, getErrorMsg } from '../../../helpers/helpers';

export const getBackups = {
    type: GraphQLString,
    args: { auth: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'getBackups');

        const lnd = getAuthLnd(params.auth);

        try {
            const backups = await getLnBackups({
                lnd: lnd,
            });
            return JSON.stringify(backups);
        } catch (error) {
            logger.error('Error getting backups: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};
