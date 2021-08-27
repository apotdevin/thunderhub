import {
  verifyBackups as verifyLnBackups,
  recoverFundsFromChannels,
  getBackups,
  pay,
  verifyMessage,
  signMessage,
} from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { getErrorMsg } from 'server/helpers/helpers';
import { toWithError } from 'server/helpers/async';
import { ChannelType } from 'server/types/ln-service.types';

export const toolsResolvers = {
  Query: {
    verifyBackups: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'verifyBackups');

      const { lnd } = context;

      let backupObj = { backup: '', channels: [] as ChannelType[] };
      try {
        backupObj = JSON.parse(params.backup);
      } catch (error: any) {
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
      } catch (error: any) {
        logger.error('Error verifying backups: %o', error);
        throw new Error(getErrorMsg(error));
      }
    },
    recoverFunds: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'recoverFunds');

      const { lnd } = context;

      let backupObj = { backup: '' };
      try {
        backupObj = JSON.parse(params.backup);
      } catch (error: any) {
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
      } catch (error: any) {
        logger.error('Error recovering funds from channels: %o', error);
        throw new Error(getErrorMsg(error));
      }
    },
    getBackups: async (_: undefined, __: undefined, context: ContextType) => {
      await requestLimiter(context.ip, 'getBackups');

      const { lnd } = context;

      try {
        const backups = await getBackups({
          lnd,
        });
        return JSON.stringify(backups);
      } catch (error: any) {
        logger.error('Error getting backups: %o', error);
        throw new Error(getErrorMsg(error));
      }
    },
    adminCheck: async (_: undefined, __: undefined, context: ContextType) => {
      await requestLimiter(context.ip, 'adminCheck');

      const { lnd } = context;

      const [, error] = await toWithError(
        pay({
          lnd,
          request: 'admin check',
        })
      );

      if (error && error.length >= 2) {
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
    },
    verifyMessage: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'verifyMessage');

      const { lnd } = context;

      try {
        const message: { signed_by: string } = await verifyMessage({
          lnd,
          message: params.message,
          signature: params.signature,
        });

        return message.signed_by;
      } catch (error: any) {
        logger.error('Error verifying message: %o', error);
        throw new Error(getErrorMsg(error));
      }
    },
    signMessage: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'signMessage');

      const { lnd } = context;

      try {
        const message: { signature: string } = await signMessage({
          lnd,
          message: params.message,
        });

        return message.signature;
      } catch (error: any) {
        logger.error('Error signing message: %o', error);
        throw new Error(getErrorMsg(error));
      }
    },
  },
};
