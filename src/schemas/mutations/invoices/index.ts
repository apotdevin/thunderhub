import { parsePayment } from './parsePayment';
import { pay } from './pay';
import { createInvoice } from './createInvoice';
import { decodeRequest } from './decode';
import { payViaRoute } from './payViaRoute';

export const invoices = {
    parsePayment,
    pay,
    createInvoice,
    decodeRequest,
    payViaRoute,
};
