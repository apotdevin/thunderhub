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
};
