import fs from 'fs';
import { ContextType } from 'server/types/apiTypes';
import { to, toWithError } from 'server/helpers/async';
import { logger } from 'server/helpers/logger';
import { rebalance } from 'balanceofsatoshis/swaps';
import { pay } from 'balanceofsatoshis/network';
import { getAccountingReport } from 'balanceofsatoshis/balances';
import { fetchRequest } from 'balanceofsatoshis/commands';
import { RebalanceResponseType } from 'server/types/balanceofsatoshis.types';
import { getErrorMsg } from 'server/helpers/helpers';

type PayType = {
  max_fee: Number;
  max_paths: Number;
  request: String;
  message?: String;
  out?: String[];
};

type RebalanceType = {
  avoid?: String[];
  in_through?: String;
  max_fee?: Number;
  max_fee_rate?: Number;
  max_rebalance?: Number;
  timeout_minutes?: Number;
  node?: String;
  out_channels?: String[];
  out_through?: String;
  out_inbound?: Number;
};

type AccountingType = {
  category?: String;
  currency?: String;
  fiat?: String;
  month?: String;
  year?: String;
};

export const bosResolvers = {
  Query: {
    getAccountingReport: async (
      _: undefined,
      params: AccountingType,
      context: ContextType
    ) => {
      const { lnd } = context;

      const response = await to(
        getAccountingReport({
          lnd,
          logger,
          request: fetchRequest,
          is_csv: true,
          ...params,
        })
      );

      return response;
    },
  },
  Mutation: {
    bosPay: async (_: undefined, params: PayType, context: ContextType) => {
      const { lnd } = context;
      const { max_fee, max_paths, message, out, request } = params;

      const props = {
        max_fee,
        max_paths,
        ...(message && { message }),
        out: out || [],
        avoid: [],
      };

      logger.debug('Paying invoice with params: %o', props);

      const [response, error] = await toWithError(
        pay({
          lnd,
          logger,
          ...props,
          request,
        })
      );

      if (error) {
        logger.error('Error paying invoice: %o', error);
        throw new Error(getErrorMsg(error));
      }

      logger.debug('Paid invoice: %o', response);
      return true;
    },
    bosRebalance: async (
      _: undefined,
      {
        avoid,
        in_through,
        max_fee,
        max_fee_rate,
        max_rebalance,
        timeout_minutes,
        node,
        out_through,
        out_inbound,
      }: RebalanceType,
      { lnd }: ContextType
    ) => {
      const filteredParams = {
        out_channels: [],
        avoid,
        ...(in_through && { in_through }),
        ...(max_fee && max_fee > 0 && { max_fee }),
        ...(max_fee_rate && max_fee_rate > 0 && { max_fee_rate }),
        ...(timeout_minutes && timeout_minutes > 0 && { timeout_minutes }),
        ...(max_rebalance &&
          max_rebalance > 0 && { max_rebalance: `${max_rebalance}` }),
        ...(node && { node }),
        ...(out_through && { out_through }),
        ...(out_inbound &&
          out_inbound > 0 && { out_inbound: `${out_inbound}` }),
      };

      logger.info('Rebalance Params: %o', filteredParams);

      const response = await to<RebalanceResponseType>(
        rebalance({
          lnd,
          logger,
          fs: { getFile: fs.readFile },
          ...filteredParams,
        })
      );

      const result = {
        increase: response.rebalance[0],
        decrease: response.rebalance[1],
        result: response.rebalance[2],
      };

      return result;
    },
  },
};
