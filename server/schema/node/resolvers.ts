import {
  getNode as getLnNode,
  getWalletInfo,
  getClosedChannels,
} from 'ln-service';
import { to, toWithError } from 'server/helpers/async';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { getAuthLnd, getErrorMsg, getCorrectAuth } from '../../helpers/helpers';
import { ContextType } from '../../types/apiTypes';
import { logger } from '../../helpers/logger';

export const nodeResolvers = {
  Query: {
    getNode: async (_: undefined, params: any, context: ContextType) => {
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
    getNodeInfo: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'nodeInfo');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      const info = await to(
        getWalletInfo({
          lnd,
        })
      );

      const closedChannels = await to(
        getClosedChannels({
          lnd,
        })
      );

      return {
        ...info,
        closed_channels_count: closedChannels?.channels?.length || 0,
      };
    },
  },
  Node: {
    node: async parent => {
      const { lnd, withChannels, publicKey } = parent;

      if (!lnd) {
        logger.debug('ExpectedLNDToGetNode');
        return null;
      }

      if (!publicKey) {
        logger.debug('ExpectedPublicKeyToGetNode');
        return null;
      }

      const [info, error] = await toWithError(
        getLnNode({
          lnd,
          is_omitting_channels: !withChannels,
          public_key: publicKey,
        })
      );

      if (error) {
        logger.debug(`Error getting node with key: ${publicKey}`);
        return null;
      }

      return info;
    },
  },
};
