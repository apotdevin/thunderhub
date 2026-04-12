import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TapdNodeService } from '../../node/tapd/tapd-node.service';
import { toWithError } from '../../../utils/async';

@Injectable()
export class TapFederationService {
  private joinedHostsByAccount = new Map<string, Set<string>>();

  constructor(
    private tapdNodeService: TapdNodeService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async syncForAccount(accountId: string, hosts: string[]): Promise<void> {
    if (!hosts.length) return;

    let accountHosts = this.joinedHostsByAccount.get(accountId);
    if (!accountHosts) {
      accountHosts = new Set<string>();
      this.joinedHostsByAccount.set(accountId, accountHosts);
    }

    const newHosts = hosts.filter(h => !accountHosts.has(h));
    if (!newHosts.length) return;

    for (const host of newHosts) {
      const [, error] = await toWithError(
        this.tapdNodeService.addFederationServer({ id: accountId, host })
      );

      if (error) {
        this.logger.warn('Failed to join federation', {
          error,
          host,
          accountId,
        });
        continue;
      }

      accountHosts.add(host);
    }

    this.logger.info('Joined federation for new universe hosts', {
      hosts: newHosts,
      accountId,
    });
  }
}
