/* eslint @typescript-eslint/no-var-requires: 0 */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  poweredByHeader: false,
  assetPrefix: process.env.BASE_PATH || '',
  serverRuntimeConfig: {
    nodeEnv: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
    hodlKey: process.env.HODL_KEY || '',
    cookiePath: process.env.COOKIE_PATH || '',
    lnServerUrl: process.env.SSO_SERVER_URL || '',
    lnCertPath: process.env.SSO_CERT_PATH || '',
    macaroonPath: process.env.SSO_MACAROON_PATH || '',
    accountConfigPath: process.env.ACCOUNT_CONFIG_PATH || '',
  },
  publicRuntimeConfig: {
    nodeEnv: process.env.NODE_ENV || 'development',
    apiUrl: `${process.env.BASE_PATH || ''}/api/v1`,
    apiBaseUrl: `${process.env.API_BASE_URL || ''}/api/v1`,
    basePath: process.env.BASE_PATH || '',
    npmVersion: process.env.npm_package_version || '0.0.0',
    defaultTheme: process.env.THEME || 'dark',
    defaultCurrency: process.env.CURRENCY || 'sat',
    fetchPrices: process.env.FETCH_PRICES === 'false' ? false : true,
    fetchFees: process.env.FETCH_FEES === 'false' ? false : true,
  },
});
