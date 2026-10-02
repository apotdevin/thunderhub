import { parseTrustedProxyIps, TrustedProxies } from './trusted-proxy';

describe('parseTrustedProxyIps', () => {
  it('accepts addresses and CIDR ranges of both families', () => {
    expect(
      parseTrustedProxyIps(' 10.0.0.1, 172.16.0.0/12 ,fd00::/8, ::1,,')
    ).toEqual({
      ranges: ['10.0.0.1', '172.16.0.0/12', 'fd00::/8', '::1'],
      invalid: [],
    });
  });

  it('reports entries that are not addresses or ranges', () => {
    expect(
      parseTrustedProxyIps('traefik, 10.0.0.0/33, 10.0.0.0/8/1, 1.2.3, ::/129')
    ).toEqual({
      ranges: [],
      invalid: ['traefik', '10.0.0.0/33', '10.0.0.0/8/1', '1.2.3', '::/129'],
    });
    expect(parseTrustedProxyIps(undefined)).toEqual({
      ranges: [],
      invalid: [],
    });
  });
});

describe('TrustedProxies', () => {
  const proxies = new TrustedProxies(['10.0.0.0/8', '192.168.1.5', 'fd00::/8']);

  it('matches single addresses and ranges', () => {
    expect(proxies.allows('10.200.3.4')).toBe(true);
    expect(proxies.allows('192.168.1.5')).toBe(true);
    expect(proxies.allows('192.168.1.6')).toBe(false);
    expect(proxies.allows('fd00::1')).toBe(true);
    expect(proxies.allows('fe80::1')).toBe(false);
  });

  it('matches IPv4 rules for IPv4-mapped IPv6 peers', () => {
    expect(proxies.allows('::ffff:10.1.2.3')).toBe(true);
    expect(proxies.allows('::ffff:192.168.1.6')).toBe(false);
  });

  it('allows nothing when empty or given garbage', () => {
    expect(new TrustedProxies([]).allows('10.0.0.1')).toBe(false);
    expect(proxies.allows(undefined)).toBe(false);
    expect(proxies.allows('')).toBe(false);
    expect(proxies.allows('not-an-ip')).toBe(false);
  });
});
