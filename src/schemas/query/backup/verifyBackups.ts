import { verifyBackups as verifyLnBackups } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { getAuthLnd, getErrorMsg } from '../../../helpers/helpers';
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
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'verifyBackups');

        const lnd = getAuthLnd(params.auth);

        let backupObj: BackupProps = { backup: '', channels: [] };
        try {
            backupObj = JSON.parse(params.backup);
        } catch (error) {
            params.logger && logger.error('Corrupt backup file: %o', error);
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
            params.logger && logger.error('Error verifying backups: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};
