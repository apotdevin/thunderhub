import { ContextType } from 'server/types/apiTypes';
import { getLnd } from 'server/helpers/helpers';
import { to } from 'server/helpers/async';
import { logger } from 'server/helpers/logger';
import { AuthType } from 'src/context/AccountContext';

import { rebalance } from 'balanceofsatoshis/swaps';
import { getAccountingReport } from 'balanceofsatoshis/balances';
import request from '@alexbosworth/request';

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
      const { auth, ...settings } = params;
      const lnd = getLnd(auth, context);

      const response = await to(
        getAccountingReport({
          lnd,
          logger,
          request,
          is_csv: true,
          ...settings,
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
      const { auth, ...extraparams } = params;
      const lnd = getLnd(auth, context);

      const response = await to(
        rebalance({
          lnd,
          logger,
          ...extraparams,
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
