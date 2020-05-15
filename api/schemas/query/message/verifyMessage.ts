import { verifyMessage as verifyLnMessage } from 'ln-service';
import { GraphQLString, GraphQLNonNull } from 'graphql';
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
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, 'verifyMessage');

    const auth = getCorrectAuth(params.auth, context.sso);
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
