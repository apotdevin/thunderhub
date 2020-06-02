import { getChannels } from 'ln-service';
import { getCorrectAuth, getAuthLnd } from 'server/helpers/helpers';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { to } from 'server/helpers/async';
import { ContextType } from 'server/types/apiTypes';
import { getAverage } from '../helpers';

const halfMonthInMilliSeconds = 1296000000;

export default async (_: undefined, params: any, context: ContextType) => {
  await requestLimiter(context.ip, 'getTimeHealth');

  const auth = getCorrectAuth(params.auth, context);
  const lnd = getAuthLnd(auth);

  const { channels } = await to(getChannels({ lnd }));

  const health = channels.map(channel => {
    const {
      time_offline = 1,
      time_online = 1,
      id,
      partner_public_key,
    } = channel;

    const defaultProps = {
      id,
      monitoredTime: (time_online + time_offline) / 1000,
      partner: { publicKey: partner_public_key, lnd },
    };

    if (time_offline + time_online < halfMonthInMilliSeconds) {
      return {
        score: 0,
        ...defaultProps,
      };
    }
    const percentOnline = time_online / (time_online + time_offline);

    return {
      score: Math.round(percentOnline * 100),
      ...defaultProps,
    };
  });

  const average = Math.round(getAverage(health.map(c => c.score)));

  return {
    score: average,
    channels: health,
  };
};
