import { BlockList, isIP } from 'net';

type Range = { address: string; prefix: number; family: 'ipv4' | 'ipv6' };

const parseRange = (entry: string): Range | null => {
  const [address, rawPrefix, ...rest] = entry.split('/');
  if (rest.length) return null;

  const version = isIP(address);
  if (!version) return null;

  const family = version === 4 ? 'ipv4' : 'ipv6';
  const maxPrefix = version === 4 ? 32 : 128;

  if (rawPrefix === undefined) return { address, prefix: maxPrefix, family };

  if (!/^\d{1,3}$/.test(rawPrefix)) return null;
  const prefix = Number(rawPrefix);
  if (prefix > maxPrefix) return null;

  return { address, prefix, family };
};

/**
 * Splits TRUSTED_PROXY_IPS into addresses and CIDR ranges. Entries that are
 * not valid are reported so the operator can fix them, not silently dropped.
 */
export const parseTrustedProxyIps = (
  raw: string | undefined
): { ranges: string[]; invalid: string[] } => {
  const ranges: string[] = [];
  const invalid: string[] = [];

  for (const piece of (raw || '').split(',')) {
    const entry = piece.trim();
    if (!entry) continue;

    if (parseRange(entry)) {
      if (!ranges.includes(entry)) ranges.push(entry);
    } else {
      invalid.push(entry);
    }
  }

  return { ranges, invalid };
};

/** The set of peers allowed to assert a user through the trusted header. */
export class TrustedProxies {
  private readonly list = new BlockList();
  readonly size: number;

  constructor(ranges: string[]) {
    let size = 0;
    for (const entry of ranges) {
      const range = parseRange(entry);
      if (!range) continue;
      this.list.addSubnet(range.address, range.prefix, range.family);
      size += 1;
    }
    this.size = size;
  }

  /** Whether a socket peer address is a trusted proxy. */
  allows(remoteAddress: string | undefined): boolean {
    if (!remoteAddress || !this.size) return false;

    const version = isIP(remoteAddress);
    if (!version) return false;

    // IPv4-mapped IPv6 peers ("::ffff:10.0.0.1") match IPv4 rules.
    return this.list.check(remoteAddress, version === 4 ? 'ipv4' : 'ipv6');
  }
}
