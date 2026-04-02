import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccountsService } from '../../accounts/accounts.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesService } from '../../files/files.service';
import * as cookieLib from 'cookie';
import { ContextType } from 'src/server/app.module';
import { appConstants } from 'src/server/utils/appConstants';
import { NodeService } from '../../node/node.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import { generateSecret, generateURI, verifySync } from 'otplib';
import { shorten } from 'src/server/utils/string';
import { TwofaResult } from './auth.types';

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
      const { valid } = verifySync({ token, secret, epochTolerance: 30 });

      if (!valid) {
        throw new Error('Invalid token');
      }
    } catch (error) {
      this.logger.error('Error validating token', { error });
      throw new Error('Error validating token');
    }

    const accountConfigPath = this.configService.get('accountConfigPath');
    this.filesService.updateTwofaSecret(
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
      const { valid } = verifySync({
        token,
        secret: account.twofaSecret,
        epochTolerance: 30,
      });

      if (!valid) {
        throw new Error('Invalid token');
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

  @Mutation(() => Boolean)
  async logout(@Context() { res }: ContextType) {
    const useHttps = this.configService.get('useHttps');
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
            secure: useHttps,
          })
        );
      }
    }

    res.setHeader('Set-Cookie', cookies);

    return true;
  }
}
