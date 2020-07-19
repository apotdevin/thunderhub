import {
  getPayments,
  getInvoices,
  getForwards as getLnForwards,
  getWalletInfo,
} from 'ln-service';
import { compareDesc, subHours, subDays, subMonths, subYears } from 'date-fns';
import { sortBy } from 'underscore';
import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { getAuthLnd, getCorrectAuth } from 'server/helpers/helpers';
import { to } from 'server/helpers/async';
import {
  GetInvoicesType,
  GetPaymentsType,
  InvoiceType,
  PaymentType,
} from 'server/types/ln-service.types';
import { ForwardCompleteProps } from '../widgets/resolvers/interface';

type TransactionType = InvoiceType | PaymentType;
type TransactionWithType = { isTypeOf: string } & TransactionType;

export const transactionResolvers = {
  Query: {
    getResume: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'payments');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      const invoiceProps = params.token
        ? { token: params.token }
        : { limit: 25 };

      let lastInvoiceDate = '';
      let firstInvoiceDate = '';
      let token = '';
      let withInvoices = true;

      const invoiceList = await to<GetInvoicesType>(
        getInvoices({
          lnd,
          ...invoiceProps,
        })
      );

      const invoices = invoiceList.invoices.map(invoice => {
        return {
          type: 'invoice',
          date: invoice.confirmed_at || invoice.created_at,
          ...invoice,
          isTypeOf: 'InvoiceType',
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

      const paymentList = await to<GetPaymentsType>(
        getPayments({
          lnd,
        })
      );

      const payments = paymentList.payments.map(payment => ({
        ...payment,
        type: 'payment',
        date: payment.created_at,
        destination_node: { lnd, publicKey: payment.destination },
        hops: [...payment.hops.map(hop => ({ lnd, publicKey: hop }))],
        isTypeOf: 'PaymentType',
      }));

      const filterArray = (payment: typeof payments[number]) => {
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

      const resume = sortBy(
        [...invoices, ...filteredPayments],
        'date'
      ).reverse();

      return {
        token,
        resume,
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
          localKey: public_key,
        },
        outgoing_channel_info: {
          lnd,
          id: forward.outgoing_channel,
          localKey: public_key,
        },
      }));

      const forwards = sortBy(list, 'created_at').reverse();
      return {
        token: forwardsList.next,
        forwards,
      };
    },
  },
  Transaction: {
    __resolveType(parent: TransactionWithType) {
      return parent.isTypeOf;
    },
  },
};
