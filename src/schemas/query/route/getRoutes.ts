import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import { getRouteToDestination, getWalletInfo } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { getAuthLnd, getErrorMsg } from '../../../helpers/helpers';
import { AuthType } from '../../../schemaTypes/Auth';

export const getRoutes = {
    type: GraphQLString,
    args: {
        auth: { type: new GraphQLNonNull(AuthType) },
        outgoing: { type: new GraphQLNonNull(GraphQLString) },
        incoming: { type: new GraphQLNonNull(GraphQLString) },
        tokens: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'getRoutes');

        const lnd = getAuthLnd(params.auth);

        const { public_key } = await getWalletInfo({ lnd });

        const { route } = await getRouteToDestination({
            lnd,
            outgoing_channel: params.outgoing,
            incoming_peer: params.incoming,
            destination: public_key,
            tokens: params.tokens,
        }).catch((error: any) => {
            logger.error('Error getting routes: %o', error);
            throw new Error(getErrorMsg(error));
        });

        if (!route) {
            throw new Error('No route found.');
        }

        return JSON.stringify(route);
    },
};
