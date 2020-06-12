export const serverEnv = {
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  hodlKey: process.env.HODL_KEY || '',
  cookiePath: process.env.COOKIE_PATH || '',
  lnServerUrl: process.env.SSO_SERVER_URL || '',
  lnCertPath: process.env.SSO_CERT_PATH || '',
  macaroonPath: process.env.SSO_MACAROON_PATH || '',
  accountConfigPath: process.env.ACCOUNT_CONFIG_PATH || '',
};

export const clientEnv = {
  nodeEnv: process.env.NODE_ENV || 'development',
  npmVersion: process.env.NPM_VERSION || '0.0.0',
  apiUrl: `${process.env.BASE_PATH || ''}/api/v1`,
  basePath: process.env.BASE_PATH || '',
  defaultTheme: process.env.THEME || 'dark',
  defaultCurrency: process.env.CURRENCY || 'sat',
  fetchPrices: process.env.FETCH_PRICES === 'false' ? false : true,
  fetchFees: process.env.FETCH_FEES === 'false' ? false : true,
  hodlhodl: process.env.HODL_HODL === 'false' ? false : true,
  disableLinks: process.env.DISABLE_LINKS === 'true' ? true : false,
  noClient: process.env.NO_CLIENT_ACCOUNTS === 'true' ? true : false,
  noVersionCheck: process.env.NO_VERSION_CHECK === 'true' ? true : false,
};
