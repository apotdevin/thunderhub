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
      if (error.length >= 2) {
        if (error[2]?.err?.details?.indexOf('permission denied') >= 0) {
          logger.warn('Admin permission check failed.');
          throw new Error('PermissionDenied');
        }
        if (
          error[2]?.err?.details?.indexOf('invalid character in string:') >= 0
        ) {
          logger.info('Admin permission checked');
          return true;
        }
      }

      logger.info('%o', error);
      const errorMessage = getErrorMsg(error);
      throw new Error(errorMessage);
    }
  },
};
