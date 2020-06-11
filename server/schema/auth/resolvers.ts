import getConfig from 'next/config';
import jwt from 'jsonwebtoken';
import { readCookie, refreshCookie } from 'server/helpers/fileHelpers';
import { ContextType } from 'server/types/apiTypes';
import { SSO_ACCOUNT, SERVER_ACCOUNT } from 'src/context/AccountContext';
import { logger } from 'server/helpers/logger';
import cookie from 'cookie';
import { requestLimiter } from 'server/helpers/rateLimiter';
import AES from 'crypto-js/aes';

const { serverRuntimeConfig } = getConfig();
const { cookiePath, nodeEnv } = serverRuntimeConfig;

export const authResolvers = {
  Query: {
    getAuthToken: async (_: undefined, params: any, context: ContextType) => {
      const { ip, secret, sso, res } = context;
      await requestLimiter(ip, 'getAuthToken');

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
        cookieFile.trim() === params.cookie.trim() ||
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

      try {
        AES.decrypt(account.macaroon, params.password);
        logger.debug(`Correct password for account ${params.id}`);
        const token = jwt.sign(
          {
            id: params.id,
            password: AES.encrypt(params.password, secret).toString(),
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
      } catch (error) {
        throw new Error('WrongPasswordForLogin');
      }
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
