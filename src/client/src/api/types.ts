interface Fees {
  base_msat: number;
  proportional_millionths: number;
}

export enum ModuleKind {
  Ln = 'ln',
  Mint = 'mint',
  Wallet = 'wallet',
}

interface FedimintModule {
  config: string;
  kind: ModuleKind;
  version: number;
}

interface ApiEndpoint {
  name: string;
  url: string;
}

export type MetaConfig = { federation_name?: string };

export interface ClientConfig {
  consensus_version: number;
  epoch_pk: string;
  federation_id: string;
  api_endpoints: Record<number, ApiEndpoint>;
  modules: Record<number, FedimintModule>;
  meta: MetaConfig;
}

export interface Federation {
  federation_id: string;
  balance_msat: number;
  config: ClientConfig;
}

export interface GatewayInfo {
  federations: Federation[];
  fees: Fees;
  lightning_alias: string;
  lightning_pub_key: string;
  version_hash: string;
  network?: Network;
}

// Type adaptation from https://docs.rs/bitcoin/latest/bitcoin/network/enum.Network.html
export enum Network {
  Bitcoin = 'main',
  Testnet = 'test',
  Signet = 'signet',
  Regtest = 'regtest',
}

export type TransactionId = string;

export const dummyFederation = {
  federation_id: 'test_federation_id',
  balance_msat: 1000,
  config: {
    consensus_version: 1,
    epoch_pk: 'test_epoch_pk',
    federation_id: 'test_federation_id',
    api_endpoints: {
      0: {
        name: 'test_api_endpoint_name',
        url: 'test_api_endpoint_url',
      },
    },
    modules: {
      0: {
        config: 'test_module_config',
        kind: ModuleKind.Ln,
        version: 1,
      },
    },
    meta: {
      federation_name: 'test_federation_name',
    },
  },
};
