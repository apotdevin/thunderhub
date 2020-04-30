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
      const errorMessage = getErrorMsg(error);
      if (errorMessage.indexOf('invalid character in string') >= 0) return true;

      logger.error('%o', error);
      throw new Error(errorMessage);
    }
  },
};
