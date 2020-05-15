import { GraphQLString, GraphQLBoolean } from 'graphql';
import { getInvoices, verifyMessage } from 'ln-service';
import { ContextType } from 'api/types/apiTypes';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { getAuthLnd, to, getCorrectAuth } from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';
import { decodeMessage } from '../../../helpers/customRecords';
import { GetMessagesType } from '../../types/QueryType';

export const getMessages = {
  type: GetMessagesType,
  args: {
    ...defaultParams,
    token: { type: GraphQLString },
    initialize: { type: GraphQLBoolean },
    lastMessage: { type: GraphQLString },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'getMessages');

    const auth = getCorrectAuth(params.auth, context.sso);
    const lnd = getAuthLnd(auth);

    const invoiceList = await to(
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

            const { signed_by } = await to(
              verifyMessage({
                lnd,
                message: messageToVerify,
                signature: customRecords.signature,
              })
            );

            if (signed_by === customRecords.sender) {
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
