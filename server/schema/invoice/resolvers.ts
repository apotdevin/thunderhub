import { randomBytes, createHash } from 'crypto';
import {
  payViaRoutes,
  createInvoice,
  pay as payRequest,
  decodePaymentRequest,
  payViaPaymentDetails,
  parsePaymentRequest,
  createInvoice as createInvoiceRequest,
} from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from 'server/helpers/helpers';

const KEYSEND_TYPE = '5482373484';

export const invoiceResolvers = {
  Mutation: {
    createInvoice: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'createInvoice');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      try {
        const invoice = await createInvoiceRequest({
          lnd,
          tokens: params.amount,
        });

        return {
          chainAddress: invoice.chain_address,
          createdAt: invoice.created_at,
          description: invoice.description,
          id: invoice.id,
          request: invoice.request,
          secret: invoice.secret,
          tokens: invoice.tokens,
        };
      } catch (error) {
        logger.error('Error creating invoice: %o', error);
        throw new Error(getErrorMsg(error));
      }
    },
    parsePayment: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'parsePayment');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      try {
        const request = await parsePaymentRequest({
          lnd,
          request: params.request,
        });

        const routes = request.routes.map(route => {
          return {
            mTokenFee: route.base_fee_mtokens,
            channel: route.channel,
            cltvDelta: route.cltv_delta,
            feeRate: route.fee_rate,
            publicKey: route.public_key,
          };
        });

        return {
          chainAddresses: request.chain_addresses,
          cltvDelta: request.cltv_delta,
          createdAt: request.created_at,
          description: request.description,
          descriptionHash: request.description_hash,
          destination: request.destination,
          expiresAt: request.expires_at,
          id: request.id,
          isExpired: request.is_expired,
          mTokens: request.mtokens,
          network: request.network,
          routes,
          tokens: request.tokens,
        };
      } catch (error) {
        logger.error('Error decoding request: %o', error);
        throw new Error(getErrorMsg(error));
      }
    },
    pay: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'pay');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      let isRequest = false;
      try {
        await decodePaymentRequest({
          lnd,
          request: params.request,
        });
        isRequest = true;
      } catch (error) {
        logger.error('Error decoding request: %o', error);
      }

      if (isRequest) {
        try {
          const payment = await payRequest({
            lnd,
            request: params.request,
          });
          return payment;
        } catch (error) {
          logger.error('Error paying request: %o', error);
          throw new Error(getErrorMsg(error));
        }
      }

      if (!params.tokens) {
        throw new Error('Amount of tokens is needed for keysend');
      }

      const preimage = randomBytes(32);
      const secret = preimage.toString('hex');
      const id = createHash('sha256').update(preimage).digest().toString('hex');

      try {
        const payment = await payViaPaymentDetails({
          id,
          lnd,
          tokens: params.tokens,
          destination: params.request,
          messages: [
            {
              type: KEYSEND_TYPE,
              value: secret,
            },
          ],
        });
        return payment;
      } catch (error) {
        logger.error('Error paying request: %o', error);
        throw new Error(getErrorMsg(error));
      }
    },
    payViaRoute: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'payViaRoute');

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
        description: 'Balancing Channel',
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
  },
};
