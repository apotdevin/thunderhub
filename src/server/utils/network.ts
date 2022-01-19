import { reversedBytes } from './string';

const chains = {
  btc: '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f',
  btcregtest:
    '0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206',
  btctestnet:
    '000000000933ea01ad0ee984209779baaec3ced90fa3f408719526f8d77f4943',
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
