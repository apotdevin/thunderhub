import { AuthenticatedLnd } from 'lightning';

export type LitdConnectionMode = 'grpc' | 'session' | 'lnc';

export type LitdConnection = {
  lnd: AuthenticatedLnd;
  mode: LitdConnectionMode;
};
