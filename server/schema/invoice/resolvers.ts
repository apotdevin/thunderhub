import { randomBytes, createHash } from 'crypto';
import { once } from 'events';
import {
  payViaRoutes,
  createInvoice,
  decodePaymentRequest,
  payViaPaymentDetails,
  createInvoice as createInvoiceRequest,
  subscribeToInvoice,
} from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { getErrorMsg } from 'server/helpers/helpers';
import { to } from 'server/helpers/async';
import { DecodedType } from 'server/types/ln-service.types';

const KEYSEND_TYPE = '5482373484';

export const invoiceResolvers = {
  Query: {
    getInvoiceStatusChange: async (
      _: undefined,
      params: { id: string },
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'getInvoiceStatusChange');

      const { id } = params;
      const { lnd } = context;

      const sub = subscribeToInvoice({ id, lnd });

      await once(sub, 'invoice_updated');

      return Promise.race([
        once(sub, 'invoice_updated'),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 90000)
        ),
      ])
        .then((res: any) => {
          if (res?.[0] && res[0].is_confirmed) {
            return 'paid';
          }
          return 'not_paid';
        })
        .catch(e => {
          if (e) return 'timeout';
        });
    },
    decodeRequest: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'decode');

      const { lnd } = context;

      const decoded = await to<DecodedType>(
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

      const { lnd } = context;

      return await to(
        createInvoiceRequest({
          lnd,
          tokens: params.amount,
        })
      );
    },
    keysend: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'keysend');

      const { destination, tokens } = params;
      const { lnd } = context;

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

      const { lnd } = context;

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

      const { route: routeJSON, id } = params;
      const { lnd } = context;

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
