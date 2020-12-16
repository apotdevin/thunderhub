import getConfig from 'next/config';
import jwt from 'jsonwebtoken';
import { readCookie, refreshCookie } from 'server/helpers/fileHelpers';
import { ContextType } from 'server/types/apiTypes';
import { logger } from 'server/helpers/logger';
import cookieLib from 'cookie';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { appConstants } from 'server/utils/appConstants';
import { GetWalletInfoType } from 'server/types/ln-service.types';
import { authenticatedLndGrpc, getWalletInfo } from 'ln-service';
import { toWithError } from 'server/helpers/async';
import { decodeMacaroon, isCorrectPassword } from 'server/helpers/crypto';

const { serverRuntimeConfig } = getConfig() || {};
const { cookiePath, nodeEnv, dangerousNoSSOAuth } = serverRuntimeConfig || {};

export const authResolvers = {
  Mutation: {
    getAuthToken: async (
      _: undefined,
      { cookie }: { cookie: string },
      { ip, secret, sso, res }: ContextType
    ): Promise<boolean> => {
      await requestLimiter(ip, 'getAuthToken');

      if (!sso) {
        logger.warn('No SSO account available');
        return false;
      }

      if (!sso.socket || !sso.macaroon) {
        logger.warn('Host and macaroon are required for SSO');
        return false;
      }

      if (dangerousNoSSOAuth) {
        logger.warn(
          'SSO authentication is disabled. Make sure this is what you want.'
        );
      } else {
        // No cookie or cookiePath needed when SSO authentication is turned off
        if (!cookie) {
          return false;
        }

        if (cookiePath === '') {
          logger.warn(
            'SSO auth not available since no cookie path was provided'
          );
          return false;
        }
      }

      if (nodeEnv === 'development') {
        logger.warn('SSO authentication is disabled in development.');
      }

      const cookieFile = readCookie(cookiePath);

      if (
        (cookieFile && cookieFile.trim() === cookie.trim()) ||
        nodeEnv === 'development' ||
        dangerousNoSSOAuth
      ) {
        cookiePath && refreshCookie(cookiePath);

        const { lnd } = authenticatedLndGrpc(sso);
        const [, error] = await toWithError<GetWalletInfoType>(
          getWalletInfo({
            lnd,
          })
        );

        if (error) {
          logger.error('Unable to connect to this node');
          throw new Error('UnableToConnectToThisNode');
        }

        const token = jwt.sign({ id: 'sso' }, secret);

        res.setHeader(
          'Set-Cookie',
          cookieLib.serialize(appConstants.cookieName, token, {
            httpOnly: true,
            sameSite: true,
            path: '/',
          })
        );
        return true;
      }

      logger.debug(`Cookie ${cookie} different to file ${cookieFile}`);
      return false;
    },
    getSessionToken: async (
      _: undefined,
      { id, password }: { id: string; password: string },
      { ip, secret, res, accounts }: ContextType
    ): Promise<string> => {
      await requestLimiter(ip, 'getSessionToken');

      const account = accounts.find(a => a.id === id) || null;

      if (!account) {
        logger.debug(`Account ${id} not found`);
        return '';
      }

      if (account.encrypted) {
        if (nodeEnv === 'development') {
          logger.error(
            'Encrypted accounts only work in a production environment'
          );
          throw new Error('UnableToLogin');
        }

        const macaroon = decodeMacaroon(account.encryptedMacaroon, password);

        // Store decrypted macaroon in memory.
        // In development NextJS rebuilds the files so this only works in production env.
        account.macaroon = macaroon;

        logger.debug(`Decrypted the macaroon for account ${id}`);
      } else {
        if (!isCorrectPassword(password, account.password)) {
          logger.error(
            `Authentication failed from ip: ${ip} - Invalid Password!`
          );
          throw new Error('WrongPasswordForLogin');
        }

        logger.debug(`Correct password for account ${id}`);
      }

      // Try to connect to node. The authenticatedLndGrpc method will also check if the macaroon is base64 or hex.
      const { lnd } = authenticatedLndGrpc(account);
      const [info, error] = await toWithError<GetWalletInfoType>(
        getWalletInfo({
          lnd,
        })
      );

      if (error) {
        logger.error('Unable to connect to this node');
        throw new Error('UnableToConnectToThisNode');
      }

      const token = jwt.sign({ id }, secret);
      res.setHeader(
        'Set-Cookie',
        cookieLib.serialize(appConstants.cookieName, token, {
          httpOnly: true,
          sameSite: true,
          path: '/',
        })
      );
      return info?.version || '';
    },
    logout: async (
      _: undefined,
      __: any,
      context: ContextType
    ): Promise<boolean> => {
      const { ip, res } = context;
      await requestLimiter(ip, 'logout');

      res.setHeader(
        'Set-Cookie',
        cookieLib.serialize(appConstants.cookieName, '', {
          maxAge: -1,
          httpOnly: true,
          sameSite: true,
          path: '/',
        })
      );
      return true;
    },
  },
};
