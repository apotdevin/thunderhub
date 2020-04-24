import { GraphQLString, GraphQLBoolean, GraphQLList } from 'graphql';
import { getPayments, getInvoices, getNode } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { getAuthLnd, getErrorMsg } from '../../../helpers/helpers';
import { compareDesc } from 'date-fns';
import { sortBy } from 'underscore';
import { defaultParams } from '../../../helpers/defaultProps';
import {
  decodeMessage,
  //   decodeCustomRecords,
} from '../../../helpers/customRecords';
import { GetResumeType, GetMessagesType } from '../../types/QueryType';
import { InvoicesProps } from '../transactions/resume.interface';

const to = promise => {
  return promise
    .then(data => {
      return [null, data];
    })
    .catch(err => [err]);
};

export const getMessages = {
  type: new GraphQLList(GetMessagesType),
  args: {
    ...defaultParams,
    initialize: { type: GraphQLBoolean },
    lastMessage: { type: GraphQLString },
  },
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, 'getMessages');

    const lnd = getAuthLnd(params.auth);

    const [err, invoiceList] = await to(
      getInvoices({
        lnd,
        limit: params.initialize ? 100 : 5,
      })
    );

    if (err) {
      logger.error('Error getting invoices: %o', err);
      throw new Error(getErrorMsg(err));
    }

    // try {
    //   const invoiceList: InvoicesProps = await getInvoices({
    //     lnd,
    //     limit: 5,
    //   });

    const filtered: [] = invoiceList.invoices.map(invoice => {
      if (!invoice.is_confirmed) {
        return;
      }
      // console.log(invoice);

      const messages = invoice.payments[0].messages;

      let customRecords = {};
      messages.map(message => {
        const { type, value } = message;

        //   const decoded = decodeCustomRecords(message);
        const obj = decodeMessage({ type, value });
        customRecords = { ...customRecords, ...obj };
        //   return { type, message: decodeMessage({ type, value }) };
        //   return { decoded };
      });

      if (Object.keys(customRecords).length <= 0) {
        return;
      }

      return {
        date: invoice.confirmed_at,
        id: invoice.id,
        ...customRecords,
      };
    });

    const final = filtered.filter(message => !!message);

    logger.warn('Invoices: %o', final);

    return final;
    // } catch (error) {
    //   params.logger &&
    // logger.error('Error getting invoices: %o', error);
    // throw new Error(getErrorMsg(error));
    // }
  },
};
