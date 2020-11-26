import { createHash, randomBytes } from 'crypto';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import bcrypt from 'bcryptjs';
import { PRE_PASS_STRING } from './fileHelpers';
import { logger } from './logger';

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

export const decodeMacaroon = (macaroon: string, password: string) => {
  try {
    return AES.decrypt(macaroon, password).toString(Utf8);
  } catch (err) {
    logger.error(`Error decoding macaroon with password: ${password}`);
    throw new Error('WrongPasswordForLogin');
  }
};

export const hashPassword = (password: string): string =>
  `${PRE_PASS_STRING}${bcrypt.hashSync(password, 12)}`;

export const isCorrectPassword = (
  password: string,
  correctPassword: string
): boolean => {
  const cleanPassword = correctPassword.replace(PRE_PASS_STRING, '');
  return bcrypt.compareSync(password, cleanPassword);
};
