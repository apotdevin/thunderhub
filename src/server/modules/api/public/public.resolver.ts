import {
  Args,
  Context,
  Mutation,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
import { Public } from '../../security/security.decorators';
import { Throttle, seconds } from '@nestjs/throttler';
import { UserService } from '../../user/user.service';
import { AccountsService } from '../../accounts/accounts.service';
import { FilesService } from '../../files/files.service';
import { NodeService } from '../../node/node.service';
import { ContextType } from 'src/server/app.module';
import { toWithError } from 'src/server/utils/async';
import { decodeMacaroon, isCorrectPassword } from 'src/server/utils/crypto';
import { AuthType } from '../../security/security.types';
import {
  serializeSessionCookie,
  signSessionToken,
} from '../../security/session-cookie';
import { Principal } from '../../principal/principal.types';
import { PrincipalService } from '../../principal/principal.service';
import { createGuardrails, verifySync } from 'otplib';
import { CreateInitialUserResult, PublicMutation } from './public.types';

@Resolver(() => PublicMutation)
export class PublicResolver {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly accountsService: AccountsService,
    private readonly filesService: FilesService,
    private readonly nodeService: NodeService,
    private readonly principalService: PrincipalService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Public()
  @Throttle({ default: { limit: 4, ttl: seconds(10) } })
  @Mutation(() => PublicMutation)
  async public() {
    return {};
  }

  private startSession(res: ContextType['res'], principal: Principal): void {
    const jwtSecret = this.configService.get('jwtSecret');
    const useHttps = this.configService.get('useHttps');

    const token = signSessionToken(principal, jwtSecret);
    res.setHeader('Set-Cookie', serializeSessionCookie(token, useHttps));
  }

  @ResolveField(() => CreateInitialUserResult)
  async create_initial_user(
    @Args('email') email: string,
    @Args('password') password: string
  ): Promise<CreateInitialUserResult> {
    if (!this.userService.isDbEnabled()) {
      throw new Error('Database is not enabled');
    }

    const needsSetup = await this.userService.needsSetup();
    if (!needsSetup) {
      throw new Error('Initial setup has already been completed');
    }

    if (!email || !email.includes('@')) {
      throw new Error('A valid email is required');
    }

    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    this.logger.info('Creating initial owner user', { email });

    return this.userService.createInitialUser(email, password);
  }

  @ResolveField(() => Boolean)
  async get_auth_token(
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

      const [, error] = await toWithError(
        this.nodeService.getWalletInfo(ssoAccount.hash)
      );

      if (error) {
        this.logger.error('Unable to connect to this node', { error });
        throw new Error('UnableToConnectToThisNode');
      }

      this.startSession(res, { type: AuthType.YAML, id: 'sso' });
      return true;
    }

    this.logger.debug(`Cookie ${cookie} different to file ${cookieFile}`);
    return false;
  }

  /**
   * Signs in a person by identifier and password: a YAML user with a
   * password, or a database user by email.
   */
  @ResolveField(() => Boolean)
  async get_db_session_token(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() { res }: ContextType
  ): Promise<boolean> {
    const principal = await this.principalService.fromCredentials(
      email,
      password
    );

    if (!principal) {
      throw new Error('Wrong credentials for login');
    }

    this.startSession(res, principal);

    this.logger.debug(`Session token created for ${principal.type} login`);

    return true;
  }

  @ResolveField(() => String)
  async get_session_token(
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
    const disable2FA = this.configService.get('disable2FA');

    // Accounts that only list users have no password to check.
    if (!account.password) {
      this.logger.debug(`Account ${id} has no password login`);
      throw new Error('Wrong credentials for login');
    }

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
        const { valid } = verifySync({
          token,
          secret: account.twofaSecret,
          epochTolerance: 30,
          guardrails: createGuardrails({
            MIN_SECRET_BYTES: 10,
          }),
        });
        if (!valid) {
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

    this.startSession(res, { type: AuthType.YAML, id });
    return info?.['version'] || ''; // TODO: Remove unsafe casting when GetWalletInfo type is updated
  }
}
