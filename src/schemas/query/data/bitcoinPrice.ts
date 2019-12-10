import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { GraphQLString } from 'graphql';
import { BitcoinPriceType } from '../../../schemaTypes/query/data/bitcoinPrice';
import fetch from 'node-fetch';

const url = 'https://blockchain.info/ticker';

export const getBitcoinPrice = {
    type: BitcoinPriceType,
    args: {
        currency: {
            type: GraphQLString,
        },
    },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'bitcoinPrice');

        try {
            const response = await fetch(url);
            const json = await response.json();

            if (!params.currency && 'EUR' in json) {
                const value = json.EUR;

                return {
                    price: value.last,
                    symbol: value.symbol,
                };
            } else if (params.currency in json) {
                const value = json[params.currency];

                return {
                    price: value.last,
                    symbol: value.symbol,
                };
            } else {
                throw new Error('Problem getting Bitcoin price.');
            }
        } catch (error) {
            logger.error('Error getting bitcoin price: %o', error);
            throw new Error('Problem getting Bitcoin price.');
        }
    },
};
