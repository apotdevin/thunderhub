import { GraphQLBoolean } from 'graphql';
import fetch from 'node-fetch';
import { ContextType } from 'api/types/apiTypes';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { BitcoinFeeType } from '../../types/QueryType';
import { appUrls } from '../../../utils/appUrls';

export const getBitcoinFees = {
  type: BitcoinFeeType,
  args: {
    logger: { type: GraphQLBoolean },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'bitcoinFee');

    try {
      const response = await fetch(appUrls.fees);
      const json = await response.json();

      if (json) {
        const { fastestFee, halfHourFee, hourFee } = json;
        return {
          fast: fastestFee,
          halfHour: halfHourFee,
          hour: hourFee,
        };
      }
      throw new Error('Problem getting Bitcoin fees.');
    } catch (error) {
      logger.error('Error getting bitcoin fees: %o', error);
      throw new Error('Problem getting Bitcoin fees.');
    }
  },
};
