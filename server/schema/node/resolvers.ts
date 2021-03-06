import {
  getNode,
  getWalletInfo,
  getClosedChannels,
  getPendingChannels,
} from 'ln-service';
import { to, toWithError } from 'server/helpers/async';
import { requestLimiter } from 'server/helpers/rateLimiter';
import {
  ClosedChannelsType,
  LndObject,
  GetWalletInfoType,
  GetNodeType,
  GetPendingChannelsType,
} from 'server/types/ln-service.types';
import { ContextType } from '../../types/apiTypes';
import { logger } from '../../helpers/logger';

const errorNode = { alias: 'Node not found' };

type NodeParent = {
  lnd: LndObject;
  publicKey: string;
  withChannels?: boolean;
};

export const nodeResolvers = {
  Query: {
    getNode: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'getNode');

      const { withoutChannels = true, publicKey } = params;
      const { lnd } = context;

      return { lnd, publicKey, withChannels: !withoutChannels };
    },
    getNodeInfo: async (_: undefined, __: undefined, context: ContextType) => {
      await requestLimiter(context.ip, 'nodeInfo');

      const { lnd } = context;

      const info = await to<GetWalletInfoType>(
        getWalletInfo({
          lnd,
        })
      );

      const closedChannels: ClosedChannelsType = await to(
        getClosedChannels({
          lnd,
        })
      );

      const { pending_channels } = await to<GetPendingChannelsType>(
        getPendingChannels({ lnd })
      );

      const pending_channels_count = pending_channels.length;

      return {
        ...info,
        pending_channels_count,
        closed_channels_count: closedChannels?.channels?.length || 0,
      };
    },
  },

  Node: {
    node: async (parent: NodeParent) => {
      const { lnd, withChannels, publicKey } = parent;

      if (!lnd) {
        logger.debug('ExpectedLNDToGetNode');
        return errorNode;
      }

      if (!publicKey) {
        logger.debug('ExpectedPublicKeyToGetNode');
        return errorNode;
      }

      const [info, error] = await toWithError(
        getNode({
          lnd,
          is_omitting_channels: !withChannels,
          public_key: publicKey,
        })
      );

      if (error || !info) {
        logger.debug(`Error getting node with key: ${publicKey}`);
        return errorNode;
      }

      return { ...(info as GetNodeType), public_key: publicKey };
    },
  },
};
