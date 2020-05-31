import { GraphQLInt, GraphQLObjectType } from 'graphql';
import { ContextType } from 'server/types/apiTypes';
import { toWithError } from 'server/helpers/async';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { appUrls } from '../../../utils/appUrls';

export const LnPayInfoType = new GraphQLObjectType({
  name: 'lnPayInfoType',
  fields: () => {
    return {
      max: { type: GraphQLInt },
      min: { type: GraphQLInt },
    };
  },
});

export const getLnPayInfo = {
  type: LnPayInfoType,
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'getLnPayInfo');

    const [response, error] = await toWithError(fetch(appUrls.lnpay));

    if (error) {
      logger.debug('Unable to get lnpay: %o', error);
      throw new Error('NoLnPay');
    }

    const json = await response.json();

    return { max: json.maxSendable, min: json.minSendable };
  },
};
