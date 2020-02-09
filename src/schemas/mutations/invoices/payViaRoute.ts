import { GraphQLNonNull, GraphQLBoolean, GraphQLString } from 'graphql';
import { payViaRoutes, createInvoice } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { getAuthLnd, getErrorMsg } from '../../../helpers/helpers';
import { AuthType } from '../../../schemaTypes/Auth';

export const payViaRoute = {
    type: GraphQLBoolean,
    args: {
        auth: { type: new GraphQLNonNull(AuthType) },
        route: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'payViaRoute');

        const lnd = getAuthLnd(params.auth);

        let route;
        try {
            route = JSON.parse(params.route);
        } catch (error) {
            logger.error('Corrupt route json: %o', error);
            throw new Error('Corrupt Route JSON');
        }

        const { id } = await createInvoice({
            lnd,
            tokens: params.tokens,
            description: 'Balancing Channel',
        }).catch((error: any) => {
            logger.error('Error getting invoice: %o', error);
            throw new Error(getErrorMsg(error));
        });

        await payViaRoutes({ lnd, routes: [route], id }).catch((error: any) => {
            logger.error('Error making payment: %o', error);
            throw new Error(getErrorMsg(error));
        });

        return true;
    },
};
