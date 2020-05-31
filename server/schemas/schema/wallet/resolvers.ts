import { getWalletVersion } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { to } from 'server/helpers/async';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { getAuthLnd, getCorrectAuth } from 'server/helpers/helpers';

export const walletResolvers = {
  Query: {
    walletInfo: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'getWalletInfo');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      return await to(
        getWalletVersion({
          lnd,
        })
      );
    },
  },
};
