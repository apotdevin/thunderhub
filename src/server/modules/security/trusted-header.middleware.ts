import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrincipalService } from '../principal/principal.service';
import { Principal } from '../principal/principal.types';
import {
  serializeExpiredSessionCookie,
  serializeSessionCookie,
  signSessionToken,
} from './session-cookie';
import {
  readSession,
  readTrustedIdentifier,
  withAuthCookie,
} from './trusted-header';
import { TrustedProxies } from './trusted-proxy';

const appendSetCookie = (res: Response, value: string) => {
  const current = res.getHeader('Set-Cookie');
  if (!current) {
    res.setHeader('Set-Cookie', value);
    return;
  }

  const existing = Array.isArray(current)
    ? current.map(String)
    : [String(current)];
  existing.push(value);
  res.setHeader('Set-Cookie', existing);
};

const samePrincipal = (a: Principal, b: Principal) =>
  a.type === b.type && a.id === b.id;

/**
 * Turns the identifier a trusted reverse proxy sends (TRUSTED_AUTH_HEADER)
 * into a regular Thunderhub session. Runs before the guards, so the request
 * that arrives with only the header leaves with a cookie and is treated like
 * any other logged-in request.
 *
 * The header is only honoured when the socket peer is one of
 * TRUSTED_PROXY_IPS; anyone else sending it is ignored.
 *
 * The proxy is the authority on who is at the keyboard. When the header
 * names someone other than the current session (another person signed in to
 * the identity provider on the same browser), the session follows the
 * header: it is re-minted for the new person, or dropped if that person is
 * unknown to Thunderhub.
 */
@Injectable()
export class TrustedHeaderMiddleware implements NestMiddleware {
  private readonly headerName: string;
  private readonly proxies: TrustedProxies;

  constructor(
    private readonly configService: ConfigService,
    private readonly principalService: PrincipalService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    this.headerName = configService.get<string>('trustedAuthHeader') || '';
    this.proxies = new TrustedProxies(
      configService.get<string[]>('trustedProxyIps') || []
    );
  }

  async use(req: Request, res: Response, next: NextFunction) {
    if (!this.headerName) {
      next();
      return;
    }

    try {
      const identifier = readTrustedIdentifier(req.headers, this.headerName);
      if (!identifier) {
        next();
        return;
      }

      const jwtSecret = this.configService.get<string>('jwtSecret') || '';
      const useHttps = !!this.configService.get<boolean>('useHttps');
      const cookieHeader = Array.isArray(req.headers.cookie)
        ? req.headers.cookie.join('; ')
        : req.headers.cookie;
      const session = readSession(cookieHeader, jwtSecret);
      const via = identifier.toLowerCase();

      // Fast path: the session was minted from this very identifier.
      if (session?.via === via) {
        next();
        return;
      }

      // The socket peer, never a forwarded header: only the proxy itself
      // may assert who the user is.
      const remoteAddress = req.socket?.remoteAddress;
      if (!this.proxies.allows(remoteAddress)) {
        this.logger.debug(
          `Ignoring trusted header from untrusted address ${remoteAddress || 'unknown'}`
        );
        next();
        return;
      }

      const principal =
        await this.principalService.fromTrustedIdentifier(identifier);

      if (!principal) {
        this.logger.debug(
          `Trusted header identifier "${identifier}" does not match a user`
        );

        // A session this header created earlier now belongs to someone the
        // proxy no longer vouches for; end it rather than serve it to the
        // person currently signed in at the proxy.
        if (session?.via) {
          req.headers.cookie = withAuthCookie(cookieHeader, '');
          appendSetCookie(res, serializeExpiredSessionCookie(useHttps));
          this.logger.info(
            `Trusted header session for ${session.sub} ended: header now names an unknown user`
          );
        }

        next();
        return;
      }

      const current = session
        ? this.principalService.fromSubject(session.sub)
        : null;
      const switching = current && !samePrincipal(current, principal);

      const token = signSessionToken(principal, jwtSecret, { via });
      req.headers.cookie = withAuthCookie(cookieHeader, token);
      appendSetCookie(res, serializeSessionCookie(token, useHttps));

      const subject = this.principalService.toSubject(principal);
      if (switching) {
        this.logger.info(
          `Trusted header switched session from ${session?.sub} to ${subject}`
        );
      } else if (!current) {
        this.logger.info(`Trusted header session created for ${subject}`);
      }
    } catch (error) {
      this.logger.error('Trusted header authentication failed', { error });
    }

    next();
  }
}
