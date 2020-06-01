import {
  getChainBalance as getBalance,
  getPendingChainBalance as getPending,
  getChainTransactions,
  getUtxos,
  sendToChainAddress,
  createChainAddress,
} from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from 'server/helpers/helpers';
import { sortBy } from 'underscore';

interface ChainBalanceProps {
  chain_balance: number;
}

interface PendingChainBalanceProps {
  pending_chain_balance: number;
}

export const chainResolvers = {
  Query: {
    getChainBalance: async (
      _: undefined,
      params: any,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'chainBalance');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      try {
        const value: ChainBalanceProps = await getBalance({
          lnd,
        });
        return value.chain_balance;
      } catch (error) {
        logger.error('Error getting chain balance: %o', error);
        throw new Error(getErrorMsg(error));
      }
    },
    getPendingChainBalance: async (
      _: undefined,
      params: any,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'pendingChainBalance');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      try {
        const pendingValue: PendingChainBalanceProps = await getPending({
          lnd,
        });
        return pendingValue.pending_chain_balance;
      } catch (error) {
        logger.error('Error getting pending chain balance: %o', error);
        throw new Error(getErrorMsg(error));
      }
    },
    getChainTransactions: async (
      _: undefined,
      params: any,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'chainTransactions');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      try {
        const transactionList = await getChainTransactions({
          lnd,
        });

        const transactions = sortBy(
          transactionList.transactions,
          'created_at'
        ).reverse();
        return transactions;
      } catch (error) {
        logger.error('Error getting chain transactions: %o', error);
        throw new Error(getErrorMsg(error));
      }
    },
    getUtxos: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'getUtxos');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      try {
        const { utxos } = await getUtxos({ lnd });

        return utxos;
      } catch (error) {
        logger.error('Error getting utxos: %o', error);
        throw new Error(getErrorMsg(error));
      }
    },
  },
  Mutation: {
    createAddress: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'getAddress');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      const format = params.nested ? 'np2wpkh' : 'p2wpkh';

      try {
        const address = await createChainAddress({
          lnd,
          is_unused: true,
          format,
        });

        return address.address;
      } catch (error) {
        logger.error('Error creating address: %o', error);
        throw new Error(getErrorMsg(error));
      }
    },
    sendToAddress: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'sendToAddress');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      const props = params.fee
        ? { fee_tokens_per_vbyte: params.fee }
        : params.target
        ? { target_confirmations: params.target }
        : {};

      const sendAll = params.sendAll ? { is_send_all: true } : {};

      try {
        const send = await sendToChainAddress({
          lnd,
          address: params.address,
          ...(params.tokens && { tokens: params.tokens }),
          ...props,
          ...sendAll,
        });

        return {
          confirmationCount: send.confirmation_count,
          id: send.id,
          isConfirmed: send.is_confirmed,
          isOutgoing: send.is_outgoing,
          ...(send.tokens && { tokens: send.tokens }),
        };
      } catch (error) {
        logger.error('Error sending to chain address: %o', error);
        throw new Error(getErrorMsg(error));
      }
    },
  },
};
