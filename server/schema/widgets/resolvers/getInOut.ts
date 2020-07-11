import { getInvoices, getPayments } from 'ln-service';
import { differenceInHours, differenceInCalendarDays } from 'date-fns';
import { groupBy } from 'underscore';
import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { getAuthLnd, getCorrectAuth } from 'server/helpers/helpers';
import { to } from 'server/helpers/async';
import { reduceInOutArray } from './helpers';

export const getInOut = async (
  _: undefined,
  params: any,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'getInOut');

  const auth = getCorrectAuth(params.auth, context);
  const lnd = getAuthLnd(auth);

  const endDate = new Date();
  let periods = 7;
  let difference = (date: string) =>
    differenceInCalendarDays(endDate, new Date(date));

  if (params.time === 'year') {
    periods = 360;
  } else if (params.time === 'half_year') {
    periods = 180;
  } else if (params.time === 'quarter_year') {
    periods = 90;
  } else if (params.time === 'month') {
    periods = 150;
  } else if (params.time === 'day') {
    periods = 24;
    difference = (date: string) => differenceInHours(endDate, new Date(date));
  }

  const invoiceList = await to(getInvoices({ lnd, limit: 50 }));
  const paymentList = await to(getPayments({ lnd }));

  let invoiceArray = invoiceList.invoices;
  let next = invoiceList.next;
  let finishedFetching = false;

  if (!next || !invoiceArray || invoiceArray.length <= 0) {
    finishedFetching = true;
  }

  while (!finishedFetching) {
    const lastInvoice = invoiceArray[invoiceArray.length - 1];
    const dif = difference(lastInvoice.created_at);

    if (next && dif < periods) {
      const newInvoices = await to(getInvoices({ lnd, token: next }));
      invoiceArray = [...invoiceArray, ...newInvoices.invoices];
      next = newInvoices.next;
    } else {
      finishedFetching = true;
    }
  }

  const allInvoices = invoiceArray.filter(
    i => difference(i.created_at) < periods
  );

  const invoices = allInvoices
    .filter(i => i.is_confirmed)
    .map(i => ({ tokens: i.received, created_at: i.created_at }));

  const payments = paymentList.payments
    .filter(p => p.is_confirmed && difference(p.created_at) < periods)
    .map(p => ({ tokens: p.tokens, created_at: p.created_at }));

  const totalConfirmed = invoices.length;
  const totalUnConfirmed = allInvoices.length - totalConfirmed;

  const orderedInvoices = groupBy(
    invoices,
    invoice => periods - difference(invoice.created_at)
  );
  const orderedPayments = groupBy(
    payments,
    payment => periods - difference(payment.created_at)
  );

  const reducedInvoices = reduceInOutArray(orderedInvoices);
  const reducedPayments = reduceInOutArray(orderedPayments);

  return {
    invoices: JSON.stringify(reducedInvoices),
    payments: JSON.stringify(reducedPayments),
    confirmedInvoices: totalConfirmed,
    unConfirmedInvoices: totalUnConfirmed,
  };
};
