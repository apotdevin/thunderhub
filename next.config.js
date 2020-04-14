const dotEnvResult = require('dotenv').config();
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

if (dotEnvResult.error) {
  throw dotEnvResult.error;
}

module.exports = withBundleAnalyzer({
  poweredByHeader: false,
  assetPrefix: process.env.BASE_PATH || '',
  serverRuntimeConfig: {
    nodeEnv: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'silly',
    hodlKey: process.env.HODL_KEY || '',
  },
  publicRuntimeConfig: {
    nodeEnv: process.env.NODE_ENV || 'development',
    basePath: process.env.BASE_PATH || '',
    npmVersion: process.env.npm_package_version || '0.0.0',
  },
});
