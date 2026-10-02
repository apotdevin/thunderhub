import { AuthType } from '../security/security.types';
import { PrincipalService } from './principal.service';
import { getSHA256Hash, hashPassword } from '../../utils/crypto';

const logger = {
  warn: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};

// What the login form sends for the plain text "hunter2".
const YOU_DIGEST = getSHA256Hash('hunter2');
const YOU_HASH = hashPassword(YOU_DIGEST);

const yamlAccount = (hash: string, name: string, users: string[] = []) => ({
  hash,
  slug: hash.slice(0, 8),
  name,
  type: 'lnd',
  users,
  encrypted: false,
  source: 'yaml' as const,
  twofaSecret: '',
});

const home = yamlAccount('home-hash-1234', 'Home', ['you@example.com']);
const test = yamlAccount('test-hash-1234', 'Test', [
  'you@example.com',
  'guest',
]);
const solo = yamlAccount('solo-hash-1234', 'Solo');

const accountsService = {
  getAccount: (id: string) =>
    [home, test, solo].find(a => a.hash === id) ?? null,
  getYamlUser: (id: string) =>
    id === 'you@example.com'
      ? { id, name: 'You', password: YOU_HASH }
      : id === 'guest'
        ? { id, name: 'Guest' }
        : id === 'lonely'
          ? { id, name: 'Lonely', password: YOU_HASH }
          : null,
  getAccountsForYamlUser: (id: string) =>
    [home, test].filter(a => a.users.includes(id)),
  getDbNodeBySlug: jest.fn(async (slug: string, userId: string) =>
    slug === 'dbnode12' && userId === 'db-1'
      ? { hash: 'dbnode12-full', slug, name: 'DB node', source: 'db' }
      : null
  ),
};

const userService = {
  isDbEnabled: () => true,
  findUserIdByEmail: async (email: string) =>
    email === 'db@example.com' ? 'db-1' : null,
  getUserByEmail: async (email: string) =>
    email === 'db@example.com'
      ? { id: 'db-1', email, password_hash: 'db-hash', role: 'admin' }
      : null,
  verifyPassword: async (hash: string, password: string) =>
    hash === 'db-hash' && password === 'db-digest',
  getUserById: async (id: string) =>
    id === 'db-1' ? { id, email: 'db@example.com' } : null,
  getUserNodes: async (id: string) =>
    id === 'db-1'
      ? [
          {
            id: 'dbnode12-full',
            slug: 'dbnode12',
            name: 'DB node',
            type: 'lnd',
            network: 'btc',
          },
        ]
      : [],
};

const service = new PrincipalService(
  accountsService as any,
  userService as any,
  logger as any
);

describe('PrincipalService.fromTrustedIdentifier', () => {
  it('prefers a YAML user, case-insensitively', async () => {
    expect(await service.fromTrustedIdentifier(' You@Example.com ')).toEqual({
      type: AuthType.YAML_USER,
      id: 'you@example.com',
    });
  });

  it('falls back to a database user by email', async () => {
    expect(await service.fromTrustedIdentifier('db@example.com')).toEqual({
      type: AuthType.USER,
      id: 'db-1',
    });
  });

  it('refuses a YAML user that is on no account', async () => {
    expect(await service.fromTrustedIdentifier('lonely')).toBeNull();
    expect(logger.warn).toHaveBeenCalled();
  });

  it('returns null for unknown identifiers', async () => {
    expect(await service.fromTrustedIdentifier('nobody')).toBeNull();
    expect(await service.fromTrustedIdentifier('')).toBeNull();
  });
});

describe('PrincipalService.fromCredentials', () => {
  it('signs in a YAML user with the digest of their password', async () => {
    expect(
      await service.fromCredentials(' You@Example.com ', YOU_DIGEST)
    ).toEqual({ type: AuthType.YAML_USER, id: 'you@example.com' });
  });

  it('rejects a wrong password and a user without one', async () => {
    expect(
      await service.fromCredentials('you@example.com', getSHA256Hash('nope'))
    ).toBeNull();
    expect(await service.fromCredentials('guest', YOU_DIGEST)).toBeNull();
    expect(await service.fromCredentials('you@example.com', '')).toBeNull();
  });

  it('refuses a YAML user that is on no account even with a password', async () => {
    expect(await service.fromCredentials('lonely', YOU_DIGEST)).toBeNull();
  });

  it('falls back to a database user', async () => {
    expect(
      await service.fromCredentials('db@example.com', 'db-digest')
    ).toEqual({ type: AuthType.USER, id: 'db-1' });
    expect(await service.fromCredentials('db@example.com', 'bad')).toBeNull();
    expect(await service.fromCredentials('nobody', 'db-digest')).toBeNull();
  });
});

describe('PrincipalService.getNodes / resolveNode', () => {
  it('lists every YAML account that allows the user', async () => {
    const nodes = await service.getNodes({
      type: AuthType.YAML_USER,
      id: 'you@example.com',
    });
    expect(nodes.map(n => n.name)).toEqual(['Home', 'Test']);

    const guest = await service.getNodes({
      type: AuthType.YAML_USER,
      id: 'guest',
    });
    expect(guest.map(n => n.name)).toEqual(['Test']);
  });

  it('limits a password account to itself', async () => {
    const principal = { type: AuthType.YAML, id: solo.hash };
    expect(await service.getNodes(principal)).toHaveLength(1);
    expect(await service.resolveNode(principal, solo.slug)).toBe(solo);
    expect(await service.resolveNode(principal, home.slug)).toBeNull();
  });

  it('denies a YAML user a node that does not list them', async () => {
    const guest = { type: AuthType.YAML_USER, id: 'guest' };
    expect(await service.resolveNode(guest, test.slug)).toBe(test);
    expect(await service.resolveNode(guest, home.slug)).toBeNull();
  });

  it('asks the database for a db user node', async () => {
    const principal = { type: AuthType.USER, id: 'db-1' };
    expect(await service.getNodes(principal)).toEqual([
      {
        hash: 'dbnode12-full',
        slug: 'dbnode12',
        name: 'DB node',
        type: 'lnd',
        network: 'btc',
      },
    ]);
    expect(await service.resolveNode(principal, 'dbnode12')).toMatchObject({
      slug: 'dbnode12',
    });
    expect(
      await service.resolveNode({ type: AuthType.USER, id: 'db-2' }, 'dbnode12')
    ).toBeNull();
  });
});

describe('PrincipalService.describe', () => {
  it('describes each principal type', async () => {
    expect(
      await service.describe({ type: AuthType.YAML, id: solo.hash })
    ).toMatchObject({
      kind: 'server',
      displayName: 'Solo',
      canManageNodes: false,
      canUseTwofa: true,
    });
    expect(
      await service.describe({
        type: AuthType.YAML_USER,
        id: 'you@example.com',
      })
    ).toMatchObject({ kind: 'yaml-user', displayName: 'You' });
    expect(
      await service.describe({ type: AuthType.USER, id: 'db-1' })
    ).toMatchObject({
      kind: 'db',
      displayName: 'db@example.com',
      canManageNodes: true,
      hasDatabaseUser: true,
    });
  });

  it('returns null for unknown principals', async () => {
    expect(
      await service.describe({ type: AuthType.YAML, id: 'missing' })
    ).toBeNull();
    expect(
      await service.describe({ type: AuthType.USER, id: 'missing' })
    ).toBeNull();
  });
});
