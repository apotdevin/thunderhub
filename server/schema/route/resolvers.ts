import { getRouteToDestination, getWalletInfo } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from 'server/helpers/helpers';

export const routeResolvers = {
  Query: {
    getRoutes: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'getRoutes');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      const { public_key } = await getWalletInfo({ lnd });

      const { route } = await getRouteToDestination({
        lnd,
        outgoing_channel: params.outgoing,
        incoming_peer: params.incoming,
        destination: public_key,
        tokens: params.tokens,
        ...(params.maxFee && { max_fee: params.maxFee }),
      }).catch((error: any) => {
        logger.error('Error getting routes: %o', error);
        throw new Error(getErrorMsg(error));
      });

      if (!route) {
        throw new Error('NoRouteFound');
      }

      return JSON.stringify(route);
    },
  },
};
