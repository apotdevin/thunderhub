import { addPeer as addLnPeer } from 'ln-service';
import { GraphQLBoolean, GraphQLString, GraphQLNonNull } from 'graphql';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';
import { ContextType } from 'api/types/apiTypes';

export const addPeer = {
  type: GraphQLBoolean,
  args: {
    ...defaultParams,
    publicKey: { type: new GraphQLNonNull(GraphQLString) },
    socket: { type: new GraphQLNonNull(GraphQLString) },
    isTemporary: { type: GraphQLBoolean },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'addPeer');

    const auth = getCorrectAuth(params.auth, context.sso);
    const lnd = getAuthLnd(auth);

    try {
      const success: boolean = await addLnPeer({
        lnd,
        public_key: params.publicKey,
        socket: params.socket,
        is_temporary: params.isTemporary,
      });
      return success;
    } catch (error) {
      logger.error('Error adding peer: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
