import { GraphQLNonNull, GraphQLString } from 'graphql';
import { getPayments, getInvoices, getNode } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { getAuthLnd, getErrorMsg } from '../../../helpers/helpers';
import { PaymentsProps, InvoicesProps, NodeProps } from './resume.interface';
import { compareDesc } from 'date-fns';
import { sortBy } from 'underscore';
import { GetResumeType } from '../../../schemaTypes/query/invoices/resume';

export const getResume = {
    type: GetResumeType,
    args: {
        auth: { type: new GraphQLNonNull(GraphQLString) },
        token: { type: GraphQLString },
    },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'payments');

        const lnd = getAuthLnd(params.auth);

        let payments;
        let invoices;

        try {
            const paymentList: PaymentsProps = await getPayments({
                lnd: lnd,
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
                            nodeInfo = { alias: 'unknown' };
                        }
                        return {
                            type: 'payment',
                            alias: nodeInfo.alias,
                            date: payment.created_at,
                            ...payment,
                        };
                    }),
                );
            payments = await getMappedPayments();
        } catch (error) {
            logger.error('Error getting payments: %o', error);
            throw new Error(getErrorMsg(error));
        }

        const invoiceProps = params.token
            ? { token: params.token }
            : { limit: 10 };

        let lastInvoiceDate = '';
        let firstInvoiceDate = '';
        let token = '';
        let withInvoices = true;

        try {
            const invoiceList: InvoicesProps = await getInvoices({
                lnd: lnd,
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

        const filteredPayments = withInvoices
            ? payments.filter(payment => {
                  const last =
                      compareDesc(
                          new Date(lastInvoiceDate),
                          new Date(payment.date),
                      ) === 1;
                  const first =
                      compareDesc(
                          new Date(payment.date),
                          new Date(firstInvoiceDate),
                      ) === 1;
                  return last && first;
              })
            : payments;

        const resumeArray = sortBy(
            [...invoices, ...filteredPayments],
            'date',
        ).reverse();

        return {
            token,
            resume: JSON.stringify(resumeArray),
        };
    },
};
