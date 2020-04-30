import { authenticatedLndGrpc } from 'ln-service';
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
  const encodedCert = auth.cert || '';
  const encodedMacaroon = auth.macaroon || '';
  const socket = auth.host || '';

  const cert = encodedCert;
  const macaroon = encodedMacaroon;

  const params = {
    macaroon,
    socket,
    ...(encodedCert !== '' ? { cert } : {}),
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
