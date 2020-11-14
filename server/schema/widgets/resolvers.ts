import { getForwardChannelsReport } from './resolvers/getForwardChannelsReport';
import { getInOut } from './resolvers/getInOut';
import { getChannelReport } from './resolvers/getChannelReport';

export const widgetResolvers = {
  Query: {
    getForwardChannelsReport,
    getInOut,
    getChannelReport,
  },
};
