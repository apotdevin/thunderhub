import { sendToChainAddress } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
    GraphQLNonNull,
    GraphQLString,
    GraphQLBoolean,
    GraphQLInt,
} from 'graphql';
import { getErrorMsg, getAuthLnd } from '../../../helpers/helpers';
import { SendToType } from '../../../schemaTypes/mutation.ts/onchain/sentToAddress';

interface SendProps {
    confirmation_count: number;
    id: string;
    is_confirmed: boolean;
    is_outgoing: boolean;
    tokens: number;
}

export const sendToAddress = {
    type: SendToType,
    args: {
        auth: { type: new GraphQLNonNull(GraphQLString) },
        address: { type: new GraphQLNonNull(GraphQLString) },
        tokens: { type: GraphQLInt },
        fee: { type: GraphQLInt },
        target: { type: GraphQLInt },
        sendAll: { type: GraphQLBoolean },
    },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'sendToAddress');

        const lnd = getAuthLnd(params.auth);

        const props = params.fee
            ? { fee_tokens_per_vbyte: params.fee }
            : params.target
            ? { target_confirmations: params.target }
            : {};

        const sendAll = params.sendAll ? { is_send_all: true } : {};

        try {
            const send: SendProps = await sendToChainAddress({
                lnd: lnd,
                address: params.address,
                tokens: params.tokens,
                ...props,
                ...sendAll,
            });

            return {
                confirmationCount: send.confirmation_count,
                id: send.id,
                isConfirmed: send.is_confirmed,
                isOutgoing: send.is_outgoing,
                tokens: send.tokens,
            };
        } catch (error) {
            logger.error('Error creating address: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};
