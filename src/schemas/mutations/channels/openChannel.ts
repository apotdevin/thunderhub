import { openChannel as lnOpenChannel } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
    GraphQLBoolean,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
} from 'graphql';
import { OpenChannelType } from '../../../schemaTypes/mutation.ts/channels/openChannel';
import { getErrorMsg, getAuthLnd } from '../../../helpers/helpers';

interface OpenChannelProps {
    transaction_id: string;
    transaction_vout: string;
}

export const openChannel = {
    type: OpenChannelType,
    args: {
        isPrivate: { type: GraphQLBoolean },
        amount: { type: new GraphQLNonNull(GraphQLInt) },
        partnerPublicKey: { type: new GraphQLNonNull(GraphQLString) },
        auth: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, params, 'openChannel', 1, '1s');
        const lnd = getAuthLnd(params.auth);

        try {
            const info: OpenChannelProps = await lnOpenChannel({
                lnd: lnd,
                is_private: params.isPrivate,
                local_tokens: params.amount,
                partner_public_key: params.partnerPublicKey,
            });
            return {
                transactionId: info.transaction_id,
                transactionOutputIndex: info.transaction_vout,
            };
        } catch (error) {
            logger.error('Error opening channel: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};
