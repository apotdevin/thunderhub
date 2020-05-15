import { removePeer as removeLnPeer } from 'ln-service';
import { GraphQLBoolean, GraphQLString, GraphQLNonNull } from 'graphql';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';

export const removePeer = {
  type: GraphQLBoolean,
  args: {
    ...defaultParams,
    publicKey: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, 'removePeer');

    const auth = getCorrectAuth(params.auth, context.sso);
    const lnd = getAuthLnd(auth);

    try {
      const success: boolean = await removeLnPeer({
        lnd,
        public_key: params.publicKey,
      });
      return success;
    } catch (error) {
      logger.error('Error removing peer: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
