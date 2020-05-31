import { GraphQLList } from 'graphql';
import getConfig from 'next/config';
import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { logger } from '../../../helpers/logger';
import { appUrls } from '../../../utils/appUrls';
import { HodlCurrencyType } from '../../types/HodlType';

const { serverRuntimeConfig } = getConfig();
const { hodlKey } = serverRuntimeConfig;

export const getCurrencies = {
  type: new GraphQLList(HodlCurrencyType),
  args: {},
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'getCurrencies');

    const headers = {
      Authorization: `Bearer ${hodlKey}`,
    };

    try {
      const response = await fetch(`${appUrls.hodlhodl}/v1/currencies`, {
        headers,
      });
      const json = await response.json();

      if (json) {
        const { currencies } = json;
        return currencies;
      }
      throw new Error('Problem getting HodlHodl currencies.');
    } catch (error) {
      logger.error('Error getting HodlHodl currencies: %o', error);
      throw new Error('Problem getting HodlHodl currencies.');
    }
  },
};
