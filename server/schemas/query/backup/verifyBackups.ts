import { verifyBackups as verifyLnBackups } from 'ln-service';
import { GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { ContextType } from 'server/types/apiTypes';
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
  channels: {}[];
}

export const verifyBackups = {
  type: GraphQLBoolean,
  args: {
    ...defaultParams,
    backup: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'verifyBackups');

    const auth = getCorrectAuth(params.auth, context);
    const lnd = getAuthLnd(auth);

    let backupObj: BackupProps = { backup: '', channels: [] };
    try {
      backupObj = JSON.parse(params.backup);
    } catch (error) {
      logger.error('Corrupt backup file: %o', error);
      throw new Error('Corrupt backup file');
    }

    const { backup, channels } = backupObj;

    try {
      const { is_valid } = await verifyLnBackups({
        lnd,
        backup,
        channels,
      });
      return is_valid;
    } catch (error) {
      logger.error('Error verifying backups: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
