import { GraphQLString } from 'graphql';
import {
    getInvoices as getLnInvoices,
    getPayments as getLnPayments,
} from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { getAuthLnd, getErrorMsg } from '../../../helpers/helpers';
import { differenceInHours, differenceInCalendarDays } from 'date-fns';
import { groupBy } from 'underscore';
import { reduceInOutArray } from '../report/Helpers';
import { InvoicesProps, PaymentsProps } from './getInOut.interface';
import { defaultParams } from '../../../helpers/defaultProps';
import { InOutType } from '../../types/QueryType';

export const getInOut = {
    type: InOutType,
    args: {
        ...defaultParams,
        time: { type: GraphQLString },
    },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'getInOut');

        const lnd = getAuthLnd(params.auth);

        const endDate = new Date();
        let periods = 7;
        let differenceFn = differenceInCalendarDays;

        if (params.time === 'month') {
            periods = 30;
        } else if (params.time === 'day') {
            periods = 24;
            differenceFn = differenceInHours;
        }

        let invoiceList: InvoicesProps;
        let paymentList: PaymentsProps;

        try {
            invoiceList = await getLnInvoices({
                lnd,
            });
            paymentList = await getLnPayments({
                lnd,
            });
        } catch (error) {
            params.logger && logger.error('Error getting invoices: %o', error);
            throw new Error(getErrorMsg(error));
        }

        const invoices = invoiceList.invoices.map((invoice) => ({
            createdAt: invoice.created_at,
            isConfirmed: invoice.is_confirmed,
            tokens: invoice.received,
        }));

        const payments = paymentList.payments.map((payment) => ({
            createdAt: payment.created_at,
            isConfirmed: payment.is_confirmed,
            tokens: payment.tokens,
        }));

        const confirmedInvoices = invoices.filter((invoice) => {
            const dif = differenceFn(endDate, new Date(invoice.createdAt));
            return invoice.isConfirmed && dif < periods;
        });
        const confirmedPayments = payments.filter((payment) => {
            const dif = differenceFn(endDate, new Date(payment.createdAt));
            return payment.isConfirmed && dif < periods;
        });

        const allInvoices = invoices.filter((invoice) => {
            const dif = differenceFn(endDate, new Date(invoice.createdAt));
            return dif < periods;
        });

        const totalConfirmed = confirmedInvoices.length;
        const totalUnConfirmed = allInvoices.length - totalConfirmed;

        const orderedInvoices = groupBy(confirmedInvoices, (invoice) => {
            return periods - differenceFn(endDate, new Date(invoice.createdAt));
        });
        const orderedPayments = groupBy(confirmedPayments, (payment) => {
            return periods - differenceFn(endDate, new Date(payment.createdAt));
        });

        const reducedInvoices = reduceInOutArray(orderedInvoices);
        const reducedPayments = reduceInOutArray(orderedPayments);

        return {
            invoices: JSON.stringify(reducedInvoices),
            payments: JSON.stringify(reducedPayments),
            confirmedInvoices: totalConfirmed,
            unConfirmedInvoices: totalUnConfirmed,
        };
    },
};
