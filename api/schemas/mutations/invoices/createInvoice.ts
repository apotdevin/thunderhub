import { createInvoice as createInvoiceRequest } from 'ln-service';
import { GraphQLNonNull, GraphQLInt } from 'graphql';
import { ContextType } from 'api/types/apiTypes';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';
import { InvoiceType } from '../../types/MutationType';

interface InvoiceProps {
  chain_address: string;
  created_at: string;
  description: string;
  id: string;
  request: string;
  secret: string;
  tokens: number;
}

export const createInvoice = {
  type: InvoiceType,
  args: {
    ...defaultParams,
    amount: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'createInvoice');

    const auth = getCorrectAuth(params.auth, context);
    const lnd = getAuthLnd(auth);

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
