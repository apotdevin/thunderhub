import { parsePayment } from './parsePayment';
import { pay } from './pay';
import { createInvoice } from './createInvoice';
import { payViaRoute } from './payViaRoute';

export const invoices = {
  parsePayment,
  pay,
  createInvoice,
  payViaRoute,
};
