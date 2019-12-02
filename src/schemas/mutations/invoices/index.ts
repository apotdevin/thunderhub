import { parsePayment } from './parsePayment';
import { pay } from './pay';
import { createInvoice } from './createInvoice';
import { decodeRequest } from './decode';

export const invoices = {
    parsePayment,
    pay,
    createInvoice,
    decodeRequest,
};
