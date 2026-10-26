import jwt from 'jsonwebtoken';
import { appConstants } from '../../utils/appConstants';

const MAX_IDENTIFIER_LENGTH = 254;

export type IncomingHeaders = Record<string, string | string[] | undefined>;

/** The identifier a trusted proxy placed in `headerName`, or '' if unusable. */
export function readTrustedIdentifier(
  headers: IncomingHeaders,
  headerName: string
): string {
  if (!headerName) return '';

  const raw = headers[headerName.toLowerCase()];
  const value = (Array.isArray(raw) ? raw[0] : raw) || '';
  const trimmed = value.trim();

  if (
    !trimmed ||
    trimmed.length > MAX_IDENTIFIER_LENGTH ||
    /\s/.test(trimmed)
  ) {
    return '';
  }

  return trimmed;
}

export function readAuthToken(cookieHeader?: string): string {
  if (!cookieHeader) return '';

  const prefix = `${appConstants.cookieName}=`;
  for (const part of cookieHeader.split(';')) {
    const trimmed = part.trim();
    if (!trimmed.startsWith(prefix)) continue;

    try {
      return decodeURIComponent(trimmed.slice(prefix.length));
    } catch {
      return '';
    }
  }

  return '';
}

/**
 * Rewrites the request cookie header so this request already carries the
 * session. An empty token removes the session cookie instead.
 */
export function withAuthCookie(
  cookieHeader: string | undefined,
  token: string
): string {
  const pair = token ? `${appConstants.cookieName}=${token}` : '';
  if (!cookieHeader) return pair;

  const kept = cookieHeader
    .split(';')
    .map(part => part.trim())
    .filter(part => part && !part.startsWith(`${appConstants.cookieName}=`));

  if (pair) kept.push(pair);
  return kept.join('; ');
}

export type Session = {
  sub: string;
  /** Identifier the session was minted from by the trusted header, if any. */
  via?: string;
};

/** The valid session in the cookie header, or null. */
export function readSession(
  cookieHeader: string | undefined,
  jwtSecret: string
): Session | null {
  const token = readAuthToken(cookieHeader);
  if (!token || !jwtSecret) return null;

  try {
    const payload = jwt.verify(token, jwtSecret, {
      algorithms: ['HS256'],
    }) as { sub?: unknown; via?: unknown };

    if (typeof payload?.sub !== 'string' || !payload.sub) return null;

    return {
      sub: payload.sub,
      via: typeof payload.via === 'string' ? payload.via : undefined,
    };
  } catch {
    return null;
  }
}

export function hasValidSession(
  cookieHeader: string | undefined,
  jwtSecret: string
): boolean {
  return readSession(cookieHeader, jwtSecret) !== null;
}
