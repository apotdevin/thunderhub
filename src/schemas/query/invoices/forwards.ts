import { GraphQLList, GraphQLString, GraphQLNonNull } from 'graphql';
import { getForwards as getLnForwards } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { GetForwardType } from '../../../schemaTypes/query/info/forwards';
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
    args: { auth: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'forwards');

        const lnd = getAuthLnd(params.auth);

        try {
            const forwardsList: ForwardsProps = await getLnForwards({
                lnd: lnd,
            });

            const forwards = forwardsList.forwards.map(forward => ({
                createdAt: forward.created_at,
                fee: forward.fee,
                feeMtokens: forward.fee_mtokens,
                incomingChannel: forward.incoming_channel,
                mtokens: forward.mtokens,
                outgoingChannel: forward.outgoing_channel,
                tokens: forward.tokens,
            }));

            return forwards;
        } catch (error) {
            logger.error('Error getting forwards: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};
