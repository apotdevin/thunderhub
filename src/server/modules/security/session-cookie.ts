import jwt from 'jsonwebtoken';
import * as cookieLib from 'cookie';
import { appConstants } from '../../utils/appConstants';
import { Principal } from '../principal/principal.types';
import { toSubject } from './security.types';

export const SESSION_TTL = '24h';

/**
 * Extra claims a session may carry. `via` records the trusted-header
 * identifier a session was minted from, so the middleware can tell when the
 * proxy now asserts a different person.
 */
export type SessionClaims = { via?: string };

/** Signs the session JWT every login path stores in the `Thub-Auth` cookie. */
export function signSessionToken(
  principal: Principal,
  secret: string,
  claims: SessionClaims = {}
): string {
  return jwt.sign({ sub: toSubject(principal), ...claims }, secret, {
    algorithm: 'HS256',
    expiresIn: SESSION_TTL,
  });
}

export function serializeSessionCookie(
  token: string,
  useHttps: boolean
): string {
  return cookieLib.serialize(appConstants.cookieName, token, {
    httpOnly: true,
    sameSite: true,
    path: '/',
    secure: useHttps,
  });
}

/** A `Set-Cookie` value that removes the session cookie. */
export function serializeExpiredSessionCookie(useHttps: boolean): string {
  return cookieLib.serialize(appConstants.cookieName, '', {
    maxAge: -1,
    httpOnly: true,
    sameSite: true,
    path: '/',
    secure: useHttps,
  });
}
