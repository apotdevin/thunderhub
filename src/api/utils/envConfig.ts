export const envConfig = {
  env: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'silly',
  hodlKey: process.env.HODL_KEY,
};
