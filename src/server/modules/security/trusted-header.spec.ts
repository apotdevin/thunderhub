import jwt from 'jsonwebtoken';
import { AuthType, parseSubject } from './security.types';
import { signSessionToken } from './session-cookie';
import {
  hasValidSession,
  readAuthToken,
  readSession,
  readTrustedIdentifier,
  withAuthCookie,
} from './trusted-header';
import { TrustedHeaderMiddleware } from './trusted-header.middleware';

const secret = 'test-secret';

describe('readTrustedIdentifier', () => {
  it('reads and trims the configured header, case-insensitively', () => {
    expect(
      readTrustedIdentifier(
        { 'x-authentik-email': ' You@Example.com ' },
        'X-Authentik-Email'
      )
    ).toBe('You@Example.com');
  });

  it('accepts identifiers that are not emails', () => {
    expect(
      readTrustedIdentifier({ 'remote-user': 'alice' }, 'remote-user')
    ).toBe('alice');
  });

  it('rejects missing, blank, or whitespace-containing values', () => {
    expect(readTrustedIdentifier({}, 'remote-user')).toBe('');
    expect(readTrustedIdentifier({ 'remote-user': '  ' }, 'remote-user')).toBe(
      ''
    );
    expect(
      readTrustedIdentifier({ 'remote-user': 'two words' }, 'remote-user')
    ).toBe('');
    expect(readTrustedIdentifier({ 'remote-user': 'x' }, '')).toBe('');
  });
});

describe('cookie helpers', () => {
  it('reads the auth cookie out of a cookie header', () => {
    expect(readAuthToken('theme=dark; Thub-Auth=abc; other=1')).toBe('abc');
    expect(readAuthToken('theme=dark')).toBe('');
  });

  it('replaces an existing auth cookie and keeps the others', () => {
    expect(withAuthCookie('theme=dark; Thub-Auth=old', 'new')).toBe(
      'theme=dark; Thub-Auth=new'
    );
    expect(withAuthCookie(undefined, 'new')).toBe('Thub-Auth=new');
    expect(withAuthCookie('theme=dark; Thub-Auth=old', '')).toBe('theme=dark');
    expect(withAuthCookie('Thub-Auth=old', '')).toBe('');
  });

  it('reads the subject and the via claim', () => {
    const plain = signSessionToken({ type: AuthType.USER, id: 'u1' }, secret);
    expect(readSession(`Thub-Auth=${plain}`, secret)).toEqual({
      sub: 'user:u1',
      via: undefined,
    });

    const trusted = signSessionToken(
      { type: AuthType.YAML_USER, id: 'a@example.com' },
      secret,
      { via: 'a@example.com' }
    );
    expect(readSession(`Thub-Auth=${trusted}`, secret)).toEqual({
      sub: 'yaml-user:a@example.com',
      via: 'a@example.com',
    });
    expect(readSession(undefined, secret)).toBeNull();
  });

  it('accepts a signed session and rejects an expired one', () => {
    const valid = signSessionToken({ type: AuthType.USER, id: 'u1' }, secret);
    expect(hasValidSession(`Thub-Auth=${valid}`, secret)).toBe(true);

    const expired = jwt.sign(
      { sub: 'user:1', exp: Math.floor(Date.now() / 1000) - 10 },
      secret,
      { algorithm: 'HS256' }
    );
    expect(hasValidSession(`Thub-Auth=${expired}`, secret)).toBe(false);
    expect(hasValidSession(`Thub-Auth=${valid}`, 'other')).toBe(false);
  });
});

describe('TrustedHeaderMiddleware', () => {
  const makeConfig = (headerName: string, proxies = ['10.0.0.0/8']) => ({
    get: (key: string) =>
      (
        ({
          trustedAuthHeader: headerName,
          trustedProxyIps: proxies,
          jwtSecret: secret,
          useHttps: false,
        }) as Record<string, string | boolean | string[]>
      )[key],
  });

  const fromProxy = { remoteAddress: '::ffff:10.1.2.3' };

  const logger = {
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  const makeRes = () => {
    const headers: Record<string, string | string[]> = {};
    return {
      headers,
      res: {
        getHeader: (name: string) => headers[name.toLowerCase()],
        setHeader: (name: string, value: string | string[]) => {
          headers[name.toLowerCase()] = value;
        },
      } as any,
    };
  };

  const sessionSubject = (cookie: string) =>
    parseSubject(
      (jwt.verify(cookie.replace('Thub-Auth=', ''), secret) as { sub: string })
        .sub
    );

  it('does nothing when no header is configured', async () => {
    const principalService = { fromTrustedIdentifier: jest.fn() };
    const middleware = new TrustedHeaderMiddleware(
      makeConfig('') as any,
      principalService as any,
      logger as any
    );
    const req = {
      headers: { 'x-authentik-email': 'a@example.com' },
      socket: fromProxy,
    } as any;
    const next = jest.fn();

    await middleware.use(req, makeRes().res, next);

    expect(next).toHaveBeenCalled();
    expect(req.headers.cookie).toBeUndefined();
    expect(principalService.fromTrustedIdentifier).not.toHaveBeenCalled();
  });

  it('ignores the header when the peer is not a trusted proxy', async () => {
    const principalService = { fromTrustedIdentifier: jest.fn() };
    const middleware = new TrustedHeaderMiddleware(
      makeConfig('x-authentik-email') as any,
      principalService as any,
      logger as any
    );
    const { res, headers } = makeRes();
    const next = jest.fn();

    for (const socket of [{ remoteAddress: '192.168.1.9' }, {}, undefined]) {
      const req = {
        headers: { 'x-authentik-email': 'a@example.com' },
        socket,
      } as any;
      await middleware.use(req, res, next);
      expect(req.headers.cookie).toBeUndefined();
    }

    expect(next).toHaveBeenCalledTimes(3);
    expect(principalService.fromTrustedIdentifier).not.toHaveBeenCalled();
    expect(headers['set-cookie']).toBeUndefined();
    expect(logger.warn).not.toHaveBeenCalled();
    expect(logger.debug).toHaveBeenCalled();
  });

  it('creates a session for the resolved principal', async () => {
    const principalService = {
      fromTrustedIdentifier: jest
        .fn()
        .mockResolvedValue({ type: AuthType.YAML_USER, id: 'a@example.com' }),
      toSubject: () => 'yaml-user:a@example.com',
    };
    const middleware = new TrustedHeaderMiddleware(
      makeConfig('X-Authentik-Email') as any,
      principalService as any,
      logger as any
    );
    const req = {
      headers: { 'x-authentik-email': 'A@Example.com' },
      socket: fromProxy,
    } as any;
    const { res, headers } = makeRes();
    const next = jest.fn();

    await middleware.use(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(principalService.fromTrustedIdentifier).toHaveBeenCalledWith(
      'A@Example.com'
    );
    expect(sessionSubject(req.headers.cookie)).toEqual({
      type: AuthType.YAML_USER,
      id: 'a@example.com',
    });
    expect(String(headers['set-cookie'])).toContain('Thub-Auth=');
    expect(String(headers['set-cookie'])).toContain('HttpOnly');
  });

  it('leaves a session minted from the same identifier alone', async () => {
    const principalService = { fromTrustedIdentifier: jest.fn() };
    const middleware = new TrustedHeaderMiddleware(
      makeConfig('x-authentik-email') as any,
      principalService as any,
      logger as any
    );
    const existing = signSessionToken(
      { type: AuthType.YAML_USER, id: 'a@example.com' },
      secret,
      { via: 'a@example.com' }
    );
    const req = {
      headers: {
        'x-authentik-email': 'A@Example.com',
        cookie: `Thub-Auth=${existing}`,
      },
      socket: fromProxy,
    } as any;
    const { res, headers } = makeRes();

    await middleware.use(req, res, jest.fn());

    expect(principalService.fromTrustedIdentifier).not.toHaveBeenCalled();
    expect(req.headers.cookie).toBe(`Thub-Auth=${existing}`);
    expect(headers['set-cookie']).toBeUndefined();
  });

  it('switches the session when the header names someone else', async () => {
    const principalService = {
      fromTrustedIdentifier: jest
        .fn()
        .mockResolvedValue({ type: AuthType.YAML_USER, id: 'b@example.com' }),
      fromSubject: parseSubject,
      toSubject: () => 'yaml-user:b@example.com',
    };
    const middleware = new TrustedHeaderMiddleware(
      makeConfig('x-authentik-email') as any,
      principalService as any,
      logger as any
    );
    // Alice's session, created by the header earlier; now Bob is at the proxy.
    const alice = signSessionToken(
      { type: AuthType.YAML_USER, id: 'a@example.com' },
      secret,
      { via: 'a@example.com' }
    );
    const req = {
      headers: {
        'x-authentik-email': 'b@example.com',
        cookie: `theme=dark; Thub-Auth=${alice}`,
      },
      socket: fromProxy,
    } as any;
    const { res, headers } = makeRes();

    await middleware.use(req, res, jest.fn());

    expect(req.headers.cookie).toMatch(/^theme=dark; Thub-Auth=/);
    expect(sessionSubject(req.headers.cookie.split('; ')[1])).toEqual({
      type: AuthType.YAML_USER,
      id: 'b@example.com',
    });
    expect(String(headers['set-cookie'])).toContain('Thub-Auth=ey');
  });

  it('overrides a password session with the header identity', async () => {
    const principalService = {
      fromTrustedIdentifier: jest
        .fn()
        .mockResolvedValue({ type: AuthType.USER, id: 'db-1' }),
      fromSubject: parseSubject,
      toSubject: () => 'user:db-1',
    };
    const middleware = new TrustedHeaderMiddleware(
      makeConfig('x-authentik-email') as any,
      principalService as any,
      logger as any
    );
    const password = signSessionToken(
      { type: AuthType.YAML, id: 'account' },
      secret
    );
    const req = {
      headers: {
        'x-authentik-email': 'db@example.com',
        cookie: `Thub-Auth=${password}`,
      },
      socket: fromProxy,
    } as any;

    await middleware.use(req, makeRes().res, jest.fn());

    expect(sessionSubject(req.headers.cookie)).toEqual({
      type: AuthType.USER,
      id: 'db-1',
    });
    expect(readSession(req.headers.cookie, secret)?.via).toBe('db@example.com');
  });

  it('ends a header session when the header now names an unknown user', async () => {
    const principalService = {
      fromTrustedIdentifier: jest.fn().mockResolvedValue(null),
    };
    const middleware = new TrustedHeaderMiddleware(
      makeConfig('x-authentik-email') as any,
      principalService as any,
      logger as any
    );
    const alice = signSessionToken(
      { type: AuthType.YAML_USER, id: 'a@example.com' },
      secret,
      { via: 'a@example.com' }
    );
    const req = {
      headers: {
        'x-authentik-email': 'stranger@example.com',
        cookie: `theme=dark; Thub-Auth=${alice}`,
      },
      socket: fromProxy,
    } as any;
    const { res, headers } = makeRes();

    await middleware.use(req, res, jest.fn());

    expect(req.headers.cookie).toBe('theme=dark');
    expect(String(headers['set-cookie'])).toMatch(/Thub-Auth=;.*Max-Age=-1/);
  });

  it('keeps a password session when the header names an unknown user', async () => {
    const principalService = {
      fromTrustedIdentifier: jest.fn().mockResolvedValue(null),
    };
    const middleware = new TrustedHeaderMiddleware(
      makeConfig('x-authentik-email') as any,
      principalService as any,
      logger as any
    );
    const password = signSessionToken(
      { type: AuthType.YAML, id: 'account' },
      secret
    );
    const req = {
      headers: {
        'x-authentik-email': 'stranger@example.com',
        cookie: `Thub-Auth=${password}`,
      },
      socket: fromProxy,
    } as any;
    const { res, headers } = makeRes();

    await middleware.use(req, res, jest.fn());

    expect(req.headers.cookie).toBe(`Thub-Auth=${password}`);
    expect(headers['set-cookie']).toBeUndefined();
  });

  it('does nothing when the identifier is unknown', async () => {
    const principalService = {
      fromTrustedIdentifier: jest.fn().mockResolvedValue(null),
    };
    const middleware = new TrustedHeaderMiddleware(
      makeConfig('x-authentik-email') as any,
      principalService as any,
      logger as any
    );
    const req = {
      headers: { 'x-authentik-email': 'nobody@example.com' },
      socket: fromProxy,
    } as any;
    const { res, headers } = makeRes();
    const next = jest.fn();

    await middleware.use(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.headers.cookie).toBeUndefined();
    expect(headers['set-cookie']).toBeUndefined();
  });
});
