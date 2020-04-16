require('dotenv').config();
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

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
    apiUrl: `${process.env.BASE_PATH || ''}/api/v1`,
    apiBaseUrl: `${process.env.API_BASE_URL || ''}/api/v1`,
    basePath: process.env.BASE_PATH || '',
    npmVersion: process.env.npm_package_version || '0.0.0',
  },
});
