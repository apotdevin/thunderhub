// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  basePath: process.env.BASE_PATH || '',
  transpilePackages: ['echarts', 'zrender'],
  compiler: {
    styledComponents: true,
  },
  publicRuntimeConfig: {
    mempoolUrl: process.env.MEMPOOL_URL || 'https://mempool.space',
    disable2FA: process.env.DISABLE_TWOFA === 'true',
    apiUrl: `${process.env.BASE_PATH || ''}/graphql`,
    basePath: process.env.BASE_PATH || '',
    npmVersion: process.env.npm_package_version || '0.0.0',
    defaultTheme: process.env.THEME || 'dark',
    defaultCurrency: process.env.CURRENCY || 'sat',
    fetchPrices: process.env.FETCH_PRICES === 'false' ? false : true,
    fetchFees: process.env.FETCH_FEES === 'false' ? false : true,
    disableLinks: process.env.DISABLE_LINKS === 'true',
    disableLnMarkets: process.env.DISABLE_LNMARKETS === 'true',
    noVersionCheck: process.env.NO_VERSION_CHECK === 'true',
    logoutUrl: process.env.LOGOUT_URL || '',
    fmGatewayUrl: process.env.FM_GATEWAY_URL || '',
    fmGatewayPassword: process.env.FM_GATEWAY_PASSWORD || '',
  },
};
