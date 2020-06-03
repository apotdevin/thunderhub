import {
  getPayments,
  getInvoices,
  getNode,
  getForwards as getLnForwards,
  getWalletInfo,
} from 'ln-service';
import { compareDesc, subHours, subDays, subMonths, subYears } from 'date-fns';
import { sortBy } from 'underscore';
import { ContextType } from 'server/types/apiTypes';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from 'server/helpers/helpers';
import { to } from 'server/helpers/async';
import { ForwardCompleteProps } from '../widgets/resolvers/interface';
import { PaymentsProps, InvoicesProps, NodeProps } from './interface';

export const transactionResolvers = {
  Query: {
    getResume: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'payments');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      let payments;
      let invoices;

      try {
        const paymentList: PaymentsProps = await getPayments({
          lnd,
        });

        const getMappedPayments = () =>
          Promise.all(
            paymentList.payments.map(async payment => {
              let nodeInfo: NodeProps;
              try {
                nodeInfo = await getNode({
                  lnd,
                  is_omitting_channels: true,
                  public_key: payment.destination,
                });
              } catch (error) {
                nodeInfo = { alias: payment.destination?.substring(0, 6) };
              }
              return {
                type: 'payment',
                alias: nodeInfo.alias,
                date: payment.created_at,
                ...payment,
              };
            })
          );
        payments = await getMappedPayments();
      } catch (error) {
        logger.error('Error getting payments: %o', error);
        throw new Error(getErrorMsg(error));
      }

      const invoiceProps = params.token
        ? { token: params.token }
        : { limit: 25 };

      let lastInvoiceDate = '';
      let firstInvoiceDate = '';
      let token = '';
      let withInvoices = true;

      try {
        const invoiceList: InvoicesProps = await getInvoices({
          lnd,
          ...invoiceProps,
        });

        invoices = invoiceList.invoices.map(invoice => {
          return {
            type: 'invoice',
            date: invoice.confirmed_at || invoice.created_at,
            ...invoice,
          };
        });

        if (invoices.length <= 0) {
          withInvoices = false;
        } else {
          const { date } = invoices[invoices.length - 1];
          firstInvoiceDate = invoices[0].date;
          lastInvoiceDate = date;
          token = invoiceList.next;
        }
      } catch (error) {
        logger.error('Error getting invoices: %o', error);
        throw new Error(getErrorMsg(error));
      }

      const filterArray = payment => {
        const last =
          compareDesc(new Date(lastInvoiceDate), new Date(payment.date)) === 1;
        const first = params.token
          ? compareDesc(new Date(payment.date), new Date(firstInvoiceDate)) ===
            1
          : true;
        return last && first;
      };

      const filteredPayments = withInvoices
        ? payments.filter(filterArray)
        : payments;

      const resumeArray = sortBy(
        [...invoices, ...filteredPayments],
        'date'
      ).reverse();

      return {
        token,
        resume: JSON.stringify(resumeArray),
      };
    },
    getForwards: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'forwards');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      let startDate = new Date();
      const endDate = new Date();

      if (params.time === 'oneYear') {
        startDate = subYears(endDate, 1);
      } else if (params.time === 'sixMonths') {
        startDate = subMonths(endDate, 6);
      } else if (params.time === 'threeMonths') {
        startDate = subMonths(endDate, 3);
      } else if (params.time === 'month') {
        startDate = subMonths(endDate, 1);
      } else if (params.time === 'week') {
        startDate = subDays(endDate, 7);
      } else {
        startDate = subHours(endDate, 24);
      }

      const { public_key } = await to(
        getWalletInfo({
          lnd,
        })
      );

      const forwardsList: ForwardCompleteProps = await to(
        getLnForwards({
          lnd,
          after: startDate,
          before: endDate,
        })
      );

      const list = forwardsList.forwards.map(forward => ({
        ...forward,
        incoming_channel_info: {
          lnd,
          id: forward.incoming_channel,
          dontResolveKey: public_key,
        },
        outgoing_channel_info: {
          lnd,
          id: forward.outgoing_channel,
          dontResolveKey: public_key,
        },
      }));

      const forwards = sortBy(list, 'created_at').reverse();
      return {
        token: forwardsList.next,
        forwards,
      };
    },
  },
};
