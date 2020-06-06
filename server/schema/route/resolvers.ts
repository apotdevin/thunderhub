import {
  getRouteToDestination,
  getWalletInfo,
  probeForRoute,
} from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from 'server/helpers/helpers';
import { toWithError } from 'server/helpers/async';

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
  ProbeRoute: {
    route: async parent => {
      const { lnd, destination, tokens } = parent;

      if (!lnd) {
        logger.debug('ExpectedLNDToProbeForRoute');
        return null;
      }

      if (!destination) {
        logger.debug('ExpectedDestinationToProbeForRoute');
        return null;
      }

      const [{ route }, error] = await toWithError(
        probeForRoute({ lnd, destination, tokens })
      );

      if (error) {
        logger.debug(
          `Error probing route for to destination ${destination} from ${tokens} tokens`
        );
        return null;
      }

      if (!route) {
        logger.debug(
          `No route found to destination ${destination} for ${tokens} tokens`
        );
        return null;
      }

      const hopsWithNodes = route.hops.map(h => ({
        ...h,
        node: { lnd, publicKey: h.public_key },
      }));

      return { ...route, hops: hopsWithNodes };
    },
  },
};
