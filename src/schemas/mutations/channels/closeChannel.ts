import { closeChannel as lnCloseChannel } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
    GraphQLBoolean,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
} from 'graphql';
import { CloseChannelType } from '../../../schemaTypes/mutation.ts/channels/closeChannel';
import { getErrorMsg, getAuthLnd } from '../../../helpers/helpers';

interface CloseChannelProps {
    transaction_id: string;
    transaction_vout: string;
}

export const closeChannel = {
    type: CloseChannelType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        forceClose: { type: GraphQLBoolean },
        targetConfirmations: { type: GraphQLInt },
        tokensPerVByte: { type: GraphQLInt },
        auth: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'closeChannel');

        const lnd = getAuthLnd(params.auth);

        try {
            const info: CloseChannelProps = await lnCloseChannel({
                lnd: lnd,
                id: params.id,
                target_confirmations: params.targetConfirmations,
                tokens_per_vbyte: params.tokensPerVByte,
            });
            return {
                transactionId: info.transaction_id,
                transactionOutputIndex: info.transaction_vout,
            };
        } catch (error) {
            logger.error('Error closing channel: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};
