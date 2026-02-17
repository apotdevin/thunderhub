import { createHash, createDecipheriv, createHmac, randomBytes } from 'crypto';
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

export const hmacSHA256 = (message: string, key: string): string =>
  createHmac('sha256', key).update(message).digest('hex');

// Decrypts data encrypted with crypto-js AES (OpenSSL EVP_BytesToKey format).
// Format: "Salted__" (8 bytes) + salt (8 bytes) + ciphertext
export const decodeMacaroon = (macaroon: string, password: string) => {
  try {
    const data = Buffer.from(macaroon, 'base64');

    const salt = data.subarray(8, 16);
    const ciphertext = data.subarray(16);

    const { key, iv } = evpBytesToKey(password, salt, 32, 16);
    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  } catch (error: any) {
    console.log('Error decoding macaroon: invalid password');
    throw new Error('WrongPasswordForLogin');
  }
};

// OpenSSL EVP_BytesToKey derivation (MD5-based), compatible with crypto-js AES
function evpBytesToKey(
  password: string,
  salt: Buffer,
  keyLen: number,
  ivLen: number
) {
  const totalLen = keyLen + ivLen;
  const result: Buffer[] = [];
  let prev = Buffer.alloc(0);

  while (Buffer.concat(result).length < totalLen) {
    prev = createHash('md5')
      .update(Buffer.concat([prev, Buffer.from(password), salt]))
      .digest();
    result.push(prev);
  }

  const derived = Buffer.concat(result);
  return {
    key: derived.subarray(0, keyLen),
    iv: derived.subarray(keyLen, keyLen + ivLen),
  };
}

export const hashPassword = (password: string): string =>
  `${PRE_PASS_STRING}${bcrypt.hashSync(password, 12)}`;

export const isCorrectPassword = (
  password: string,
  correctPassword: string
): boolean => {
  const cleanPassword = correctPassword.replace(PRE_PASS_STRING, '');
  return bcrypt.compareSync(password, cleanPassword);
};
