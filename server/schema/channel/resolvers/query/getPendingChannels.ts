import { getPendingChannels as getLnPendingChannels } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { to } from 'server/helpers/async';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { GetPendingChannelsType } from 'server/types/ln-service.types';

export const getPendingChannels = async (
  _: undefined,
  __: undefined,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'pendingChannels');

  const { lnd } = context;

  const { pending_channels } = await to<GetPendingChannelsType>(
    getLnPendingChannels({ lnd })
  );

  return pending_channels.map(channel => ({
    ...channel,
    partner_node_info: {
      lnd,
      publicKey: channel.partner_public_key,
    },
  }));
};
