import { verifyMessage as verifyLnMessage } from 'ln-service';
import { GraphQLString, GraphQLNonNull } from 'graphql';
import { ContextType } from 'api/types/apiTypes';
import { defaultParams } from '../../../helpers/defaultProps';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from '../../../helpers/helpers';
import { logger } from '../../../helpers/logger';

export const verifyMessage = {
  type: GraphQLString,
  args: {
    ...defaultParams,
    message: { type: new GraphQLNonNull(GraphQLString) },
    signature: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'verifyMessage');

    const auth = getCorrectAuth(params.auth, context);
    const lnd = getAuthLnd(auth);

    try {
      const message: { signed_by: string } = await verifyLnMessage({
        lnd,
        message: params.message,
        signature: params.signature,
      });

      return message.signed_by;
    } catch (error) {
      logger.error('Error verifying message: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
