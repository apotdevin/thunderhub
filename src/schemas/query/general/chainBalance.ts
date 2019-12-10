import {
    getChainBalance as getBalance,
    getPendingChainBalance as getPending,
} from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import { getAuthLnd, getErrorMsg } from '../../../helpers/helpers';

interface ChainBalanceProps {
    chain_balance: number;
}

interface PendingChainBalanceProps {
    pending_chain_balance: number;
}

export const getChainBalance = {
    type: GraphQLInt,
    args: { auth: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'chainBalance');

        const lnd = getAuthLnd(params.auth);

        try {
            const value: ChainBalanceProps = await getBalance({
                lnd: lnd,
            });
            return value.chain_balance;
        } catch (error) {
            logger.error('Error getting chain balance: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};

export const getPendingChainBalance = {
    type: GraphQLInt,
    args: { auth: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'pendingChainBalance');

        const lnd = getAuthLnd(params.auth);

        try {
            const pendingValue: PendingChainBalanceProps = await getPending({
                lnd: lnd,
            });
            return pendingValue.pending_chain_balance;
        } catch (error) {
            logger.error('Error getting pending chain balance: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};
