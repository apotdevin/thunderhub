const urls = {
  mempoolUrl: process.env.MEMPOOL_URL || 'https://mempool.space',
};

module.exports = {
  reactStrictMode: true,
  distDir: '../../.next',
  poweredByHeader: false,
  basePath: process.env.BASE_PATH || '',
  publicRuntimeConfig: {
    ...urls,
    apiUrl: `${process.env.BASE_PATH || ''}/graphql`,
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
};
