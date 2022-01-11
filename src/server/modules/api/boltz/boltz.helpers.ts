import { address, Network, networks } from 'bitcoinjs-lib';
import { ECPairFactory, ECPairAPI } from 'ecpair';
import * as ecc from 'tiny-secp256k1';

const ECPair: ECPairAPI = ECPairFactory(ecc);

export const getHexBuffer = (input: string) => {
  return Buffer.from(input, 'hex');
};

export const getHexString = (input?: Buffer): string => {
  if (!input) return '';
  return input.toString('hex');
};

export const validateAddress = (
  btcAddress: string,
  network: Network = networks.bitcoin
): boolean => {
  try {
    address.toOutputScript(btcAddress, network);
    return true;
  } catch (e) {
    return false;
  }
};

export const generateKeys = (network: Network = networks.bitcoin) => {
  const keys = ECPair.makeRandom({ network });

  return {
    publicKey: getHexString(keys.publicKey),
    privateKey: getHexString(keys.privateKey),
  };
};
