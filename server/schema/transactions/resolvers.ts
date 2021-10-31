import { subDays } from 'date-fns';
import { sortBy } from 'lodash';
import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { InvoiceType, PaymentType } from 'server/types/ln-service.types';
import { decodeMessages } from 'server/helpers/customRecords';
import { getInvoicesBetweenDates, getPaymentsBetweenDates } from './helpers';

type TransactionType = InvoiceType | PaymentType;
type TransactionWithType = { isTypeOf: string } & TransactionType;

export const transactionResolvers = {
  Query: {
    getResume: async (
      _: undefined,
      { offset, limit }: { offset?: number; limit?: number },
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'payments');

      const { lnd } = context;

      const start = offset || 0;
      const end = (offset || 0) + (limit || 7);

      const today = new Date();
      const startDate = subDays(today, start).toISOString();
      const endDate = subDays(today, end).toISOString();

      const payments = await getPaymentsBetweenDates({
        lnd,
        from: startDate,
        until: endDate,
      });

      const mappedPayments = payments.map(payment => ({
        ...payment,
        type: 'payment',
        date: payment.created_at,
        destination_node: { lnd, publicKey: payment.destination },
        hops: [...payment.hops.map(hop => ({ lnd, publicKey: hop }))],
        isTypeOf: 'PaymentType',
      }));

      const invoices = await getInvoicesBetweenDates({
        lnd,
        from: startDate,
        until: endDate,
      });

      const mappedInvoices = invoices.map(invoice => ({
        type: 'invoice',
        date: invoice.confirmed_at || invoice.created_at,
        ...invoice,
        isTypeOf: 'InvoiceType',
        payments: invoice.payments.map(p => ({
          ...p,
          messages: decodeMessages(p.messages),
        })),
      }));

      const resume = sortBy(
        [...mappedInvoices, ...mappedPayments],
        'date'
      ).reverse();

      return {
        offset: end,
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
