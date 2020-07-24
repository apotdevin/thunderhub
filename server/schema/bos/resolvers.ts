import { ContextType } from 'server/types/apiTypes';
import { to } from 'server/helpers/async';
import { logger } from 'server/helpers/logger';
import { AuthType } from 'src/context/AccountContext';

import { rebalance } from 'balanceofsatoshis/swaps';
import { getAccountingReport } from 'balanceofsatoshis/balances';
import request from '@alexbosworth/request';
import { RebalanceResponseType } from 'server/types/balanceofsatoshis.types';

type RebalanceType = {
  auth: AuthType;
  avoid?: String[];
  in_through?: String;
  is_avoiding_high_inbound?: Boolean;
  max_fee?: Number;
  max_fee_rate?: Number;
  max_rebalance?: Number;
  node?: String;
  out_channels?: String[];
  out_through?: String;
  target?: Number;
};

type AccountingType = {
  auth: AuthType;
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
          request,
          is_csv: true,
          ...params,
        })
      );

      return response;
    },
  },
  Mutation: {
    bosRebalance: async (
      _: undefined,
      params: RebalanceType,
      context: ContextType
    ) => {
      const {
        avoid,
        in_through,
        is_avoiding_high_inbound,
        max_fee,
        max_fee_rate,
        max_rebalance,
        node,
        out_channels,
        out_through,
        target,
      } = params;
      const { lnd } = context;

      const filteredParams = {
        avoid,
        out_channels,
        ...(in_through && { in_through }),
        ...(is_avoiding_high_inbound && { is_avoiding_high_inbound }),
        ...(max_fee && max_fee > 0 && { max_fee }),
        ...(max_fee_rate && max_fee_rate > 0 && { max_fee_rate }),
        ...(max_rebalance && max_rebalance > 0 && { max_rebalance }),
        ...(node && { node }),
        ...(out_through && { out_through }),
        ...(target && { target }),
      };

      logger.info('Rebalance Params: %o', filteredParams);

      const response = await to<RebalanceResponseType>(
        rebalance({
          lnd,
          logger,
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
