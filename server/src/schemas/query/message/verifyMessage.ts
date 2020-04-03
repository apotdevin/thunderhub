import { verifyMessage as verifyLnMessage } from 'ln-service';
import { GraphQLString, GraphQLNonNull } from 'graphql';
import { defaultParams } from '../../../helpers/defaultProps';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { getAuthLnd, getErrorMsg } from '../../../helpers/helpers';
import { logger } from '../../../helpers/logger';

export const verifyMessage = {
    type: GraphQLString,
    args: {
        ...defaultParams,
        message: { type: new GraphQLNonNull(GraphQLString) },
        signature: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'verifyMessage');

        const lnd = getAuthLnd(params.auth);

        try {
            const message: { signed_by: string } = await verifyLnMessage({
                lnd,
                message: params.message,
                signature: params.signature,
            });

            return message.signed_by;
        } catch (error) {
            params.logger && logger.error('Error verifying message: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};
