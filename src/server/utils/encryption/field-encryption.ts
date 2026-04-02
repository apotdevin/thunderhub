import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const PREFIX = 'ENC[AES256_GCM,';

/**
 * Encrypts a single plaintext string using AES-256-GCM.
 * Returns a SOPS-style string: ENC[AES256_GCM,iv:<b64>,tag:<b64>,data:<b64>]
 */
export function encryptValue(plaintext: string, keyHex: string): string {
  const key = Buffer.from(keyHex, 'hex');
  if (key.length !== 32) {
    throw new Error('Encryption key must be 32 bytes (64 hex characters)');
  }

  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return `${PREFIX}iv:${iv.toString('base64')},tag:${tag.toString('base64')},data:${encrypted.toString('base64')}]`;
}

/**
 * Decrypts a SOPS-style ENC[AES256_GCM,...] string back to plaintext.
 */
export function decryptValue(encrypted: string, keyHex: string): string {
  const key = Buffer.from(keyHex, 'hex');
  if (key.length !== 32) {
    throw new Error('Encryption key must be 32 bytes (64 hex characters)');
  }

  if (!encrypted.startsWith(PREFIX) || !encrypted.endsWith(']')) {
    throw new Error('Invalid encrypted value format');
  }

  const inner = encrypted.slice(PREFIX.length, -1);
  const parts: Record<string, string> = {};

  for (const segment of inner.split(',')) {
    const idx = segment.indexOf(':');
    if (idx === -1) throw new Error('Invalid encrypted value format');
    parts[segment.slice(0, idx)] = segment.slice(idx + 1);
  }

  if (
    parts.iv === undefined ||
    parts.tag === undefined ||
    parts.data === undefined
  ) {
    throw new Error('Invalid encrypted value format: missing iv, tag, or data');
  }

  const iv = Buffer.from(parts.iv, 'base64');
  const tag = Buffer.from(parts.tag, 'base64');
  const ciphertext = Buffer.from(parts.data, 'base64');

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString('utf8');
}
