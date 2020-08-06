import { getWalletVersion } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { to } from 'server/helpers/async';
import { requestLimiter } from 'server/helpers/rateLimiter';

export const walletResolvers = {
  Query: {
    getWalletInfo: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'getWalletInfo');

      const { lnd } = context;

      return await to(
        getWalletVersion({
          lnd,
        })
      );
    },
  },
};
