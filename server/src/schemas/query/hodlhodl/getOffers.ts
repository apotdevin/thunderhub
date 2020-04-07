import fetch from 'node-fetch';
import { GraphQLList, GraphQLString } from 'graphql';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { logger } from '../../../helpers/logger';
import { appUrls } from '../../../utils/appUrls';
import { HodlOfferType } from '../../types/HodlType';
import { getHodlParams } from '../../../helpers/hodlHelpers';

const defaultQuery = {
    filters: {},
    sort: {
        by: '',
        direction: '',
    },
};

export const getOffers = {
    type: new GraphQLList(HodlOfferType),
    args: {
        filter: { type: GraphQLString },
    },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'getOffers');

        let queryParams = defaultQuery;

        if (params.filter) {
            try {
                queryParams = JSON.parse(params.filter);
            } catch (error) {}
        }

        try {
            const fullParams = {
                ...queryParams,
            };

            const paramString = getHodlParams(fullParams);

            const response = await fetch(
                `${appUrls.hodlhodl}/v1/offers${paramString}`,
            );
            const json = await response.json();

            if (json) {
                const { offers } = json;
                return offers;
            } else {
                throw new Error('Problem getting HodlHodl offers.');
            }
        } catch (error) {
            params.logger &&
                logger.error('Error getting HodlHodl offers: %o', error);
            throw new Error('Problem getting HodlHodl offers.');
        }
    },
};
