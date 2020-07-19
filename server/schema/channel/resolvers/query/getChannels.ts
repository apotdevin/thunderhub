import { getChannels as getLnChannels, getWalletInfo } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { to } from 'server/helpers/async';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { getAuthLnd, getCorrectAuth } from 'server/helpers/helpers';
import { getChannelAge } from 'server/schema/health/helpers';
import { GetChannelsType } from 'server/types/ln-service.types';

export const getChannels = async (
  _: undefined,
  params: any,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'channels');

  const auth = getCorrectAuth(params.auth, context);
  const lnd = getAuthLnd(auth);

  const { public_key, current_block_height } = await to(getWalletInfo({ lnd }));

  const { channels } = await to<GetChannelsType>(
    getLnChannels({
      lnd,
      is_active: params.active,
    })
  );

  return channels.map(channel => ({
    ...channel,
    time_offline: Math.round((channel.time_offline || 0) / 1000),
    time_online: Math.round((channel.time_online || 0) / 1000),
    partner_node_info: { lnd, publicKey: channel.partner_public_key },
    partner_fee_info: { lnd, id: channel.id, localKey: public_key },
    channel_age: getChannelAge(channel.id, current_block_height),
  }));
};
