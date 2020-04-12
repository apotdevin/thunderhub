import { getChannelBalance } from './channelBalance';
import { getChannels } from './channels';
import { getClosedChannels } from './closedChannels';
import { getPendingChannels } from './pendingChannels';
import { getChannelFees } from './channelFees';
import { getChannelReport } from './channelReport';

export const channelQueries = {
  getChannelBalance,
  getChannels,
  getClosedChannels,
  getPendingChannels,
  getChannelFees,
  getChannelReport,
};
