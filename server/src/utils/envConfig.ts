require('dotenv').config();

export const envConfig = {
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'silly',
    hodlKey: process.env.HODL_KEY,
};
