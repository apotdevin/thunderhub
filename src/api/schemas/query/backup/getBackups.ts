import { getBackups as getLnBackups } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { GraphQLString } from 'graphql';
import { getAuthLnd, getErrorMsg } from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';

export const getBackups = {
  type: GraphQLString,
  args: defaultParams,
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, 'getBackups');

    const lnd = getAuthLnd(params.auth);

    try {
      const backups = await getLnBackups({
        lnd,
      });
      return JSON.stringify(backups);
    } catch (error) {
      params.logger && logger.error('Error getting backups: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
