import { ContextType } from 'server/types/apiTypes';
import { toWithError } from 'server/helpers/async';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { appUrls } from 'server/utils/appUrls';

export const lnpayResolvers = {
  Query: {
    getLnPay: async (_: undefined, params: any, context: ContextType) => {
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
    getLnPayInfo: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'getLnPayInfo');

      const [response, error] = await toWithError(fetch(appUrls.lnpay));

      if (error) {
        logger.debug('Unable to get lnpay: %o', error);
        throw new Error('NoLnPay');
      }

      const json = await response.json();

      return { max: json.maxSendable, min: json.minSendable };
    },
  },
};
