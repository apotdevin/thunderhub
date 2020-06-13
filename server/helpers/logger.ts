import { createLogger, format, transports } from 'winston';
import getConfig from 'next/config';

const { serverRuntimeConfig = {} } = getConfig() || {};
const { logLevel } = serverRuntimeConfig;

const combinedFormat = format.combine(
  format.label({ label: 'THUB' }),
  format.splat(),
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(
    (info: any) =>
      `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
  )
);

export const logger = createLogger({
  level: logLevel,
  format: combinedFormat,
  transports: [new transports.Console()],
  silent: process.env.NODE_ENV === 'test' ? true : false,
});
