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

export const getMessages = {
  type: new GraphQLList(GetMessagesType),
  args: {
    ...defaultParams,
  },
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, 'getMessages');

    const lnd = getAuthLnd(params.auth);

    try {
      const invoiceList: InvoicesProps = await getInvoices({
        lnd,
        limit: 5,
      });

      const filtered = invoiceList.invoices.map(invoice => {
        if (!invoice.is_confirmed) {
          return;
        }

        const date = invoice.confirmed_at;
        const id = invoice.id;
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
          date,
          id,
          ...customRecords,
        };
      });

      // logger.warn('Invoices: %o', filtered);

      return filtered;
    } catch (error) {
      //   params.logger &&
      logger.error('Error getting invoices: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
