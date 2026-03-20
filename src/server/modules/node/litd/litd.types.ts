import { AuthenticatedLnd } from 'lightning';

export type LitdConnectionMode = 'grpc';

export type LitdConnection = {
  lnd: AuthenticatedLnd;
  mode: LitdConnectionMode;
};
