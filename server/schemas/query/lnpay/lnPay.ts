import { GraphQLString, GraphQLInt } from 'graphql';
import { ContextType } from 'server/types/apiTypes';
import { toWithError } from 'server/helpers/async';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { appUrls } from '../../../utils/appUrls';

export const getLnPay = {
  type: GraphQLString,
  args: {
    amount: { type: GraphQLInt },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'getLnPay');

    const [response, error] = await toWithError(
      fetch(`${appUrls.lnpay}?amount=${params.amount}`)
    );

    if (error) {
      logger.debug('Unable to get lnpay invoice: %o', error);
      throw new Error('NoLnPayInvoice');
    }

    const json = await response.json();
    return json.pr || null;
  },
};
