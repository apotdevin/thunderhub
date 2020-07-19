import { ServerResponse } from 'http';

type SSOType = {
  macaroon: string | null;
  cert: string | null;
  host: string | null;
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
  sso: SSOType;
  accounts: AccountType[];
  res: ServerResponse;
};
