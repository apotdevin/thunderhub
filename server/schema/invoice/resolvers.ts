import { randomBytes, createHash } from 'crypto';
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
import { CreateInvoiceType, DecodedType } from 'server/types/ln-service.types';

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

      return Promise.race([
        new Promise(resolve => {
          sub.on('invoice_updated', (data: any) => {
            if (data.is_confirmed) {
              resolve(true);
            }
          });
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 90000)
        ),
      ])
        .then((res: any) => {
          if (res) {
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
    createInvoice: async (
      _: undefined,
      {
        amount,
        description,
        secondsUntil,
        includePrivate,
      }: {
        amount: number;
        description?: string;
        secondsUntil?: number;
        includePrivate?: boolean;
      },
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'createInvoice');

      const { lnd } = context;

      const getDate = (secondsUntil: number) => {
        const date = new Date();
        date.setSeconds(date.getSeconds() + secondsUntil);

        return date.toISOString();
      };

      const invoiceParams = {
        tokens: amount,
        ...(description && { description }),
        ...(!!secondsUntil && { expires_at: getDate(secondsUntil) }),
        ...(includePrivate && { is_including_private_channels: true }),
      };

      logger.info('Creating invoice with params: %o', invoiceParams);

      return await to<CreateInvoiceType>(
        createInvoiceRequest({
          lnd,
          ...invoiceParams,
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
