import { ServerResponse } from 'http';
import { ContextType } from 'server/types/apiTypes';

export const AuthMock = {
  auth: {
    type: 'test',
  },
};

export const ContextMock: ContextType = {
  ip: '1.2.3.4',
  secret: '123456789',
  ssoVerified: true,
  account: {
    id: 'accountID',
    password: 'password',
  },
  sso: {
    macaroon: 'macaroon',
    cert: 'cert',
    host: 'host',
  },
  accounts: [
    {
      name: 'account',
      id: 'accountID',
      host: 'host',
      macaroon: 'macaroon',
      cert: 'cert',
    },
  ],
  res: {} as ServerResponse,
};

export const ContextMockNoAccounts: ContextType = {
  ip: '1.2.3.4',
  secret: '123456789',
  ssoVerified: true,
  account: {
    id: 'accountID',
    password: 'password',
  },
  sso: {
    macaroon: 'macaroon',
    cert: 'cert',
    host: 'host',
  },
  accounts: [],
  res: {} as ServerResponse,
};

export const ContextMockNoSSO: ContextType = {
  ip: '1.2.3.4',
  secret: '123456789',
  ssoVerified: true,
  account: {
    id: 'accountID',
    password: 'password',
  },
  sso: {
    macaroon: null,
    cert: null,
    host: null,
  },
  accounts: [
    {
      name: 'account',
      id: 'accountID',
      host: 'host',
      macaroon: 'macaroon',
      cert: 'cert',
    },
  ],
  res: {} as ServerResponse,
};
