import { NodeType } from '../node/lightning.types';

export type EncodingType = 'hex' | 'utf-8';
export type BitcoinNetwork =
  | 'mainnet'
  | 'regtest'
  | 'testnet'
  | 'testnet4'
  | 'signet';

export type AccountType = {
  type?: string;
  name?: string;
  serverUrl?: string;
  lndDir?: string;
  network?: BitcoinNetwork;
  macaroonPath?: string;
  certificatePath?: string;
  password?: string | null;
  macaroon?: string;
  certificate?: string;
  encrypted?: boolean;
  twofaSecret?: string | null;
  authToken?: string;
  tlsCertPath?: string;
  rabbitmqUrl?: string;
  rabbitmqExchangeName?: string;
};

export type UnresolvedAccountType = {
  type?: string;
  name?: string;
  serverUrl?: string;
  lndDir?: string;
  network?: BitcoinNetwork;
  macaroonPath?: string;
  certificatePath?: string;
  password?: string | null;
  macaroon?: string;
  certificate?: string;
  encrypted?: boolean | string;
  authToken?: string;
  tlsCertPath?: string;
  rabbitmqUrl?: string;
  rabbitmqExchangeName?: string;
};

export type ParsedAccount = {
  type: NodeType;
  index: number;
  name: string;
  hash: string;
  socket: string;
  macaroon: string;
  cert: string;
  password: string;
  encrypted: boolean;
  encryptedMacaroon: string;
  twofaSecret: string;
  authToken?: string;
  tlsCertPath?: string;
  rabbitmqUrl?: string;
  rabbitmqExchangeName?: string;
};

export type AccountConfigType = {
  hashed: boolean | null;
  masterPassword: string | null;
  defaultNetwork: string | null;
  backupsEnabled: boolean | null;
  healthCheckPingEnabled: boolean | null;
  onchainPushEnabled: boolean | null;
  channelPushEnabled: boolean | null;
  privateChannelPushEnabled: boolean | null;
  accounts: AccountType[];
};

export type ConfigType = {
  backupsEnabled: boolean;
  healthCheckPingEnabled: boolean;
  onchainPushEnabled: boolean;
  channelPushEnabled: boolean;
  privateChannelPushEnabled: boolean;
};
