import { authenticatedLndGrpc } from 'ln-service';
import { logger } from './logger';
import getConfig from 'next/config';

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
