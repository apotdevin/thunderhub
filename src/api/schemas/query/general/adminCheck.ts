import { pay as payRequest } from 'ln-service';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { GraphQLBoolean } from 'graphql';
import { getAuthLnd, getErrorDetails } from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';

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
      const details = getErrorDetails(error);
      if (details.includes('invalid character in string')) return true;

      throw new Error();
    }
  },
};
