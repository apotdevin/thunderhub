import { signMessage as signLnMessage } from 'ln-service';
import { GraphQLString, GraphQLNonNull } from 'graphql';
import { ContextType } from 'server/types/apiTypes';
import { defaultParams } from '../../../helpers/defaultProps';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from '../../../helpers/helpers';
import { logger } from '../../../helpers/logger';

export const signMessage = {
  type: GraphQLString,
  args: {
    ...defaultParams,
    message: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'signMessage');

    const auth = getCorrectAuth(params.auth, context);
    const lnd = getAuthLnd(auth);

    try {
      const message: { signature: string } = await signLnMessage({
        lnd,
        message: params.message,
      });

      return message.signature;
    } catch (error) {
      logger.error('Error signing message: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
