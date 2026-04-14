import { reversedBytes } from './string';

const chains = {
  btc: '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f',
  btcregtest:
    '0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206',
  btctestnet:
    '000000000933ea01ad0ee984209779baaec3ced90fa3f408719526f8d77f4943',
  btctestnet4:
    '00000000da84f2bafbbc53dee25a72ae507ff4914b867c565be350b0da8bf043',
  // Mutinynet shares its genesis with standard Bitcoin signet
  btcsignet: '00000008819873e925422c1ff0f99f7cc9bbb232af63a077a480a3633bee1ef6',
};

export const getNetwork = (chain: string) => {
  if (!chain) {
    return undefined;
  }

  const network = Object.keys(chains).find(network => {
    return chain === reversedBytes(chains[network]);
  });

  return network;
};

const AMBOSS_AUTH_URLS: Record<string, string> = {
  btc: 'https://account.amboss.tech/graphql',
  btcsignet: 'https://account-dev.amboss.tech/graphql',
};

const AMBOSS_SPACE_URLS: Record<string, string> = {
  btc: 'https://api.amboss.space/graphql',
  btcsignet: 'https://api-dev.amboss.space/graphql',
};

const AMBOSS_MAGMA_URLS: Record<string, string> = {
  btc: 'https://magma.amboss.tech/graphql',
  btcsignet: 'https://magma-dev.amboss.tech/graphql',
};

const AMBOSS_TRADE_URLS: Record<string, string> = {
  btc: 'https://rails.amboss.tech/graphql',
  btcsignet: 'https://rails-dev.amboss.tech/graphql',
};

/**
 * Returns the Amboss auth API URL for the given network.
 * Only mainnet and mutinynet/signet are supported — Amboss has no
 * production or dev environment for testnet/testnet4/regtest.
 */
export const getAmbossAuthUrl = (network: string | undefined): string => {
  if (!network || !(network in AMBOSS_AUTH_URLS)) {
    throw new Error(
      `Amboss authentication is not supported on the current network (${network ?? 'unknown'})`
    );
  }
  return AMBOSS_AUTH_URLS[network];
};

/**
 * Returns the Amboss Space API URL for the given network.
 * Mainnet → api.amboss.space, mutinynet/signet → api-dev.amboss.space.
 */
export const getAmbossSpaceUrl = (network: string | undefined): string => {
  if (!network || !(network in AMBOSS_SPACE_URLS)) {
    throw new Error(
      `Amboss is not supported on the current network (${network ?? 'unknown'})`
    );
  }
  return AMBOSS_SPACE_URLS[network];
};

/**
 * Returns the Magma API URL for the given network.
 * Mainnet → magma.amboss.tech, mutinynet/signet → magma-dev.amboss.tech.
 */
export const getAmbossMagmaUrl = (network: string | undefined): string => {
  if (!network || !(network in AMBOSS_MAGMA_URLS)) {
    throw new Error(
      `Magma is not supported on the current network (${network ?? 'unknown'})`
    );
  }
  return AMBOSS_MAGMA_URLS[network];
};

/**
 * Returns the Amboss Trade (Rails) API URL for the given network.
 * Mainnet → rails.amboss.tech, mutinynet/signet → rails-dev.amboss.tech.
 */
export const getAmbossTradeUrl = (network: string | undefined): string => {
  if (!network || !(network in AMBOSS_TRADE_URLS)) {
    throw new Error(
      `Trade is not supported on the current network (${network ?? 'unknown'})`
    );
  }
  return AMBOSS_TRADE_URLS[network];
};
