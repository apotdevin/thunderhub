import { getPayments, getInvoices } from 'ln-service';
import { compareDesc } from 'date-fns';
import { sortBy } from 'underscore';
import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { to } from 'server/helpers/async';
import {
  GetInvoicesType,
  GetPaymentsType,
  InvoiceType,
  PaymentType,
} from 'server/types/ln-service.types';

type TransactionType = InvoiceType | PaymentType;
type TransactionWithType = { isTypeOf: string } & TransactionType;

export const transactionResolvers = {
  Query: {
    getResume: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'payments');

      const { lnd } = context;

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
        token = invoiceList.next || '';
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
  },
  Transaction: {
    __resolveType(parent: TransactionWithType) {
      return parent.isTypeOf;
    },
  },
};
