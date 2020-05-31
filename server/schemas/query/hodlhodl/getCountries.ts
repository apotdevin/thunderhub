import { GraphQLList } from 'graphql';
import getConfig from 'next/config';
import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { logger } from '../../../helpers/logger';
import { appUrls } from '../../../utils/appUrls';
import { HodlCountryType } from '../../types/HodlType';

const { serverRuntimeConfig } = getConfig();
const { hodlKey } = serverRuntimeConfig;

export const getCountries = {
  type: new GraphQLList(HodlCountryType),
  args: {},
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'getCountries');

    const headers = {
      Authorization: `Bearer ${hodlKey}`,
    };

    try {
      const response = await fetch(`${appUrls.hodlhodl}/v1/countries`, {
        headers,
      });
      const json = await response.json();

      if (json) {
        const { countries } = json;
        return countries;
      }
      throw new Error('Problem getting HodlHodl countries.');
    } catch (error) {
      logger.error('Error getting HodlHodl countries: %o', error);
      throw new Error('Problem getting HodlHodl countries.');
    }
  },
};
