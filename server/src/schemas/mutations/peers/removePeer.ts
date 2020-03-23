import { removePeer as removeLnPeer } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { GraphQLBoolean, GraphQLString, GraphQLNonNull } from 'graphql';
import { getErrorMsg, getAuthLnd } from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';

export const removePeer = {
    type: GraphQLBoolean,
    args: {
        ...defaultParams,
        publicKey: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'removePeer');

        const lnd = getAuthLnd(params.auth);

        try {
            const success: boolean = await removeLnPeer({
                lnd,
                public_key: params.publicKey,
            });
            return success;
        } catch (error) {
            params.logger && logger.error('Error removing peer: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};
