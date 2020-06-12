import { createLogger, format, transports } from 'winston';
import { serverEnv } from 'server/utils/appEnv';

const { logLevel } = serverEnv;

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
});
