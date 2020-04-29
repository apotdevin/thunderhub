import { GraphQLString, GraphQLBoolean } from 'graphql';
import { getInvoices, verifyMessage } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { getAuthLnd, getErrorMsg } from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';
import { decodeMessage } from '../../../helpers/customRecords';
import { GetMessagesType } from '../../types/QueryType';

const to = promise => {
  return promise
    .then(data => {
      return [null, data];
    })
    .catch(err => [err]);
};

export const getMessages = {
  type: GetMessagesType,
  args: {
    ...defaultParams,
    token: { type: GraphQLString },
    initialize: { type: GraphQLBoolean },
    lastMessage: { type: GraphQLString },
  },
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, 'getMessages');

    const lnd = getAuthLnd(params.auth);

    const [error, invoiceList] = await to(
      getInvoices({
        lnd,
        limit: params.initialize ? 100 : 5,
      })
    );

    if (error) {
      logger.error('Error getting invoices: %o', error);
      throw new Error(getErrorMsg(error));
    }

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

            const [error, { signed_by }] = await to(
              verifyMessage({
                lnd,
                message: messageToVerify,
                signature: customRecords.signature,
              })
            );

            if (!error && signed_by === customRecords.sender) {
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
    const final = filtered.filter(message => !!message);

    // logger.warn('Invoices: %o', final);

    return { token: invoiceList.next, messages: final };
  },
};
