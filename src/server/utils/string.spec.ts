import {
  bufToHex,
  buildXCoordToFullKeyMap,
  resolveFullGroupKey,
} from './string';

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

describe('buildXCoordToFullKeyMap', () => {
  it('maps x-coordinate to full compressed key', () => {
    const xCoord = 'ab'.repeat(32);
    const fullKey02 = '02' + xCoord;
    const assets = [{ assetGroup: { tweakedGroupKey: fullKey02 } }];
    const map = buildXCoordToFullKeyMap(assets);
    expect(map.get(xCoord)).toBe(fullKey02);
  });

  it('handles 03 prefix', () => {
    const xCoord = 'cd'.repeat(32);
    const fullKey03 = '03' + xCoord;
    const assets = [{ assetGroup: { tweakedGroupKey: fullKey03 } }];
    const map = buildXCoordToFullKeyMap(assets);
    expect(map.get(xCoord)).toBe(fullKey03);
  });

  it('skips assets without group key', () => {
    const assets = [
      { assetGroup: { tweakedGroupKey: null } },
      { assetGroup: { tweakedGroupKey: undefined } },
    ];
    const map = buildXCoordToFullKeyMap(assets);
    expect(map.size).toBe(0);
  });

  it('skips keys that are not 33 bytes (66 hex chars)', () => {
    const assets = [{ assetGroup: { tweakedGroupKey: 'aabb' } }];
    const map = buildXCoordToFullKeyMap(assets);
    expect(map.size).toBe(0);
  });

  it('returns empty map for empty input', () => {
    expect(buildXCoordToFullKeyMap([]).size).toBe(0);
  });

  it('deduplicates by x-coordinate, last write wins', () => {
    const xCoord = 'ee'.repeat(32);
    const key02 = '02' + xCoord;
    const key03 = '03' + xCoord;
    const assets = [
      { assetGroup: { tweakedGroupKey: key02 } },
      { assetGroup: { tweakedGroupKey: key03 } },
    ];
    const map = buildXCoordToFullKeyMap(assets);
    expect(map.size).toBe(1);
    expect(map.get(xCoord)).toBe(key03);
  });
});

describe('resolveFullGroupKey', () => {
  const xCoord = 'ab'.repeat(32);
  const fullKey = '02' + xCoord;
  const map = new Map([[xCoord, fullKey]]);

  it('returns null for undefined input', () => {
    expect(resolveFullGroupKey(undefined, map)).toBeNull();
  });

  it('returns the key as-is if already 33 bytes (66 hex chars)', () => {
    expect(resolveFullGroupKey(fullKey, map)).toBe(fullKey);
  });

  it('resolves x-coord via owned-asset map', () => {
    expect(resolveFullGroupKey(xCoord, map)).toBe(fullKey);
  });

  it('falls back to 02 prefix when not in map', () => {
    const unknownX = 'cd'.repeat(32);
    expect(resolveFullGroupKey(unknownX, map)).toBe('02' + unknownX);
  });

  it('returns null for invalid length keys', () => {
    expect(resolveFullGroupKey('aabb', map)).toBeNull();
  });
});
