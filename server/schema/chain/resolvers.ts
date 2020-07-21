import {
  getChainBalance,
  getPendingChainBalance,
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
import { to } from 'server/helpers/async';
import {
  GetChainBalanceType,
  GetPendingChainBalanceType,
  GetChainTransactionsType,
  GetUtxosType,
  SendToChainAddressType,
} from 'server/types/ln-service.types';

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

      const value: ChainBalanceProps = await to<GetChainBalanceType>(
        getChainBalance({
          lnd,
        })
      );
      return value.chain_balance;
    },
    getPendingChainBalance: async (
      _: undefined,
      params: any,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'pendingChainBalance');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      const pendingValue: PendingChainBalanceProps = await to<
        GetPendingChainBalanceType
      >(
        getPendingChainBalance({
          lnd,
        })
      );
      return pendingValue.pending_chain_balance;
    },
    getChainTransactions: async (
      _: undefined,
      params: any,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'chainTransactions');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      const transactionList = await to<GetChainTransactionsType>(
        getChainTransactions({
          lnd,
        })
      );

      const transactions = sortBy(
        transactionList.transactions,
        'created_at'
      ).reverse();
      return transactions;
    },
    getUtxos: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'getUtxos');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      const info = await to<GetUtxosType>(getUtxos({ lnd }));

      return info?.utxos;
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

      const send = await to<SendToChainAddressType>(
        sendToChainAddress({
          lnd,
          address: params.address,
          ...(params.tokens && { tokens: params.tokens }),
          ...props,
          ...sendAll,
        })
      );

      return {
        confirmationCount: send.confirmation_count,
        id: send.id,
        isConfirmed: send.is_confirmed,
        isOutgoing: send.is_outgoing,
        ...(send.tokens && { tokens: send.tokens }),
      };
    },
  },
};
