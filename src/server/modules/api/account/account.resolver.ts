import { Context, Query, Resolver } from '@nestjs/graphql';
import { ContextType } from 'src/server/app.module';
import { AccountsService } from '../../accounts/accounts.service';
import { CurrentUser, Public } from '../../security/security.decorators';
import { ServerAccount } from './account.types';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';
import { UserId } from '../../security/security.types';
import { Throttle } from '@nestjs/throttler';

@Resolver()
export class AccountResolver {
  constructor(
    private accountsService: AccountsService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => ServerAccount)
  async getAccount(@CurrentUser() user: UserId): Promise<ServerAccount> {
    const currentAccount = this.accountsService.getAccount(user.id);

    if (!currentAccount) {
      this.logger.error(`No account found for id ${user.id}`);
      throw new Error('NoAccountFound');
    }

    if (user.id === 'sso') {
      return {
        name: 'SSO Account',
        id: 'sso',
        loggedIn: true,
        type: 'sso',
        twofaEnabled: false,
        peerSwapEnabled: currentAccount.peerSwapSocket !== '',
      };
    }

    return {
      name: currentAccount.name,
      id: user.id,
      loggedIn: true,
      type: 'server',
      twofaEnabled: !!currentAccount.twofaSecret,
      peerSwapEnabled: currentAccount.peerSwapSocket !== '',
    };
  }

  @Public()
  @Throttle(4, 10)
  @Query(() => [ServerAccount])
  async getServerAccounts(
    @Context() { authToken }: ContextType
  ): Promise<ServerAccount[]> {
    const currentAccount = this.accountsService.getAccount(authToken?.sub);
    const accounts = this.accountsService.getAllAccounts();

    const mapped: ServerAccount[] = [];

    for (const key in accounts) {
      if (Object.prototype.hasOwnProperty.call(accounts, key)) {
        const account = accounts[key];
        const { name, hash } = account;

        if (currentAccount?.hash === 'sso' || key !== 'sso') {
          mapped.push({
            name,
            id: hash,
            loggedIn: currentAccount?.hash === key,
            type: key === 'sso' ? 'sso' : 'server',
            twofaEnabled: false,
            peerSwapEnabled: currentAccount.peerSwapSocket !== '',
          });
        }
      }
    }

    return mapped;
  }
}
