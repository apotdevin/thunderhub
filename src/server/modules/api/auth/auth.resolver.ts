import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccountsService } from '../../accounts/accounts.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesService } from '../../files/files.service';
import jwt from 'jsonwebtoken';
import * as cookieLib from 'cookie';
import { ContextType } from 'src/server/app.module';
import { appConstants } from 'src/server/utils/appConstants';
import { NodeService } from '../../node/node.service';
import { toWithError } from 'src/server/utils/async';
import { decodeMacaroon, isCorrectPassword } from 'src/server/utils/crypto';
import { CurrentUser, Public } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import { generateSecret, generateURI, verifySync } from 'otplib';
import { shorten } from 'src/server/utils/string';
import { TwofaResult } from './auth.types';
import { Throttle, seconds } from '@nestjs/throttler';

@Resolver()
export class AuthResolver {
  constructor(
    private configService: ConfigService,
    private accountsService: AccountsService,
    private filesService: FilesService,
    private nodeService: NodeService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => TwofaResult)
  async getTwofaSecret(@CurrentUser() { id }: UserId) {
    const account = this.accountsService.getAccount(id);

    if (!account) {
      throw new Error('Account not found');
    }

    if (!!account.twofaSecret) {
      throw new Error('2FA is already enabled for this account.');
    }

    if (account.hash === 'sso') {
      throw new Error('2FA can not be enabled for SSO accounts');
    }

    const node = await this.nodeService.getWalletInfo(id);

    const secret = generateSecret();

    const otpauth = generateURI({
      secret,
      label: shorten(node.public_key),
      issuer: 'ThunderHub',
    });

    return { url: otpauth, secret };
  }

  @Mutation(() => Boolean)
  async updateTwofaSecret(
    @CurrentUser() { id }: UserId,
    @Args('secret') secret: string,
    @Args('token') token: string
  ) {
    const account = this.accountsService.getAccount(id);

    if (!account) {
      throw new Error('Account not found');
    }

    if (!!account.twofaSecret) {
      throw new Error('2FA is already enabled for this account.');
    }

    if (account.hash === 'sso') {
      throw new Error('2FA can not be enabled for SSO accounts');
    }

    try {
      const isValid = verifySync({ token, secret, epochTolerance: 30 });

      if (!isValid) {
        throw new Error();
      }
    } catch (error) {
      this.logger.error('Error validating token', { error });
      throw new Error('Error validating token');
    }

    const accountConfigPath = this.configService.get('accountConfigPath');
    await this.filesService.updateTwofaSecret(
      accountConfigPath,
      account.index,
      secret
    );

    this.accountsService.updateAccountSecret(id, secret);

    return true;
  }

  @Mutation(() => Boolean)
  async removeTwofaSecret(
    @CurrentUser() { id }: UserId,
    @Args('token') token: string
  ) {
    const account = this.accountsService.getAccount(id);

    if (!account) {
      throw new Error('Account not found');
    }

    if (!account.twofaSecret) {
      throw new Error('2FA is not enabled for this account.');
    }

    try {
      const isValid = verifySync({
        token,
        secret: account.twofaSecret,
        epochTolerance: 30,
      });

      if (!isValid) {
        throw new Error();
      }
    } catch (error) {
      this.logger.error('Error validating token', { error });
      throw new Error('Error validating token');
    }

    const accountConfigPath = this.configService.get('accountConfigPath');
    await this.filesService.updateTwofaSecret(
      accountConfigPath,
      account.index,
      ''
    );

    this.accountsService.updateAccountSecret(id, '');

    return true;
  }

  @Public()
  @Throttle({ default: { limit: 4, ttl: seconds(10) } })
  @Mutation(() => Boolean)
  async getAuthToken(
    @Args('cookie', { nullable: true }) cookie: string,
    @Context() { res }: ContextType
  ) {
    const dangerousNoSSOAuth = this.configService.get('sso.dangerousNoSSOAuth');
    const cookiePath = this.configService.get('cookiePath');
    const isProduction = this.configService.get('isProduction');
    const secureCookie = this.configService.get('secureCookie');

    const ssoAccount = this.accountsService.getAccount('sso');

    if (!ssoAccount) {
      this.logger.warn('No SSO account available');
      return false;
    }

    if (dangerousNoSSOAuth) {
      this.logger.warn(
        'SSO authentication is disabled. Make sure this is what you want.'
      );
    } else {
      // No cookie or cookiePath needed when SSO authentication is turned off
      if (!cookie) {
        return false;
      }

      if (cookiePath === '') {
        this.logger.warn(
          'SSO auth not available since no cookie path was provided'
        );
        return false;
      }
    }

    if (!isProduction) {
      this.logger.warn('SSO authentication is disabled in development.');
    }

    const cookieFile = this.filesService.readCookie();

    if (
      (cookieFile && cookieFile.trim() === cookie.trim()) ||
      !isProduction ||
      dangerousNoSSOAuth
    ) {
      this.filesService.refreshCookie();

      const [, error] = await toWithError(
        this.nodeService.getWalletInfo(ssoAccount.hash)
      );

      if (error) {
        this.logger.error('Unable to connect to this node', { error });
        throw new Error('UnableToConnectToThisNode');
      }

      const jwtSecret = this.configService.get('jwtSecret');
      const token = jwt.sign({ sub: 'sso' }, jwtSecret, {
        algorithm: 'HS256',
        expiresIn: '24h',
      });

      res.setHeader(
        'Set-Cookie',
        cookieLib.serialize(appConstants.cookieName, token, {
          httpOnly: true,
          sameSite: true,
          path: '/',
          secure: secureCookie,
        })
      );
      return true;
    }

    this.logger.debug(`Cookie ${cookie} different to file ${cookieFile}`);
    return false;
  }

  @Public()
  @Throttle({ default: { limit: 4, ttl: seconds(10) } })
  @Mutation(() => String)
  async getSessionToken(
    @Args('id') id: string,
    @Args('password') password: string,
    @Args('token', { nullable: true }) token: string,
    @Context() { res }: ContextType
  ) {
    const account = this.accountsService.getAccount(id);

    if (!account) {
      this.logger.debug(`Account ${id} not found`);
      throw new Error('Wrong credentials for login');
    }

    const isProduction = this.configService.get('isProduction');
    const secureCookie = this.configService.get('secureCookie');
    const disable2FA = this.configService.get('disable2FA');

    if (account.encrypted) {
      // In development NestJS rebuilds the files so this only works in production env.
      if (!isProduction) {
        const message =
          'Encrypted accounts only work in a production environment';

        this.logger.error(message);
        throw new Error(message);
      }

      const macaroon = decodeMacaroon(account.encryptedMacaroon, password);

      // Store decrypted macaroon in memory.
      this.accountsService.updateAccountMacaroon(id, macaroon);

      this.logger.debug(`Decrypted the macaroon for account ${id}`);
    } else {
      if (!isCorrectPassword(password, account.password)) {
        this.logger.error(`Authentication failed - Invalid Password!`);
        throw new Error('Wrong credentials for login');
      }

      this.logger.debug(`Correct password for account ${id}`);
    }

    if (account.twofaSecret && !disable2FA) {
      if (!token) {
        this.logger.error('No 2FA token provided but is needed');
        throw new Error('Wrong credentials for login');
      }

      try {
        const isValid = verifySync({
          token,
          secret: account.twofaSecret,
          epochTolerance: 30,
        });
        if (!isValid) {
          throw new Error('token not valid');
        }
      } catch (err) {
        this.logger.error('Error verifying token validity', { err });
        throw new Error('Wrong credentials for login');
      }
    }

    const [info, error] = await toWithError(
      this.nodeService.getWalletInfo(account.hash)
    );

    if (error) {
      this.logger.error('Unable to connect to this node', { error });
      throw new Error('UnableToConnectToThisNode');
    }

    const jwtSecret = this.configService.get('jwtSecret');
    const jwtToken = jwt.sign({ sub: id }, jwtSecret, {
      algorithm: 'HS256',
      expiresIn: '24h',
    });

    res.setHeader(
      'Set-Cookie',
      cookieLib.serialize(appConstants.cookieName, jwtToken, {
        httpOnly: true,
        sameSite: true,
        path: '/',
        secure: secureCookie,
      })
    );
    return info?.['version'] || ''; // TODO: Remove unsafe casting when GetWalletInfo type is updated
  }

  @Mutation(() => Boolean)
  async logout(@Context() { res }: ContextType) {
    const secureCookie = this.configService.get('secureCookie');
    const cookies = [];

    for (const cookieName in appConstants) {
      if (Object.prototype.hasOwnProperty.call(appConstants, cookieName)) {
        const name = appConstants[cookieName];

        cookies.push(
          cookieLib.serialize(name, '', {
            maxAge: -1,
            httpOnly: true,
            sameSite: true,
            path: '/',
            secure: secureCookie,
          })
        );
      }
    }

    res.setHeader('Set-Cookie', cookies);

    return true;
  }
}
