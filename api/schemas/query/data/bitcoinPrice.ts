import { GraphQLString, GraphQLBoolean } from 'graphql';
import fetch from 'node-fetch';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { appUrls } from '../../../utils/appUrls';

export const getBitcoinPrice = {
  type: GraphQLString,
  args: {
    logger: { type: GraphQLBoolean },
    currency: {
      type: GraphQLString,
    },
  },
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, 'bitcoinPrice');

    try {
      const response = await fetch(appUrls.ticker);
      const json = await response.json();

      return JSON.stringify(json);
    } catch (error) {
      logger.error('Error getting bitcoin price: %o', error);
      throw new Error('Problem getting Bitcoin price.');
    }
  },
};
