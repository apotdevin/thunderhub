import { authenticatedLndGrpc } from 'ln-service';
import getConfig from 'next/config';
import {
  SSO_ACCOUNT,
  SERVER_ACCOUNT,
  AuthType,
  CLIENT_ACCOUNT,
} from 'src/context/AccountContext';
import { ContextType } from 'server/types/apiTypes';
import AES from 'crypto-js/aes';
import CryptoJS from 'crypto-js';
import { logger } from './logger';

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig() || {};
const { nodeEnv } = serverRuntimeConfig || {};
const { noClient } = publicRuntimeConfig || {};

type LndAuthType = {
  cert: string;
  macaroon: string;
  host: string;
};

export const getIp = (req: any) => {
  if (!req || !req.headers) {
    return '';
  }
  const forwarded = req.headers['x-forwarded-for'];
  const before = forwarded
    ? forwarded.split(/, /)[0]
    : req.connection.remoteAddress;
  const ip = nodeEnv === 'development' ? '1.2.3.4' : before;
  return ip;
};

export const getCorrectAuth = (
  auth: AuthType,
  context: ContextType
): LndAuthType => {
  if (auth.type === 'test' && nodeEnv !== 'production') {
    return {
      host: process.env.TEST_HOST,
      macaroon: process.env.TEST_MACAROON,
      cert: process.env.TEST_CERT,
    };
  }
  if (auth.type === SERVER_ACCOUNT) {
    const { account, accounts } = context;
    if (!account) {
      logger.debug('Account not available in request');
      throw new Error('AccountNotAuthenticated');
    }
    if (account.id !== auth.id) {
      logger.debug(
        `Account (${account.id}) in cookie different to requested account (${auth.id})`
      );
      throw new Error('AccountNotAuthenticated');
    }

    const verifiedAccount = accounts.find(a => a.id === account.id) || null;

    if (!verifiedAccount) {
      logger.debug('Account not found in config file');
      throw new Error('AccountNotAuthenticated');
    }

    let macaroon = null;
    try {
      const bytes = AES.decrypt(verifiedAccount.macaroon, account.password);
      macaroon = bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      logger.warn('Account macaroon verification failed');
    }

    return { host: verifiedAccount.host, macaroon, cert: verifiedAccount.cert };
  }
  if (auth.type === SSO_ACCOUNT) {
    if (!context.ssoVerified) {
      logger.debug('SSO Account is not verified');
      throw new Error('AccountNotAuthenticated');
    }

    return { ...context.sso };
  }
  if (auth.type === CLIENT_ACCOUNT && !noClient) {
    const { host, macaroon, cert } = auth;
    return { host, macaroon, cert };
  }
  if (auth.type === CLIENT_ACCOUNT && noClient) {
    logger.info(`Client accounts are disabled from the server.`);
    throw new Error('AccountTypeDoesNotExist');
  }
  logger.info(`No authentication for account type '${auth.type}' found`);
  throw new Error('AccountTypeDoesNotExist');
};

export const getAuthLnd = (auth: LndAuthType) => {
  const cert = auth.cert || '';
  const macaroon = auth.macaroon || '';
  const socket = auth.host || '';

  const params = {
    macaroon,
    socket,
    ...(cert !== '' ? { cert } : {}),
  };

  const { lnd } = authenticatedLndGrpc(params);

  return lnd;
};

export const getLnd = (auth: AuthType, context: ContextType) =>
  getAuthLnd(getCorrectAuth(auth, context));

export const getErrorMsg = (error: any[] | string): string => {
  if (typeof error === 'string') {
    return error;
  }
  if (error.length >= 2) {
    return error[1];
  }
  // if (error.length > 2) {
  //   return error[2].err?.message || 'Error';
  // }

  return 'Error';
};
