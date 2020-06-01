import {
  verifyBackups as verifyLnBackups,
  recoverFundsFromChannels,
  getBackups,
  decodePaymentRequest,
  payRequest,
  verifyMessage,
  signMessage,
} from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from 'server/helpers/helpers';

export const toolsResolvers = {
  Query: {
    verifyBackups: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'verifyBackups');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      let backupObj = { backup: '', channels: [] };
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
    recoverFunds: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'recoverFunds');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      let backupObj = { backup: '' };
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
        logger.error('Error recovering funds from channels: %o', error);
        throw new Error(getErrorMsg(error));
      }
    },
    getBackups: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'getBackups');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      try {
        const backups = await getBackups({
          lnd,
        });
        return JSON.stringify(backups);
      } catch (error) {
        logger.error('Error getting backups: %o', error);
        throw new Error(getErrorMsg(error));
      }
    },
    decodeRequest: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'decode');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      try {
        const decode = await decodePaymentRequest({
          lnd,
          request: params.request,
        });

        return decode;
      } catch (error) {
        logger.error('Error paying request: %o', error);
        throw new Error(getErrorMsg(error));
      }
    },
    adminCheck: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'adminCheck');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

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
    verifyMessage: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'verifyMessage');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      try {
        const message: { signed_by: string } = await verifyMessage({
          lnd,
          message: params.message,
          signature: params.signature,
        });

        return message.signed_by;
      } catch (error) {
        logger.error('Error verifying message: %o', error);
        throw new Error(getErrorMsg(error));
      }
    },
    signMessage: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'signMessage');

      const auth = getCorrectAuth(params.auth, context);
      const lnd = getAuthLnd(auth);

      try {
        const message: { signature: string } = await signMessage({
          lnd,
          message: params.message,
        });

        return message.signature;
      } catch (error) {
        logger.error('Error signing message: %o', error);
        throw new Error(getErrorMsg(error));
      }
    },
  },
};
