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
import { AuthType } from '../../../schemaTypes/Auth';

interface OpenChannelProps {
    transaction_id: string;
    transaction_vout: string;
}

export const openChannel = {
    type: OpenChannelType,
    args: {
        amount: { type: new GraphQLNonNull(GraphQLInt) },
        partnerPublicKey: { type: new GraphQLNonNull(GraphQLString) },
        auth: { type: new GraphQLNonNull(AuthType) },
        tokensPerVByte: { type: GraphQLInt },
        isPrivate: { type: GraphQLBoolean },
    },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'openChannel');

        const lnd = getAuthLnd(params.auth);

        try {
            const info: OpenChannelProps = await lnOpenChannel({
                lnd,
                is_private: params.isPrivate,
                local_tokens: params.amount,
                partner_public_key: params.partnerPublicKey,
                chain_fee_tokens_per_vbyte: params.tokensPerVByte,
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
