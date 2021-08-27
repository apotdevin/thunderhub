import { ContextType } from 'server/types/apiTypes';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { appUrls } from 'server/utils/appUrls';
import { fetchWithProxy } from 'server/utils/fetch';

export const bitcoinResolvers = {
  Query: {
    getBitcoinPrice: async (
      _: undefined,
      __: undefined,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'bitcoinPrice');

      try {
        const response = await fetchWithProxy(appUrls.ticker);
        const json = await response.json();

        return JSON.stringify(json);
      } catch (error: any) {
        logger.error('Error getting bitcoin price: %o', error);
        throw new Error('Problem getting Bitcoin price.');
      }
    },
    getBitcoinFees: async (
      _: undefined,
      __: undefined,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'bitcoinFee');

      try {
        const response = await fetchWithProxy(appUrls.fees);
        const json = await response.json();

        if (json) {
          const { fastestFee, halfHourFee, hourFee, minimumFee } = json;
          return {
            fast: fastestFee,
            halfHour: halfHourFee,
            hour: hourFee,
            minimum: minimumFee,
          };
        }
        throw new Error('Problem getting Bitcoin fees.');
      } catch (error: any) {
        logger.error('Error getting bitcoin fees: %o', error);
        throw new Error('Problem getting Bitcoin fees.');
      }
    },
  },
};
