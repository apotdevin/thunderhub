import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AccountsService } from '../../accounts/accounts.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesService } from '../../files/files.service';
import jwt from 'jsonwebtoken';
import cookieLib from 'cookie';
import { ContextType } from 'src/server/app.module';
import { appConstants } from 'src/server/utils/appConstants';
import { NodeService } from '../../node/node.service';
import { toWithError } from 'src/server/utils/async';
import { decodeMacaroon, isCorrectPassword } from 'src/server/utils/crypto';
import { CurrentIp, Public } from '../../security/security.decorators';

@Resolver()
export class AuthResolver {
  constructor(
    private configService: ConfigService,
    private accountsService: AccountsService,
    private filesService: FilesService,
    private nodeService: NodeService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Public()
  @Mutation(() => Boolean)
  async getAuthToken(
    @Args('cookie', { nullable: true }) cookie: string,
    @Context() { res }: ContextType
  ) {
    const dangerousNoSSOAuth = this.configService.get('sso.dangerousNoSSOAuth');
    const cookiePath = this.configService.get('cookiePath');
    const isProduction = this.configService.get('isProduction');

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

      const [info, error] = await toWithError(
        this.nodeService.getWalletInfo(ssoAccount.hash)
      );

      console.log(info);

      if (error) {
        this.logger.error('Unable to connect to this node', { error });
        throw new Error('UnableToConnectToThisNode');
      }

      const jwtSecret = this.configService.get('jwtSecret');
      const token = jwt.sign({ sub: 'sso' }, jwtSecret);

      res.setHeader(
        'Set-Cookie',
        cookieLib.serialize(appConstants.cookieName, token, {
          httpOnly: true,
          sameSite: true,
          path: '/',
        })
      );
      return true;
    }

    this.logger.debug(`Cookie ${cookie} different to file ${cookieFile}`);
    return false;
  }

  @Public()
  @Mutation(() => String)
  async getSessionToken(
    @Args('id') id: string,
    @Args('password') password: string,
    @CurrentIp() ip: string,
    @Context() { res }: ContextType
  ) {
    const account = this.accountsService.getAccount(id);

    if (!account) {
      this.logger.debug(`Account ${id} not found`);
      return '';
    }

    const isProduction = this.configService.get('isProduction');

    if (account.encrypted) {
      if (!isProduction) {
        this.logger.error(
          'Encrypted accounts only work in a production environment'
        );
        throw new Error('UnableToLogin');
      }

      const macaroon = decodeMacaroon(account.encryptedMacaroon, password);

      // Store decrypted macaroon in memory.
      // In development NextJS rebuilds the files so this only works in production env.
      account.macaroon = macaroon;

      this.logger.debug(`Decrypted the macaroon for account ${id}`);
    } else {
      if (!isCorrectPassword(password, account.password)) {
        this.logger.error(
          `Authentication failed from ip: ${ip} - Invalid Password!`
        );
        throw new Error('WrongPasswordForLogin');
      }

      this.logger.debug(`Correct password for account ${id}`);
    }

    const [info, error] = await toWithError(
      this.nodeService.getWalletInfo(account.hash)
    );

    if (error) {
      this.logger.error('Unable to connect to this node', { error });
      throw new Error('UnableToConnectToThisNode');
    }

    const jwtSecret = this.configService.get('jwtSecret');
    const token = jwt.sign({ sub: id }, jwtSecret);

    res.setHeader(
      'Set-Cookie',
      cookieLib.serialize(appConstants.cookieName, token, {
        httpOnly: true,
        sameSite: true,
        path: '/',
      })
    );
    return info?.version || '';
  }

  @Public()
  @Mutation(() => Boolean)
  async logout(@Context() { res }: ContextType) {
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
          })
        );
      }
    }

    res.setHeader('Set-Cookie', cookies);

    return true;
  }
}
