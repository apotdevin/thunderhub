import { getForwards, getChannels, getWalletInfo } from 'ln-service';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { getCorrectAuth, getAuthLnd } from 'server/helpers/helpers';
import { to } from 'server/helpers/async';
import { subMonths } from 'date-fns';
import { ContextType } from 'server/types/apiTypes';
import { getChannelVolume, getChannelIdInfo, getAverage } from '../helpers';

const monthInBlocks = 4380;

export default async (_: undefined, params: any, context: ContextType) => {
  await requestLimiter(context.ip, 'getVolumeHealth');

  const auth = getCorrectAuth(params.auth, context);
  const lnd = getAuthLnd(auth);

  const before = new Date().toISOString();
  const after = subMonths(new Date(), 1).toISOString();

  const { current_block_height } = await to(getWalletInfo({ lnd }));
  const { channels } = await to(getChannels({ lnd }));
  const { forwards } = await to(getForwards({ lnd, after, before }));

  const channelVolume = getChannelVolume(forwards);

  const channelDetails = channels
    .map(channel => {
      const { tokens } = channelVolume.find(c => c.channel === channel.id);
      const info = getChannelIdInfo(channel.id);
      const age = Math.min(
        current_block_height - info.blockHeight,
        monthInBlocks
      );

      if (!info) return;

      return {
        id: channel.id,
        volumeNormalized: tokens / age,
        publicKey: channel.partner_public_key,
      };
    })
    .filter(Boolean);

  const average = getAverage(channelDetails.map(c => c.volumeNormalized));

  const health = channelDetails.map(channel => {
    const diff = (channel.volumeNormalized - average) / average;
    const score = Math.round((diff + 1) * 100);

    return {
      id: channel.id,
      score,
      partner: { publicKey: channel.publicKey, lnd },
    };
  });

  const globalAverage = Math.round(
    getAverage(health.map(c => Math.min(c.score, 100)))
  );

  return { score: globalAverage, channels: health };
};
