import { GraphQLList } from 'graphql';
import { getChainTransactions as getLnChainTransactions } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { getErrorMsg, getAuthLnd } from '../../../helpers/helpers';
import { sortBy } from 'underscore';
import { defaultParams } from '../../../helpers/defaultProps';
import { GetChainTransactionsType } from '../../types/QueryType';

interface TransactionProps {
    block_id: string;
    confirmation_count: number;
    confirmation_height: number;
    created_at: string;
    fee: number;
    id: string;
    output_addresses: string[];
    tokens: number;
}

interface TransactionsProps {
    transactions: TransactionProps[];
}

export const getChainTransactions = {
    type: new GraphQLList(GetChainTransactionsType),
    args: defaultParams,
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'chainTransactions');

        const lnd = getAuthLnd(params.auth);

        try {
            const transactionList: TransactionsProps = await getLnChainTransactions(
                {
                    lnd,
                },
            );

            const transactions = sortBy(
                transactionList.transactions,
                'created_at',
            ).reverse();
            return transactions;
        } catch (error) {
            params.logger &&
                logger.error('Error getting chain transactions: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};
