import { ServerResponse } from 'http';
import { ParsedAccount } from 'server/helpers/fileHelpers';
import { LndObject } from './ln-service.types';

export type SSOType = {
  macaroon: string;
  cert: string | null;
  socket: string;
};

export type ContextType = {
  ip: string;
  lnd: LndObject | null;
  secret: string;
  id: string | null;
  sso: SSOType | null;
  accounts: ParsedAccount[];
  res: ServerResponse;
  lnMarketsAuth: string | null;
};
