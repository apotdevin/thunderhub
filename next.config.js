/* eslint @typescript-eslint/no-var-requires: 0 */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const ymlEnv = {
  YML_ENV_1: process.env.YML_ENV_1 || '',
  YML_ENV_2: process.env.YML_ENV_2 || '',
  YML_ENV_3: process.env.YML_ENV_3 || '',
  YML_ENV_4: process.env.YML_ENV_4 || '',
};

const ssoEnv = {
  cookiePath: process.env.COOKIE_PATH || '',
  lnServerUrl: process.env.SSO_SERVER_URL || '',
  lnCertPath: process.env.SSO_CERT_PATH || '',
  macaroonPath: process.env.SSO_MACAROON_PATH || '',
  dangerousNoSSOAuth:
    process.env.DANGEROUS_NO_SSO_AUTH === 'true' ? true : false,
};

const sslEnv = {
  publicUrl: process.env.PUBLIC_URL || '',
  sslPort: process.env.SSL_PORT || '',
  sslSave: process.env.SSL_SAVE || '',
};

const accountConfig = {
  accountConfigPath: process.env.ACCOUNT_CONFIG_PATH || '',
};

module.exports = withBundleAnalyzer({
  poweredByHeader: false,
  basePath: process.env.BASE_PATH || '',
  serverRuntimeConfig: {
    nodeEnv: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
    torProxy: process.env.TOR_PROXY_SERVER || '',
    ...ssoEnv,
    ...accountConfig,
    ...sslEnv,
    ...ymlEnv,
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
    disableLinks: process.env.DISABLE_LINKS === 'true' ? true : false,
    disableLnMarkets: process.env.DISABLE_LNMARKETS === 'true' ? true : false,
    noVersionCheck: process.env.NO_VERSION_CHECK === 'true' ? true : false,
    logoutUrl: process.env.LOGOUT_URL || '',
  },
});
