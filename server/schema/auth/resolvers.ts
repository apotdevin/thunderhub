import getConfig from 'next/config';
import jwt from 'jsonwebtoken';
import {
  readCookie,
  refreshCookie,
  PRE_PASS_STRING,
} from 'server/helpers/fileHelpers';
import { ContextType } from 'server/types/apiTypes';
import { logger } from 'server/helpers/logger';
import cookie from 'cookie';
import { requestLimiter } from 'server/helpers/rateLimiter';
import bcrypt from 'bcryptjs';
import { appConstants } from 'server/utils/appConstants';

const { serverRuntimeConfig } = getConfig() || {};
const { cookiePath, nodeEnv } = serverRuntimeConfig || {};

export const authResolvers = {
  Query: {
    getAuthToken: async (_: undefined, params: any, context: ContextType) => {
      const { ip, secret, sso, res } = context;
      await requestLimiter(ip, 'getAuthToken');

      if (!sso) {
        logger.warn('No SSO account available');
        return null;
      }

      if (!sso.socket || !sso.macaroon) {
        logger.warn('Host and macaroon are required for SSO');
        return null;
      }

      if (!params.cookie) {
        return null;
      }

      if (cookiePath === '') {
        logger.warn('SSO auth not available since no cookie path was provided');
        return null;
      }

      const cookieFile = readCookie(cookiePath);

      if (
        (cookieFile && cookieFile.trim() === params.cookie.trim()) ||
        nodeEnv === 'development'
      ) {
        refreshCookie(cookiePath);
        const token = jwt.sign({ id: 'sso' }, secret);

        res.setHeader(
          'Set-Cookie',
          cookie.serialize(appConstants.cookieName, token, {
            httpOnly: true,
            sameSite: true,
            path: '/',
          })
        );
        return true;
      }

      logger.debug(`Cookie ${params.cookie} different to file ${cookieFile}`);
      return null;
    },
    getSessionToken: async (
      _: undefined,
      params: any,
      context: ContextType
    ) => {
      const { ip, secret, res } = context;
      await requestLimiter(ip, 'getSessionToken');

      const account = context.accounts.find(a => a.id === params.id) || null;

      if (!account) {
        logger.debug(`Account ${params.id} not found`);
        return null;
      }

      const cleanPassword = account.password.replace(PRE_PASS_STRING, '');

      const isPassword = bcrypt.compareSync(params.password, cleanPassword);

      if (!isPassword) {
        throw new Error('WrongPasswordForLogin');
      }

      logger.debug(`Correct password for account ${params.id}`);
      const token = jwt.sign({ id: params.id }, secret);
      res.setHeader(
        'Set-Cookie',
        cookie.serialize(appConstants.cookieName, token, {
          httpOnly: true,
          sameSite: true,
          path: '/',
        })
      );
      return true;
    },
  },
  Mutation: {
    logout: async (_: undefined, params: any, context: ContextType) => {
      const { ip, res } = context;
      await requestLimiter(ip, 'logout');

      res.setHeader(
        'Set-Cookie',
        cookie.serialize(appConstants.cookieName, '', { maxAge: 1 })
      );
      return true;
    },
  },
};
