import { randomBytes } from 'crypto';
import { encryptValue, decryptValue } from './field-encryption';

const TEST_KEY = randomBytes(32).toString('hex');

describe('field-encryption', () => {
  describe('encryptValue / decryptValue', () => {
    it('should roundtrip a simple string', () => {
      const plaintext = 'hello world';
      const encrypted = encryptValue(plaintext, TEST_KEY);
      expect(encrypted).toMatch(/^ENC\[AES256_GCM,/);
      expect(decryptValue(encrypted, TEST_KEY)).toBe(plaintext);
    });

    it('should roundtrip an empty string', () => {
      const encrypted = encryptValue('', TEST_KEY);
      expect(decryptValue(encrypted, TEST_KEY)).toBe('');
    });

    it('should roundtrip a long hex string (macaroon-like)', () => {
      const macaroon = randomBytes(256).toString('hex');
      const encrypted = encryptValue(macaroon, TEST_KEY);
      expect(decryptValue(encrypted, TEST_KEY)).toBe(macaroon);
    });

    it('should produce different ciphertexts for the same plaintext (unique IV)', () => {
      const plaintext = 'same input';
      const a = encryptValue(plaintext, TEST_KEY);
      const b = encryptValue(plaintext, TEST_KEY);
      expect(a).not.toBe(b);
      expect(decryptValue(a, TEST_KEY)).toBe(plaintext);
      expect(decryptValue(b, TEST_KEY)).toBe(plaintext);
    });

    it('should reject an invalid key length', () => {
      expect(() => encryptValue('test', 'short')).toThrow(
        'Encryption key must be 32 bytes'
      );
      expect(() =>
        decryptValue('ENC[AES256_GCM,iv:a,tag:b,data:c]', 'short')
      ).toThrow('Encryption key must be 32 bytes');
    });

    it('should reject malformed encrypted strings', () => {
      expect(() => decryptValue('not-encrypted', TEST_KEY)).toThrow(
        'Invalid encrypted value format'
      );
    });

    it('should fail on tampered ciphertext (GCM auth tag check)', () => {
      const encrypted = encryptValue('secret', TEST_KEY);
      // Tamper with the data portion
      const tampered = encrypted.replace(/data:[A-Za-z0-9+/=]+/, 'data:AAAA');
      expect(() => decryptValue(tampered, TEST_KEY)).toThrow();
    });

    it('should fail with a wrong key', () => {
      const encrypted = encryptValue('secret', TEST_KEY);
      const wrongKey = randomBytes(32).toString('hex');
      expect(() => decryptValue(encrypted, wrongKey)).toThrow();
    });
  });
});
