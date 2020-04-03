import { getChainBalance, getPendingChainBalance } from './chainBalance';
import { getChainTransactions } from './chainTransactions';
import { getUtxos } from './getUtxos';

export const chainQueries = {
    getChainBalance,
    getPendingChainBalance,
    getChainTransactions,
    getUtxos,
};
