export const shorten = (text: string): string => {
  if (!text) return '';
  const amount = 6;
  const beginning = text.slice(0, amount);
  const end = text.slice(text.length - amount);

  return `${beginning}...${end}`;
};

export const reversedBytes = hex =>
  Buffer.from(hex, 'hex').reverse().toString('hex');

const ansiRegex = ({ onlyFirst = false } = {}) => {
  const pattern = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))',
  ].join('|');

  return new RegExp(pattern, onlyFirst ? undefined : 'g');
};

export const stripAnsi = string => {
  if (typeof string !== 'string') {
    throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
  }

  return string.replace(ansiRegex(), '');
};

/**
 * Build a map from compressed public key x-coordinate (32 bytes hex)
 * to the full compressed public key (33 bytes hex, with 02/03 prefix).
 *
 * Universe roots store only the x-coordinate of group keys (32 bytes,
 * serialized via schnorr.SerializePubKey), but downstream APIs like
 * newAddr and fundChannel require the full compressed key (33 bytes
 * with 02/03 parity prefix, parsed via btcec.ParsePubKey).
 *
 * This resolves the mapping using assets that carry the full
 * tweakedGroupKey from listAssets.
 */
export const buildXCoordToFullKeyMap = (
  assets: { assetGroup: { tweakedGroupKey: any } }[]
): Map<string, string> => {
  const map = new Map<string, string>();
  for (const asset of assets) {
    const fullKey = bufToHex(asset.assetGroup?.tweakedGroupKey);
    if (fullKey && fullKey.length === 66) {
      map.set(fullKey.slice(2), fullKey);
    }
  }
  return map;
};

/**
 * Resolve an x-only group key (32 bytes) to a full compressed key (33 bytes).
 * First tries the owned-asset map, then falls back to the 02 prefix
 * (even parity, the most common case for taproot keys).
 */
export const resolveFullGroupKey = (
  rawGroupKey: string | undefined,
  xCoordToFullKey: Map<string, string>
): string | null => {
  if (!rawGroupKey) return null;
  if (rawGroupKey.length === 66) return rawGroupKey;
  if (rawGroupKey.length === 64) {
    return xCoordToFullKey.get(rawGroupKey) || '02' + rawGroupKey;
  }
  return null;
};

export const bufToHex = (val: any): string | undefined => {
  if (!val) return undefined;
  if (Buffer.isBuffer(val)) return val.toString('hex');
  if (val instanceof Uint8Array) return Buffer.from(val).toString('hex');
  if (typeof val === 'string') return val;
  if (val?.type === 'Buffer' && Array.isArray(val?.data)) {
    return Buffer.from(val.data).toString('hex');
  }
  return undefined;
};
