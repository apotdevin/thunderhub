import { signMessage as signLnMessage } from 'ln-service';
import { GraphQLString, GraphQLNonNull } from 'graphql';
import { defaultParams } from '../../../helpers/defaultProps';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { getAuthLnd, getErrorMsg } from '../../../helpers/helpers';
import { logger } from '../../../helpers/logger';

export const signMessage = {
    type: GraphQLString,
    args: {
        ...defaultParams,
        message: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'signMessage');

        const lnd = getAuthLnd(params.auth);

        try {
            const message: { signature: string } = await signLnMessage({
                lnd,
                message: params.message,
            });

            return message.signature;
        } catch (error) {
            params.logger && logger.error('Error signing message: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};
