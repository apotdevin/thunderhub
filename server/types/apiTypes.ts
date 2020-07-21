import { ServerResponse } from 'http';

export type SSOType = {
  macaroon: string;
  cert: string | null;
  host: string;
};

export type AccountType = {
  name: string;
  id: string;
  host: string;
  macaroon: string;
  cert: string | null;
  password: string;
};

export type ContextType = {
  ip: string;
  secret: string;
  ssoVerified: boolean;
  account: string | null;
  sso: SSOType | null;
  accounts: AccountType[];
  res: ServerResponse;
};
