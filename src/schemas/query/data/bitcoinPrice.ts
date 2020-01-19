import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { GraphQLString } from 'graphql';
import fetch from 'node-fetch';

const url = 'https://blockchain.info/ticker';

export const getBitcoinPrice = {
    type: GraphQLString,
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

            return JSON.stringify(json);
        } catch (error) {
            logger.error('Error getting bitcoin price: %o', error);
            throw new Error('Problem getting Bitcoin price.');
        }
    },
};
