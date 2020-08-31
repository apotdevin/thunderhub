import { getChannels } from 'ln-service';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { to } from 'server/helpers/async';
import { ContextType } from 'server/types/apiTypes';
import { GetChannelsType } from 'server/types/ln-service.types';
import { logger } from 'server/helpers/logger';
import { getAverage } from '../helpers';

const halfMonthInMilliSeconds = 1296000000;

export default async (_: undefined, __: any, context: ContextType) => {
  await requestLimiter(context.ip, 'getTimeHealth');

  const { lnd } = context;

  const { channels } = await to<GetChannelsType>(getChannels({ lnd }));

  const health = channels.map(channel => {
    const {
      time_offline = 1,
      time_online = 1,
      id,
      partner_public_key,
    } = channel;

    const significant = time_offline + time_online > halfMonthInMilliSeconds;

    const defaultProps = {
      id,
      significant,
      monitoredTime: Math.round((time_online + time_offline) / 1000),
      monitoredUptime: Math.round(time_online / 1000),
      monitoredDowntime: Math.round(time_offline / 1000),
      partner: { publicKey: partner_public_key, lnd },
    };

    const percentOnline = time_online / (time_online + time_offline);

    if (isNaN(percentOnline)) {
      logger.debug('percentOnline is NAN');
    }

    Object.entries(defaultProps).forEach(entry => {
      const [key, value] = entry;
      if (isNaN(value as number)) {
        logger.debug(`${key} is NAN (getTimeHealth)`);
      }
    });

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
