import { Secp256k1ZKP } from '@vulpemventures/secp256k1-zkp';
import { address, Network, networks, Transaction } from 'bitcoinjs-lib';
import {
  detectSwap,
  extractRefundPublicKeyFromReverseSwapTree,
  Musig,
  TaprootUtils,
} from 'boltz-core';
import { SwapTree } from 'boltz-core/dist/lib/consts/Types';
import { randomBytes } from 'crypto';
import { ECPairFactory, ECPairAPI, ECPairInterface } from 'ecpair';
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

export const findTaprootOutput = (
  zkp: Secp256k1ZKP,
  transaction: Transaction,
  tree: SwapTree,
  keys: ECPairInterface
) => {
  const theirPublicKey = extractRefundPublicKeyFromReverseSwapTree(tree);

  // "brute force" the tie breaker because it is not in the onchain script
  // https://medium.com/blockstream/reducing-bitcoin-transaction-sizes-with-x-only-pubkeys-f86476af05d7
  for (const tieBreaker of ['02', '03']) {
    const compressedKey = Buffer.concat([
      getHexBuffer(tieBreaker),
      theirPublicKey,
    ]);

    const musig = new Musig(zkp, keys, randomBytes(32), [
      compressedKey,
      keys.publicKey,
    ]);
    const tweakedKey = TaprootUtils.tweakMusig(musig, tree.tree);

    const swapOutput = detectSwap(tweakedKey, transaction);
    if (swapOutput !== undefined) {
      return {
        musig,
        tweakedKey,
        swapOutput,
        theirPublicKey: compressedKey,
      };
    }
  }

  return undefined;
};
