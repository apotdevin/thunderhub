import { GraphQLList, GraphQLString, GraphQLNonNull } from 'graphql';
import { getForwards as getLnForwards } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { GetForwardType } from '../../../schemaTypes/query/transactions/forwards';
import { getErrorMsg, getAuthLnd } from '../../../helpers/helpers';

interface ForwardProps {
    created_at: string;
    fee: number;
    fee_mtokens: string;
    incoming_channel: string;
    mtokens: string;
    outgoing_channel: string;
    tokens: number;
}

interface ForwardsProps {
    forwards: ForwardProps[];
    next: string;
}

export const getForwards = {
    type: new GraphQLList(GetForwardType),
    args: {
        auth: { type: new GraphQLNonNull(GraphQLString) },
        token: { type: GraphQLString },
    },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'forwards');

        const lnd = getAuthLnd(params.auth);

        const props = params.token ? { token: params.token } : { limit: 25 };

        try {
            const forwards: ForwardsProps = await getLnForwards({
                lnd,
                ...props,
            });

            return forwards;
        } catch (error) {
            logger.error('Error getting forwards: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};
