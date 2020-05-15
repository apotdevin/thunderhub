import { recoverFundsFromChannels } from 'ln-service';
import { GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';

interface BackupProps {
  backup: string;
}

export const recoverFunds = {
  type: GraphQLBoolean,
  args: {
    ...defaultParams,
    backup: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, 'recoverFunds');

    const auth = getCorrectAuth(params.auth, context.sso);
    const lnd = getAuthLnd(auth);

    let backupObj: BackupProps = { backup: '' };
    try {
      backupObj = JSON.parse(params.backup);
    } catch (error) {
      logger.error('Corrupt backup file: %o', error);
      throw new Error('Corrupt backup file');
    }

    const { backup } = backupObj;

    try {
      await recoverFundsFromChannels({
        lnd,
        backup,
      });
      return true;
    } catch (error) {
      params.logger &&
        logger.error('Error recovering funds from channels: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
