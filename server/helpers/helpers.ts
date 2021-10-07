import getConfig from 'next/config';
import { logger } from './logger';

const { serverRuntimeConfig } = getConfig() || {};
const { nodeEnv } = serverRuntimeConfig || {};

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

export const getErrorMsg = (error: any[] | string): string => {
  if (!error) return 'Unknown Error';
  if (typeof error === 'string') return error;

  if (error[2]) {
    const errorTitle = error[1] || '';
    const errorObject = error[2]?.err;

    let errorString = '';
    if (typeof errorObject === 'string') {
      errorString = `${errorTitle}. ${errorObject}`;
    } else {
      errorString = `${errorTitle}. ${errorObject?.details || ''}`;
    }

    return errorString;
  }

  logger.error(error);
  return 'Unkown Error';
};
