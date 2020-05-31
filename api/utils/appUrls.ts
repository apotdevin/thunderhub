const lnpay =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001/api/lnpay'
    : 'https://thunderhub.io/api/lnpay';

export const appUrls = {
  fees: 'https://bitcoinfees.earn.com/api/v1/fees/recommended',
  ticker: 'https://blockchain.info/ticker',
  hodlhodl: 'https://hodlhodl.com/api',
  lnpay,
};
