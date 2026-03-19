import { AuthenticatedLnd } from 'lightning';
import { TapdRpcApis } from '@lightningpolar/tapd-api';

export type LitdConnection = {
  lnd: AuthenticatedLnd;
  tapd: TapdRpcApis;
  mode: 'grpc';
};
