import { updateRoutingFees } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { GraphQLBoolean, GraphQLString, GraphQLInt } from 'graphql';
import { getErrorMsg, getAuthLnd } from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';

export const updateFees = {
  type: GraphQLBoolean,
  args: {
    ...defaultParams,
    transactionId: { type: GraphQLString },
    transactionVout: { type: GraphQLInt },
    baseFee: { type: GraphQLInt },
    feeRate: { type: GraphQLInt },
  },
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, 'updateFees');

    const { auth, transactionId, transactionVout, baseFee, feeRate } = params;

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
      params.logger && logger.error('Error updating routing fees: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
