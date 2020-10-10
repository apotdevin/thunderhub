import { getWalletInfo, diffieHellmanComputeSecret } from 'ln-service';
import {
  LndObject,
  DiffieHellmanComputeSecretType,
  GetWalletInfoType,
} from 'server/types/ln-service.types';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import { enc } from 'crypto-js';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import * as secp256k1 from 'secp256k1';
import { BIP32Interface } from 'bip32';
import { to } from './async';
import { logger } from './logger';

const fromHexString = (hexString: string) =>
  new Uint8Array(
    hexString.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
  );

const toHexString = (bytes: Uint8Array) =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

export const lnAuthUrlGenerator = async (
  url: string,
  lnd: LndObject
): Promise<string> => {
  const domainUrl = new URL(url);
  const host = domainUrl.host;

  const k1 = domainUrl.searchParams.get('k1');

  if (!host || !k1) {
    logger.error('Missing host or k1 in url: %o', url);
    throw new Error('WrongUrlFormat');
  }

  const wallet = await to<GetWalletInfoType>(getWalletInfo({ lnd }));

  // Generate entropy
  const secret = await to<DiffieHellmanComputeSecretType>(
    diffieHellmanComputeSecret({
      lnd,
      key_family: 138,
      key_index: 0,
      partner_public_key: wallet?.public_key,
    })
  );

  // Generate hash from host and entropy
  const hashed = hmacSHA256(host, secret.secret).toString(enc.Hex);

  const indexes =
    hashed.match(/.{1,4}/g)?.map(index => parseInt(index, 16)) || [];

  // Generate private seed from entropy
  const secretKey = bip39.entropyToMnemonic(hashed);
  const base58 = bip39.mnemonicToSeedSync(secretKey);

  // Derive private seed from previous private seed and path
  const node: BIP32Interface = bip32.fromSeed(base58);
  const derived = node.derivePath(
    `m/138/${indexes[0]}/${indexes[1]}/${indexes[2]}/${indexes[3]}`
  );

  // Get private and public key from derived private seed
  const privateKey = derived.privateKey?.toString('hex');
  const linkingKey = derived.publicKey.toString('hex');

  if (!privateKey || !linkingKey) {
    logger.error('Error deriving private or public key: %o', url);
    throw new Error('ErrorDerivingPrivateKey');
  }

  // Sign k1 with derived private seed
  const sigObj = secp256k1.ecdsaSign(
    fromHexString(k1),
    fromHexString(privateKey)
  );

  // Get signature
  const signature = secp256k1.signatureExport(sigObj.signature);
  const encodedSignature = toHexString(signature);

  // Build and return final url with signature and public key
  return `${url}&sig=${encodedSignature}&key=${linkingKey}`;
};
