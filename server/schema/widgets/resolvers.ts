import { getInOut } from './resolvers/getInOut';
import { getChannelReport } from './resolvers/getChannelReport';

export const widgetResolvers = {
  Query: {
    getInOut,
    getChannelReport,
  },
};
