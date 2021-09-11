import {
  getChainTransactions,
  getUtxos,
  sendToChainAddress,
  createChainAddress,
} from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { sortBy } from 'lodash';
import { to } from 'server/helpers/async';
import {
  GetChainTransactionsType,
  GetUtxosType,
  SendToChainAddressType,
} from 'server/types/ln-service.types';

export const chainResolvers = {
  Query: {
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

      const address = await to<{ address: string }>(
        createChainAddress({
          lnd,
          is_unused: true,
          format,
        })
      );

      return address.address;
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
