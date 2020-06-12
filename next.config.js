/* eslint @typescript-eslint/no-var-requires: 0 */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  poweredByHeader: false,
  assetPrefix: process.env.BASE_PATH || '',
  env: {
    NPM_VERSION: process.env.npm_package_version,
    BASE_PATH: process.env.BASE_PATH,
    THEME: process.env.THEME,
    CURRENCY: process.env.CURRENCY,
    FETCH_PRICES: process.env.FETCH_PRICES,
    FETCH_FEES: process.env.FETCH_FEES,
    HODL_HODL: process.env.HODL_HODL,
    DISABLE_LINKS: process.env.DISABLE_LINKS,
    NO_CLIENT_ACCOUNTS: process.env.NO_CLIENT_ACCOUNTS,
    NO_VERSION_CHECK: process.env.NO_VERSION_CHECK,
  },
});
