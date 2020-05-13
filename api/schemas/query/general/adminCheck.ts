import { pay as payRequest } from 'ln-service';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { GraphQLBoolean } from 'graphql';
import { getAuthLnd, getErrorMsg } from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';
import { logger } from '../../../helpers/logger';

export const adminCheck = {
  type: GraphQLBoolean,
  args: {
    ...defaultParams,
  },
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, 'adminCheck');

    const lnd = getAuthLnd(params.auth);

    try {
      await payRequest({
        lnd,
        request: 'admin check',
      });
    } catch (error) {
      logger.info('%o', error);
      if (error.length >= 2) {
        if (error[2]?.err?.details?.indexOf('permission denied') >= 0) {
          throw new Error('PermissionDenied');
        }
      }

      const errorMessage = getErrorMsg(error);
      if (errorMessage.indexOf('UnexpectedSendPaymentError') >= 0) return true;

      throw new Error(errorMessage);
    }
  },
};
