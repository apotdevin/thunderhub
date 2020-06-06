import { getChannels as getLnChannels, getWalletInfo } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { to } from 'server/helpers/async';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { getAuthLnd, getCorrectAuth } from 'server/helpers/helpers';

export const getChannels = async (
  _: undefined,
  params: any,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'channels');

  const auth = getCorrectAuth(params.auth, context);
  const lnd = getAuthLnd(auth);

  const { public_key } = await to(getWalletInfo({ lnd }));

  const { channels } = await to(
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
    partner_fee_info: { lnd, id: channel.id, dontResolveKey: public_key },
  }));
};
