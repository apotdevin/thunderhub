import { updateRoutingFees } from 'ln-service';
import {
  GraphQLBoolean,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
} from 'graphql';
import { ContextType } from 'server/types/apiTypes';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
  getErrorMsg,
  getAuthLnd,
  getCorrectAuth,
} from '../../../helpers/helpers';

import { defaultParams } from '../../../helpers/defaultProps';

export const updateFees = {
  type: GraphQLBoolean,
  args: {
    ...defaultParams,
    transactionId: { type: GraphQLString },
    transactionVout: { type: GraphQLInt },
    baseFee: { type: GraphQLFloat },
    feeRate: { type: GraphQLInt },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'updateFees');

    const { transactionId, transactionVout, baseFee, feeRate } = params;

    const auth = getCorrectAuth(params.auth, context);
    const lnd = getAuthLnd(auth);

    if (!baseFee && !feeRate) {
      throw new Error('No Base Fee or Fee Rate to update channels');
    }

    const props = {
      lnd,
      transaction_id: transactionId,
      transaction_vout: transactionVout,
      ...(params.baseFee && { base_fee_tokens: params.baseFee }),
      ...(params.feeRate && { fee_rate: params.feeRate }),
    };

    try {
      await updateRoutingFees(props);
      return true;
    } catch (error) {
      logger.error('Error updating routing fees: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
