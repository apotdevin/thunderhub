import { createHash, randomBytes } from 'crypto';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';

export const getPreimageAndHash = () => {
  const preimage = randomBytes(32);
  const preimageHash = createHash('sha256')
    .update(preimage)
    .digest()
    .toString('hex');

  return { preimage, hash: preimageHash };
};

export const getPrivateAndPublicKey = () => {
  const secretKey = bip39.generateMnemonic();
  const base58 = bip39.mnemonicToSeedSync(secretKey);

  // Derive private seed
  const node: bip32.BIP32Interface = bip32.fromSeed(base58);
  const derived = node.derivePath(`m/0/0`);

  // Get private and public key from derived private seed
  const privateKey = derived.privateKey?.toString('hex');
  const publicKey = derived.publicKey.toString('hex');

  return { privateKey, publicKey };
};
