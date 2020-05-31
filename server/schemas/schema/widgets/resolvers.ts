import { getForwardChannelsReport } from './resolvers/getForwardChannelsReport';
import { getForwardsReport } from './resolvers/getForwardsReport';
import { getInOut } from './resolvers/getInOut';
import { getChannelReport } from './resolvers/getChannelReport';

export const widgetResolvers = {
  Query: {
    getForwardChannelsReport,
    getForwardsReport,
    getInOut,
    getChannelReport,
  },
};
