export type EncodingType = 'hex' | 'utf-8';
export type BitcoinNetwork = 'mainnet' | 'regtest' | 'testnet';

export type AccountType = {
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
};

export type UnresolvedAccountType = {
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
};

export type ParsedAccount = {
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
