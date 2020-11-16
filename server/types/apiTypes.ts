import { ServerResponse } from 'http';
import { LndObject } from './ln-service.types';

export type SSOType = {
  macaroon: string;
  cert: string | null;
  socket: string;
};

export type AccountType = {
  name: string;
  id: string;
  socket: string;
  macaroon: string;
  cert: string | null;
  password: string;
};

export type ContextType = {
  ip: string;
  lnd: LndObject | null;
  secret: string;
  id: string | null;
  sso: SSOType | null;
  accounts: AccountType[];
  res: ServerResponse;
  lnMarketsAuth: string | null;
};
