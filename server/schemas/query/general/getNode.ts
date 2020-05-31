import { GraphQLString, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import { getNode as getLnNode } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from '../../../helpers/helpers';

import { defaultParams } from '../../../helpers/defaultProps';
import { PartnerNodeType } from '../../types/QueryType';

export const getNode = {
  type: PartnerNodeType,
  args: {
    ...defaultParams,
    publicKey: { type: new GraphQLNonNull(GraphQLString) },
    withoutChannels: { type: GraphQLBoolean },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'closedChannels');

    const auth = getCorrectAuth(params.auth, context);
    const lnd = getAuthLnd(auth);

    try {
      const nodeInfo = await getLnNode({
        lnd,
        is_omitting_channels: params.withoutChannels ?? true,
        public_key: params.publicKey,
      });
      return nodeInfo;
    } catch (error) {
      logger.error('Error getting closed channels: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
