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
  name: string;
  hash: string;
  socket: string;
  macaroon: string;
  cert: string;
  password: string;
  encrypted: boolean;
  encryptedMacaroon: string;
};

export type AccountConfigType = {
  hashed: boolean | null;
  masterPassword: string | null;
  defaultNetwork: string | null;
  accounts: AccountType[];
};
