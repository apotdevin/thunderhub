import { ServerResponse } from 'http';
import { ContextType } from 'server/types/apiTypes';

export const ContextMock: ContextType = {
  lnd: {},
  id: 'test',
  ip: '1.2.3.4',
  secret: '123456789',
  sso: {
    macaroon: 'macaroon',
    cert: 'cert',
    socket: 'host',
    currentCookie: 'secret',
  },
  accounts: [
    {
      name: 'account',
      id: 'accountID',
      socket: 'host',
      macaroon: 'macaroon',
      cert: 'cert',
      password: 'password',
      encrypted: false,
    },
  ],
  res: {} as ServerResponse,
  lnMarketsAuth: 'lnMarketAuth',
  tokenAuth: 'tokenAuth',
};

export const ContextMockNoAccounts: ContextType = {
  lnd: {},
  id: 'test',
  ip: '1.2.3.4',
  secret: '123456789',
  sso: {
    macaroon: 'macaroon',
    cert: 'cert',
    socket: 'host',
    currentCookie: 'secret',
  },
  accounts: [],
  res: {} as ServerResponse,
  lnMarketsAuth: 'lnMarketAuth',
  tokenAuth: 'tokenAuth',
};

export const ContextMockNoSSO: ContextType = {
  lnd: {},
  id: 'test',
  ip: '1.2.3.4',
  secret: '123456789',
  sso: null,
  accounts: [
    {
      name: 'account',
      id: 'accountID',
      socket: 'host',
      macaroon: 'macaroon',
      cert: 'cert',
      password: 'password',
      encrypted: false,
    },
  ],
  res: {} as ServerResponse,
  lnMarketsAuth: 'lnMarketAuth',
  tokenAuth: 'tokenAuth',
};
