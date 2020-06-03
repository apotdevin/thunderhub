import { logger } from 'server/helpers/logger';
import { toWithError } from 'server/helpers/async';
import { getChannel } from 'ln-service';
import { openChannel } from './resolvers/mutation/openChannel';
import { closeChannel } from './resolvers/mutation/closeChannel';
import { updateFees } from './resolvers/mutation/updateFees';
import { getChannelBalance } from './resolvers/query/getChannelBalance';
import { getChannelFees } from './resolvers/query/getChannelFees';
import { getChannels } from './resolvers/query/getChannels';
import { getClosedChannels } from './resolvers/query/getClosedChannels';
import { getPendingChannels } from './resolvers/query/getPendingChannels';

export const channelResolvers = {
  Query: {
    getChannelBalance,
    getChannelFees,
    getChannels,
    getClosedChannels,
    getPendingChannels,
  },
  Mutation: {
    openChannel,
    closeChannel,
    updateFees,
  },
  Channel: {
    channel: async parent => {
      const { lnd, id, withNodes = true, localKey, dontResolveKey } = parent;

      if (!lnd) {
        logger.debug('ExpectedLNDToGetChannel');
        return null;
      }

      if (!id) {
        logger.debug('ExpectedIdToGetChannel');
        return null;
      }

      const [channel, error] = await toWithError(getChannel({ lnd, id }));

      if (error) {
        logger.debug(`Error getting channel with id ${id}: %o, error`);
        return null;
      }

      const nodeProps = (publicKey: string) =>
        withNodes ? { node: { lnd, publicKey } } : {};

      const policiesWithNodes = channel.policies
        .map(policy => {
          if (dontResolveKey && dontResolveKey === policy.public_key) {
            return null;
          }
          return {
            ...policy,
            ...nodeProps(policy.public_key),
            ...(localKey ? { my_node: policy.public_key === localKey } : {}),
          };
        })
        .filter(Boolean);

      return { ...channel, policies: policiesWithNodes };
    },
  },
};
