import { addPeer as addLnPeer } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { GraphQLBoolean, GraphQLString, GraphQLNonNull } from 'graphql';
import { getErrorMsg, getAuthLnd } from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';

export const addPeer = {
  type: GraphQLBoolean,
  args: {
    ...defaultParams,
    publicKey: { type: new GraphQLNonNull(GraphQLString) },
    socket: { type: new GraphQLNonNull(GraphQLString) },
    isTemporary: { type: GraphQLBoolean },
  },
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, 'addPeer');

    const lnd = getAuthLnd(params.auth);

    try {
      const success: boolean = await addLnPeer({
        lnd,
        public_key: params.publicKey,
        socket: params.socket,
        is_temporary: params.isTemporary,
      });
      return success;
    } catch (error) {
      params.logger && logger.error('Error adding peer: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
