import { GraphQLString, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import { getNode as getLnNode } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { getErrorMsg, getAuthLnd } from '../../../helpers/helpers';

import { defaultParams } from '../../../helpers/defaultProps';
import { PartnerNodeType } from '../../types/QueryType';

export const getNode = {
  type: PartnerNodeType,
  args: {
    ...defaultParams,
    publicKey: { type: new GraphQLNonNull(GraphQLString) },
    withoutChannels: { type: GraphQLBoolean },
  },
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, 'closedChannels');

    const lnd = getAuthLnd(params.auth);

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
