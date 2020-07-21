import getConfig from 'next/config';
import jwt from 'jsonwebtoken';
import {
  readCookie,
  refreshCookie,
  PRE_PASS_STRING,
} from 'server/helpers/fileHelpers';
import { ContextType } from 'server/types/apiTypes';
import { SSO_ACCOUNT, SERVER_ACCOUNT } from 'src/context/AccountContext';
import { logger } from 'server/helpers/logger';
import cookie from 'cookie';
import { requestLimiter } from 'server/helpers/rateLimiter';
import bcrypt from 'bcryptjs';

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

      if (!sso.host || !sso.macaroon) {
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
        const token = jwt.sign({ user: SSO_ACCOUNT }, secret);

        res.setHeader(
          'Set-Cookie',
          cookie.serialize('SSOAuth', token, { httpOnly: true, sameSite: true })
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
      const token = jwt.sign(
        {
          id: params.id,
        },
        secret
      );
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('AccountAuth', token, {
          httpOnly: true,
          sameSite: true,
        })
      );
      return true;
    },
  },
  Mutation: {
    logout: async (_: undefined, params: any, context: ContextType) => {
      const { ip, res } = context;
      await requestLimiter(ip, 'logout');

      if (params.type === SSO_ACCOUNT) {
        res.setHeader(
          'Set-Cookie',
          cookie.serialize('SSOAuth', '', { maxAge: 1 })
        );
        return true;
      }
      if (params.type === SERVER_ACCOUNT) {
        res.setHeader(
          'Set-Cookie',
          cookie.serialize('AccountAuth', '', { maxAge: 1 })
        );
        return true;
      }
      return true;
    },
  },
};
