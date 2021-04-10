import {
  getChainBalance,
  getPendingChainBalance,
  getChainTransactions,
  getUtxos,
  sendToChainAddress,
  createChainAddress,
  getPendingChannels,
} from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { getErrorMsg } from 'server/helpers/helpers';
import { sortBy } from 'underscore';
import { to } from 'server/helpers/async';
import {
  GetChainBalanceType,
  GetPendingChainBalanceType,
  GetChainTransactionsType,
  GetUtxosType,
  SendToChainAddressType,
  GetPendingChannelsType,
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
      __: undefined,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'chainBalance');

      const { lnd } = context;

      const value: ChainBalanceProps = await to<GetChainBalanceType>(
        getChainBalance({
          lnd,
        })
      );
      return value.chain_balance || 0;
    },
    getPendingChainBalance: async (
      _: undefined,
      __: undefined,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'pendingChainBalance');

      const { lnd } = context;

      const pendingValue: PendingChainBalanceProps = await to<GetPendingChainBalanceType>(
        getPendingChainBalance({
          lnd,
        })
      );

      const { pending_channels } = await to<GetPendingChannelsType>(
        getPendingChannels({ lnd })
      );

      const closing =
        pending_channels
          .filter(p => p.is_closing)
          .reduce((p, c) => p + c.local_balance, 0) || 0;

      return pendingValue.pending_chain_balance + closing || 0;
    },

    getChainTransactions: async (
      _: undefined,
      __: undefined,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'chainTransactions');

      const { lnd } = context;

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
    getUtxos: async (_: undefined, __: undefined, context: ContextType) => {
      await requestLimiter(context.ip, 'getUtxos');

      const { lnd } = context;

      const info = await to<GetUtxosType>(getUtxos({ lnd }));

      return info?.utxos;
    },
  },
  Mutation: {
    createAddress: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'getAddress');

      const { lnd } = context;

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

      const { lnd } = context;

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
