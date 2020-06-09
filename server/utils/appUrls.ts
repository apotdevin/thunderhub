const lnpay =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001/api/lnpay'
    : 'https://thunderhub.io/api/lnpay';

export const appUrls = {
  lnpay,
  oneml: 'https://1ml.com/node/',
  blockchain: 'https://www.blockchain.com/btc/tx/',
  fees: 'https://bitcoinfees.earn.com/api/v1/fees/recommended',
  ticker: 'https://blockchain.info/ticker',
  hodlhodl: 'https://hodlhodl.com/api',
  github: 'https://api.github.com/repos/apotdevin/thunderhub/releases/latest',
  update: 'https://github.com/apotdevin/thunderhub#updating',
};
