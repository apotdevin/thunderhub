import { randomBytes, createHash } from 'crypto';
import {
  payViaRoutes,
  createInvoice,
  decodePaymentRequest,
  payViaPaymentDetails,
  createInvoice as createInvoiceRequest,
} from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
  getLnd,
} from 'server/helpers/helpers';
import { to } from 'server/helpers/async';
import { DecodedType } from 'server/types/ln-service.types';

const KEYSEND_TYPE = '5482373484';

export const invoiceResolvers = {
  Query: {
    decodeRequest: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'decode');

      const lnd = getLnd(params.auth, context);

      const decoded: DecodedType = await to(
        decodePaymentRequest({
          lnd,
          request: params.request,
        })
      );

      return {
        ...decoded,
        destination_node: { lnd, publicKey: decoded.destination },
        probe_route: {
          lnd,
          destination: decoded.destination,
          tokens: decoded.tokens,
        },
      };
    },
  },
  Mutation: {
    createInvoice: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'createInvoice');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      return await to(
        createInvoiceRequest({
          lnd,
          tokens: params.amount,
        })
      );
    },
    keysend: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'keysend');

      const { auth, destination, tokens } = params;
      const lnd = getLnd(auth, context);

      const preimage = randomBytes(32);
      const secret = preimage.toString('hex');
      const id = createHash('sha256').update(preimage).digest().toString('hex');

      return await to(
        payViaPaymentDetails({
          id,
          lnd,
          tokens,
          destination,
          messages: [
            {
              type: KEYSEND_TYPE,
              value: secret,
            },
          ],
        })
      );
    },
    circularRebalance: async (
      _: undefined,
      params: any,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'circularRebalance');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      let route;
      try {
        route = JSON.parse(params.route);
      } catch (error) {
        logger.error('Corrupt route json: %o', error);
        throw new Error('Corrupt Route JSON');
      }

      const { id } = await createInvoice({
        lnd,
        tokens: params.tokens,
        description: 'Rebalance',
      }).catch((error: any) => {
        logger.error('Error getting invoice: %o', error);
        throw new Error(getErrorMsg(error));
      });

      await payViaRoutes({ lnd, routes: [route], id }).catch((error: any) => {
        logger.error('Error making payment: %o', error);
        throw new Error(getErrorMsg(error));
      });

      return true;
    },
    payViaRoute: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'payViaRoute');

      const { auth, route: routeJSON, id } = params;
      const lnd = getLnd(auth, context);

      let route;
      try {
        route = JSON.parse(routeJSON);
      } catch (error) {
        logger.error('Corrupt route json: %o', error);
        throw new Error('Corrupt Route JSON');
      }

      await to(payViaRoutes({ lnd, routes: [route], id }));

      return true;
    },
  },
};
