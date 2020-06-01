import { getForwardChannelsReport } from './resolvers/getForwardChannelsReport';
import { getForwardReport } from './resolvers/getForwardsReport';
import { getInOut } from './resolvers/getInOut';
import { getChannelReport } from './resolvers/getChannelReport';

export const widgetResolvers = {
  Query: {
    getForwardChannelsReport,
    getForwardReport,
    getInOut,
    getChannelReport,
  },
};
