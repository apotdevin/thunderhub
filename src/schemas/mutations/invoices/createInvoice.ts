import { createInvoice as createInvoiceRequest } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { GraphQLNonNull, GraphQLInt } from 'graphql';
import { InvoiceType } from '../../../schemaTypes/mutation.ts/invoice/createInvoice';
import { getErrorMsg, getAuthLnd } from '../../../helpers/helpers';
import { AuthType } from '../../../schemaTypes/Auth';

interface InvoiceProps {
    chain_address: string;
    created_at: string;
    description: string;
    id: string;
    request: string;
    secret: string;
    tokens: number;
}

// TODO: Allow more params
export const createInvoice = {
    type: InvoiceType,
    args: {
        amount: { type: new GraphQLNonNull(GraphQLInt) },
        auth: { type: new GraphQLNonNull(AuthType) },
    },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'createInvoice');

        const lnd = getAuthLnd(params.auth);

        try {
            const invoice: InvoiceProps = await createInvoiceRequest({
                lnd,
                tokens: params.amount,
            });

            return {
                chainAddress: invoice.chain_address,
                createdAt: invoice.created_at,
                description: invoice.description,
                id: invoice.id,
                request: invoice.request,
                secret: invoice.secret,
                tokens: invoice.tokens,
            };
        } catch (error) {
            logger.error('Error creating invoice: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};
