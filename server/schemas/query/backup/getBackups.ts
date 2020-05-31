import { getBackups as getLnBackups } from 'ln-service';
import { GraphQLString } from 'graphql';
import { ContextType } from 'server/types/apiTypes';
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
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'getBackups');

    const auth = getCorrectAuth(params.auth, context);
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
