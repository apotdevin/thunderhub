import { createHash, randomBytes } from 'crypto';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import bcrypt from 'bcryptjs';
import { PRE_PASS_STRING } from '../modules/files/files.service';

export const getPreimageAndHash = () => {
  const preimage = randomBytes(32);
  const preimageHash = getSHA256Hash(preimage);

  return { preimage, hash: preimageHash };
};

export const getSHA256Hash = (
  str: string | Buffer,
  encoding: 'hex' | 'base64' = 'hex'
) => createHash('sha256').update(str).digest().toString(encoding);

export const decodeMacaroon = (macaroon: string, password: string) => {
  try {
    return AES.decrypt(macaroon, password).toString(Utf8);
  } catch (error: any) {
    console.log(`Error decoding macaroon with password: ${password}`);
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
