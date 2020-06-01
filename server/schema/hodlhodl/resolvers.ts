import getConfig from 'next/config';
import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { logger } from 'server/helpers/logger';
import { appUrls } from 'server/utils/appUrls';
import { getHodlParams } from 'server/helpers/hodlHelpers';

const { serverRuntimeConfig } = getConfig();
const { hodlKey } = serverRuntimeConfig;

const defaultQuery = {
  filters: {},
  sort: {
    by: '',
    direction: '',
  },
};

export const hodlResolvers = {
  Query: {
    getCountries: async (_: undefined, params: any, context: ContextType) => {
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
    getCurrencies: async (_: undefined, params: any, context: ContextType) => {
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
    getOffers: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'getOffers');

      let queryParams = defaultQuery;

      if (params.filter) {
        try {
          queryParams = JSON.parse(params.filter);
        } catch (error) {
          queryParams = defaultQuery;
        }
      }

      try {
        const fullParams = {
          ...queryParams,
        };

        const paramString = getHodlParams(fullParams);

        const response = await fetch(
          `${appUrls.hodlhodl}/v1/offers${paramString}`
        );
        const json = await response.json();

        if (json) {
          const { offers } = json;
          return offers;
        }
        throw new Error('Problem getting HodlHodl offers.');
      } catch (error) {
        logger.error('Error getting HodlHodl offers: %o', error);
        throw new Error('Problem getting HodlHodl offers.');
      }
    },
  },
};
