import { getBackups as getLnBackups } from 'ln-service';
import { GraphQLString } from 'graphql';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';

export const getBackups = {
  type: GraphQLString,
  args: defaultParams,
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, 'getBackups');

    const auth = getCorrectAuth(params.auth, context.sso);
    const lnd = getAuthLnd(auth);

    try {
      const backups = await getLnBackups({
        lnd,
      });
      return JSON.stringify(backups);
    } catch (error) {
      logger.error('Error getting backups: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
