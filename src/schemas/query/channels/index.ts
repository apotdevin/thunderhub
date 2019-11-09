import { getChannelBalance } from "./channelBalance";
import { getChannels } from "./channels";
import { getClosedChannels } from "./closedChannels";
import { getPendingChannels } from "./pendingChannels";

export const channelQueries = {
  getChannelBalance,
  getChannels,
  getClosedChannels,
  getPendingChannels
};
