import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { getPayments as getLnPayments } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { GetPaymentType } from '../../../schemaTypes/query/info/payments';
import { getAuthLnd, getErrorMsg } from '../../../helpers/helpers';

interface PaymentProps {
    created_at: string;
    destination: string;
    fee: number;
    fee_mtokens: string;
    hops: string[];
    id: string;
    is_confirmed: boolean;
    is_outgoing: boolean;
    mtokens: string;
    request: string;
    secret: string;
    tokens: number;
}

interface PaymentsProps {
    payments: PaymentProps[];
}

export const getPayments = {
    type: new GraphQLList(GetPaymentType),
    args: { auth: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'payments');

        const lnd = getAuthLnd(params.auth);

        try {
            const paymentList: PaymentsProps = await getLnPayments({
                lnd: lnd,
            });

            const payments = paymentList.payments.map(payment => ({
                createdAt: payment.created_at,
                destination: payment.destination,
                fee: payment.fee,
                feeMtokens: payment.fee_mtokens,
                hops: payment.hops,
                id: payment.id,
                isConfirmed: payment.is_confirmed,
                isOutgoing: payment.is_outgoing,
                mtokens: payment.mtokens,
                request: payment.request,
                secret: payment.secret,
                tokens: payment.tokens,
            }));

            return payments;
        } catch (error) {
            logger.error('Error getting payments: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};
