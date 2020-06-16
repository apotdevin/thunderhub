import { ContextType } from 'server/types/apiTypes';
import { getLnd } from 'server/helpers/helpers';
import { rebalance } from 'balanceofsatoshis/swaps';
import { to } from 'server/helpers/async';
import { logger } from 'server/helpers/logger';

export const bosResolvers = {
  Mutation: {
    bosRebalance: async (_: undefined, params: any, context: ContextType) => {
      const lnd = getLnd(params.auth, context);

      const [response, error] = await to(
        rebalance({
          lnd,
          logger,
          out_through:
            '03eab3ddfa5dcbcaf235b0b593f9f4ab1ec42666b2cfe32da09dcc249d424e0c55',
        })
      );

      console.log({ response, error });

      return true;
    },
  },
};
