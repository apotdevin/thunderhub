import { getForwards, getChannels, getWalletInfo } from 'ln-service';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { getCorrectAuth, getAuthLnd } from 'server/helpers/helpers';
import { to } from 'server/helpers/async';
import { subMonths } from 'date-fns';
import { ContextType } from 'server/types/apiTypes';
import {
  GetChannelsType,
  GetForwardsType,
} from 'server/types/ln-service.types';
import { getChannelVolume, getChannelIdInfo, getAverage } from '../helpers';

const monthInBlocks = 4380;

export default async (_: undefined, params: any, context: ContextType) => {
  await requestLimiter(context.ip, 'getVolumeHealth');

  const auth = getCorrectAuth(params.auth, context);
  const lnd = getAuthLnd(auth);

  const before = new Date().toISOString();
  const after = subMonths(new Date(), 1).toISOString();

  const { current_block_height } = await to(getWalletInfo({ lnd }));
  const { channels } = await to<GetChannelsType>(getChannels({ lnd }));
  const { forwards } = await to<GetForwardsType>(
    getForwards({ lnd, after, before })
  );

  const channelVolume: { channel: string; tokens: number }[] = getChannelVolume(
    forwards
  );

  const channelDetails = channels
    .map(channel => {
      const { tokens } = channelVolume.find(c => c.channel === channel.id) || {
        tokens: 0,
      };
      const info = getChannelIdInfo(channel.id);

      if (!info) return;

      const age = Math.min(
        current_block_height - info.blockHeight,
        monthInBlocks
      );

      return {
        id: channel.id,
        volume: tokens,
        volumeNormalized: Math.round(tokens / age) || 0,
        publicKey: channel.partner_public_key,
      };
    })
    .filter(Boolean);

  const average = getAverage(channelDetails.map(c => c?.volumeNormalized || 0));

  const health = channelDetails
    .map(channel => {
      if (!channel) return null;
      const diff = (channel.volumeNormalized - average) / average || -1;
      const score = Math.round((diff + 1) * 100);

      return {
        id: channel.id,
        score,
        volumeNormalized: channel.volumeNormalized,
        averageVolumeNormalized: average,
        partner: { publicKey: channel.publicKey, lnd },
      };
    })
    .filter(Boolean);

  const globalAverage = Math.round(
    getAverage(health.map(c => Math.min(c?.score || 0, 100)))
  );

  return { score: globalAverage, channels: health };
};
