import getConfig from 'next/config';

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
  console.log(error);
  if (!error) return 'Unknown Error';
  if (typeof error === 'string') return error;
  if (error[2]?.err?.details) return error[2]?.err?.details;
  if (error[1]) return error[1];

  return 'Unkown Error';
};
