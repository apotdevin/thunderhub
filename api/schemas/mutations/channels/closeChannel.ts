import { closeChannel as lnCloseChannel } from 'ln-service';
import {
  GraphQLBoolean,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';
import { CloseChannelType } from '../../types/MutationType';

interface CloseChannelProps {
  transaction_id: string;
  transaction_vout: string;
}

export const closeChannel = {
  type: CloseChannelType,
  args: {
    ...defaultParams,
    id: { type: new GraphQLNonNull(GraphQLString) },
    forceClose: { type: GraphQLBoolean },
    targetConfirmations: { type: GraphQLInt },
    tokensPerVByte: { type: GraphQLInt },
  },
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, 'closeChannel');

    const auth = getCorrectAuth(params.auth, context.sso);
    const lnd = getAuthLnd(auth);

    try {
      const info: CloseChannelProps = await lnCloseChannel({
        lnd,
        id: params.id,
        target_confirmations: params.targetConfirmations,
        tokens_per_vbyte: params.tokensPerVByte,
        is_force_close: params.forceClose,
      });
      return {
        transactionId: info.transaction_id,
        transactionOutputIndex: info.transaction_vout,
      };
    } catch (error) {
      logger.error('Error closing channel: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
