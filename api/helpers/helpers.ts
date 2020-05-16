import { authenticatedLndGrpc } from 'ln-service';
import getConfig from 'next/config';
import { SSO_ACCOUNT, SERVER_ACCOUNT } from 'src/context/AccountContext';
import { ContextType } from 'api/types/apiTypes';
import { logger } from './logger';

const { serverRuntimeConfig } = getConfig();
const { nodeEnv } = serverRuntimeConfig;

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

export const getCorrectAuth = (auth, context: ContextType) => {
  if (auth.type === SERVER_ACCOUNT) {
    const { account } = context;
    if (!account) return {};

    const foundAccount = context.accounts.find(a => a.id === account.id);
    if (!foundAccount) return {};

    return {
      host: account.host,
      macaroon: account.macaroon,
      cert: account.cert,
    };
  }
  if (auth.type === SSO_ACCOUNT) {
    return { ...context.sso };
  }
  return { ...auth };
};

export const getAuthLnd = (auth: {
  cert: string;
  macaroon: string;
  host: string;
}) => {
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

export const to = promise => {
  return promise
    .then(data => {
      return data;
    })
    .catch(err => {
      logger.error('%o', err);
      throw new Error(getErrorMsg(err));
    });
};
