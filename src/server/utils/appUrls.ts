const mempoolUrl = process.env.MEMPOOL_URL || 'https://mempool.space';

const tbase =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3010/dev/v1'
    : 'https://api.thunderbase.io/v1';

const amboss =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/graphql'
    : 'https://api.amboss.space/graphql';

export const appUrls = {
  tbase,
  amboss,
  oneml: 'https://amboss.space/node/',
  blockchain: `${mempoolUrl}/tx/`,
  blockchainAddress: `${mempoolUrl}/address/`,
  fees: `${mempoolUrl}/api/v1/fees/recommended`,
  ticker: 'https://blockchain.info/ticker',
  github: 'https://api.github.com/repos/apotdevin/thunderhub/releases/latest',
  update: 'https://github.com/apotdevin/thunderhub#updating',
  lnMarkets: 'https://api.lnmarkets.com/v1',
  lnMarketsExchange: 'https://lnmarkets.com',
  boltz: 'https://boltz.exchange/api',
};
