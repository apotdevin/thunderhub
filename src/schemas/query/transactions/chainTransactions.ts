import { GraphQLList, GraphQLString, GraphQLNonNull } from 'graphql';
import { getChainTransactions as getLnChainTransactions } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { getErrorMsg, getAuthLnd } from '../../../helpers/helpers';
import { GetChainTransactionsType } from '../../../schemaTypes/query/transactions/chainTransactions';
import { sortBy } from 'underscore';

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
    args: { auth: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'chainTransactions');

        const lnd = getAuthLnd(params.auth);

        try {
            const transactionList: TransactionsProps = await getLnChainTransactions(
                {
                    lnd,
                },
            );
            const filteredTransaction = transactionList.transactions.filter(
                transaction => transaction.tokens > 0,
            );
            const transactions = sortBy(
                filteredTransaction,
                'created_at',
            ).reverse();
            return transactions;
        } catch (error) {
            logger.error('Error getting chain transactions: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};
