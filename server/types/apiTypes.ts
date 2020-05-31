import { ServerResponse } from 'http';

type SSOType = {
  macaroon: string | null;
  cert: string | null;
  host: string | null;
};

type VerifiedAccountType = {
  id: string;
  password: string;
};

type AccountType = {
  name: string;
  id: string;
  host: string;
  macaroon: string;
  cert: string | null;
};

export type ContextType = {
  ip: string;
  secret: string;
  ssoVerified: boolean;
  account: VerifiedAccountType | null;
  sso: SSOType;
  accounts: AccountType[];
  res: ServerResponse;
};
