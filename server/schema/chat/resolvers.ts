import { randomBytes, createHash } from 'crypto';
import {
  payViaPaymentDetails,
  getWalletInfo,
  probeForRoute,
  signMessage,
  getInvoices,
  verifyMessage,
} from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { to, toWithError } from 'server/helpers/async';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { getAuthLnd, getCorrectAuth } from 'server/helpers/helpers';
import {
  createCustomRecords,
  decodeMessage,
} from 'server/helpers/customRecords';
import { logger } from 'server/helpers/logger';
import {
  GetInvoicesType,
  GetWalletInfoType,
} from 'server/types/ln-service.types';

export const chatResolvers = {
  Query: {
    getMessages: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'getMessages');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      const invoiceList = await to<GetInvoicesType>(
        getInvoices({
          lnd,
          limit: params.initialize ? 100 : 5,
        })
      );

      const getFiltered = () =>
        Promise.all(
          invoiceList.invoices.map(async invoice => {
            if (!invoice.is_confirmed) {
              return;
            }

            const messages = invoice.payments[0].messages;

            let customRecords: { [key: string]: string } = {};
            messages.map(message => {
              const { type, value } = message;

              const obj = decodeMessage({ type, value });
              customRecords = { ...customRecords, ...obj };
            });

            if (Object.keys(customRecords).length <= 0) {
              return;
            }

            let isVerified = false;

            if (customRecords.signature) {
              const messageToVerify = JSON.stringify({
                sender: customRecords.sender,
                message: customRecords.message,
              });

              const [verified, error] = await toWithError(
                verifyMessage({
                  lnd,
                  message: messageToVerify,
                  signature: customRecords.signature,
                })
              );
              if (error) {
                logger.debug(`Error verifying message: ${messageToVerify}`);
              }

              if (
                !error &&
                (verified as { signed_by: string })?.signed_by ===
                  customRecords.sender
              ) {
                isVerified = true;
              }
            }

            return {
              date: invoice.confirmed_at,
              id: invoice.id,
              tokens: invoice.tokens,
              verified: isVerified,
              ...customRecords,
            };
          })
        );

      const filtered = await getFiltered();
      const final = filtered.filter(Boolean) || [];

      return { token: invoiceList.next, messages: final };
    },
  },
  Mutation: {
    sendMessage: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'sendMessage');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      if (params.maxFee) {
        const tokens = Math.max(params.tokens || 100, 100);
        const { route } = await to(
          probeForRoute({
            destination: params.publicKey,
            lnd,
            tokens,
          })
        );

        if (!route) {
          throw new Error('NoRouteFound');
        }

        if (route.safe_fee > params.maxFee) {
          throw new Error('Higher fee limit must be set');
        }
      }

      let satsToSend = params.tokens || 1;
      let messageToSend = params.message;
      if (params.messageType === 'paymentrequest') {
        satsToSend = 1;
        messageToSend = `${params.tokens},${params.message}`;
      }

      const nodeInfo = await to<GetWalletInfoType>(
        getWalletInfo({
          lnd,
        })
      );

      const userAlias = nodeInfo.alias;
      const userKey = nodeInfo.public_key;

      const preimage = randomBytes(32);
      const secret = preimage.toString('hex');
      const id = createHash('sha256').update(preimage).digest().toString('hex');

      const messageToSign = JSON.stringify({
        sender: userKey,
        message: messageToSend,
      });

      const { signature } = await to(
        signMessage({ lnd, message: messageToSign })
      );

      const customRecords = createCustomRecords({
        message: messageToSend,
        sender: userKey,
        alias: userAlias,
        contentType: params.messageType || 'text',
        requestType: params.messageType || 'text',
        signature,
        secret,
      });

      const { safe_fee } = await to(
        payViaPaymentDetails({
          id,
          lnd,
          tokens: satsToSend,
          destination: params.publicKey,
          messages: customRecords,
        })
      );
      return safe_fee;
    },
  },
};
