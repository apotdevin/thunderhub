import { Injectable } from '@nestjs/common';
import { NodeService } from '../../node/node.service';
import { compareDesc } from 'date-fns';
import { Invoice, Payment } from '../../node/lnd/lnd.types';

// Limit the amount of transactions that are fetched
const FETCH_LIMIT = 50000;
const BATCH_SIZE = 250;

@Injectable()
export class TransactionsService {
  constructor(private nodeService: NodeService) {}

  async getPaymentsBetweenDates(id: string, from?: string, until?: string) {
    const paymentList = await this.nodeService.getPayments(id, {
      limit: BATCH_SIZE,
    });

    if (!paymentList?.payments?.length) {
      return [];
    }

    if (!from || !until) {
      return paymentList.payments;
    }

    const firstPayment = paymentList.payments[0];

    const isOutOf =
      compareDesc(new Date(firstPayment.created_at), new Date(until)) === 1;

    const filterArray = (payment: Payment) => {
      const date = payment.created_at;
      const last = compareDesc(new Date(until), new Date(date)) === 1;
      const first = compareDesc(new Date(date), new Date(from)) === 1;

      return last && first;
    };

    if (isOutOf || paymentList.payments.length < BATCH_SIZE) {
      return paymentList.payments.filter(filterArray);
    }

    let completePayments = paymentList.payments;
    let nextToken = paymentList.next;

    let finished = false;

    while (!finished) {
      if (completePayments.length >= FETCH_LIMIT) {
        finished = true;
        break;
      }

      const newPayments = await this.nodeService.getPayments(id, {
        token: nextToken,
      });

      if (!newPayments?.payments?.length) {
        finished = true;
        break;
      }

      completePayments = [...completePayments, ...newPayments.payments];

      const firstPayment = newPayments.payments[0];

      if (
        compareDesc(new Date(firstPayment.created_at), new Date(until)) === 1
      ) {
        finished = true;
        break;
      }

      if (!newPayments.next) {
        finished = true;
        break;
      }

      nextToken = newPayments.next;
    }

    return completePayments.filter(filterArray);
  }

  async getInvoicesBetweenDates(id: string, from?: string, until?: string) {
    const invoiceList = await this.nodeService.getInvoices(id, {
      limit: BATCH_SIZE,
    });

    if (!invoiceList?.invoices?.length) {
      return [];
    }

    if (!from || !until) {
      return invoiceList.invoices;
    }

    const firstInvoice = invoiceList.invoices[0];
    const firstDate = firstInvoice.confirmed_at || firstInvoice.created_at;

    const isOutOf = compareDesc(new Date(firstDate), new Date(until)) === 1;

    const filterArray = (invoice: Invoice) => {
      const date = invoice.confirmed_at || invoice.created_at;
      const last = compareDesc(new Date(until), new Date(date)) === 1;
      const first = compareDesc(new Date(date), new Date(from)) === 1;

      return last && first;
    };

    if (isOutOf || invoiceList.invoices.length < BATCH_SIZE) {
      return invoiceList.invoices.filter(filterArray);
    }

    let completeInvoices = invoiceList.invoices;
    let nextToken = invoiceList.next;

    let finished = false;

    while (!finished) {
      if (completeInvoices.length >= FETCH_LIMIT) {
        finished = true;
        break;
      }

      const newInvoices = await this.nodeService.getInvoices(id, {
        token: nextToken,
      });

      if (!newInvoices?.invoices?.length) {
        finished = true;
        break;
      }

      completeInvoices = [...completeInvoices, ...newInvoices.invoices];

      const firstNewInvoice = newInvoices.invoices[0];
      const firstNewDate =
        firstNewInvoice.confirmed_at || firstNewInvoice.created_at;

      if (compareDesc(new Date(firstNewDate), new Date(until)) === 1) {
        finished = true;
        break;
      }

      if (!newInvoices.next) {
        finished = true;
        break;
      }

      nextToken = newInvoices.next;
    }

    return completeInvoices.filter(filterArray);
  }
}
