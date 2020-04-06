import fetch from 'node-fetch';
import { GraphQLList } from 'graphql';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { logger } from '../../../helpers/logger';
import { appUrls } from '../../../utils/appUrls';
import { HodlCurrencyType } from '../../types/HodlType';
import { envConfig } from '../../../utils/envConfig';

export const getCurrencies = {
    type: new GraphQLList(HodlCurrencyType),
    args: {},
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'getCurrencies');

        const headers = {
            Authorization: `Bearer ${envConfig.hodlKey}`,
        };

        try {
            const response = await fetch(`${appUrls.hodlhodl}/v1/currencies`, {
                headers,
            });
            const json = await response.json();

            if (json) {
                const { currencies } = json;
                return currencies;
            } else {
                throw new Error('Problem getting HodlHodl currencies.');
            }
        } catch (error) {
            params.logger &&
                logger.error('Error getting HodlHodl currencies: %o', error);
            throw new Error('Problem getting HodlHodl currencies.');
        }
    },
};
