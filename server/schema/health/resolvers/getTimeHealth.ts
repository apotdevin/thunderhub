import { getChannels } from 'ln-service';
import { getCorrectAuth, getAuthLnd } from 'server/helpers/helpers';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { to } from 'server/helpers/async';
import { getAverage } from '../helpers';

const halfMonthInMilliSeconds = 1296000000;

export default async (_: undefined, params: any, context: ContextType) => {
  await requestLimiter(context.ip, 'getVolumeHealth');

  const auth = getCorrectAuth(params.auth, context);
  const lnd = getAuthLnd(auth);

  const { channels } = await to(getChannels({ lnd }));

  const health = channels.map(channel => {
    const { time_offline = 1, time_online = 1, id } = channel;
    if (time_offline + time_online < halfMonthInMilliSeconds) {
      return { id, score: 0 };
    }
    const percentOnline = time_online / (time_online + time_offline);

    return {
      id,
      score: Math.round(percentOnline * 100),
    };
  });

  const average = Math.round(getAverage(health.map(c => c.score)));

  return {
    score: average,
    channels: health,
  };
};
