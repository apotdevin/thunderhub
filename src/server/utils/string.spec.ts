import { bufToHex } from './string';

describe('bufToHex', () => {
  it('returns undefined for falsy values', () => {
    expect(bufToHex(null)).toBeUndefined();
    expect(bufToHex(undefined)).toBeUndefined();
    expect(bufToHex('')).toBeUndefined();
    expect(bufToHex(0)).toBeUndefined();
  });

  it('converts a Buffer to hex string', () => {
    const buf = Buffer.from([0xde, 0xad, 0xbe, 0xef]);
    expect(bufToHex(buf)).toBe('deadbeef');
  });

  it('converts a Uint8Array to hex string', () => {
    const arr = new Uint8Array([0xca, 0xfe]);
    expect(bufToHex(arr)).toBe('cafe');
  });

  it('returns a string value as-is', () => {
    expect(bufToHex('abc123')).toBe('abc123');
  });

  it('converts a serialized Buffer object to hex string', () => {
    const serialized = { type: 'Buffer', data: [0x01, 0x02, 0x03] };
    expect(bufToHex(serialized)).toBe('010203');
  });

  it('returns undefined for unrecognized objects', () => {
    expect(bufToHex({ foo: 'bar' })).toBeUndefined();
    expect(bufToHex(42)).toBeUndefined();
    expect(bufToHex([])).toBeUndefined();
  });
});
