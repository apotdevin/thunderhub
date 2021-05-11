const tbase =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3010/dev/v1'
    : 'https://api.thunderbase.io/v1';

export const appUrls = {
  tbase,
  oneml: 'https://amboss.space/node/',
  blockchain: 'https://mempool.space/tx/',
  blockchainAddress: 'https://mempool.space/address/',
  fees: 'https://mempool.space/api/v1/fees/recommended',
  ticker: 'https://blockchain.info/ticker',
  github: 'https://api.github.com/repos/apotdevin/thunderhub/releases/latest',
  update: 'https://github.com/apotdevin/thunderhub#updating',
  lnMarkets: 'https://api.lnmarkets.com',
  lnMarketsExchange: 'https://lnmarkets.com',
  boltz: 'https://boltz.exchange/api',
};
