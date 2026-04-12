import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TapdNodeService } from '../../node/tapd/tapd-node.service';
import { toWithError } from '../../../utils/async';

@Injectable()
export class TapFederationService {
  constructor(
    private tapdNodeService: TapdNodeService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async syncForAccount(accountId: string, hosts: string[]): Promise<void> {
    if (!hosts.length) return;

    const account = this.tapdNodeService.getAccount(accountId);
    const ownHost = account.socket;

    const [existing, listError] = await toWithError(
      this.tapdNodeService.listFederationServers({ id: accountId })
    );

    if (listError) {
      this.logger.warn('Failed to list federation servers', {
        error: listError,
        accountId,
      });
      return;
    }

    const existingHosts = new Set((existing?.servers ?? []).map(s => s.host));

    const newHosts = hosts.filter(h => h !== ownHost && !existingHosts.has(h));

    this.logger.silly('Starting host syncing for account', {
      accountId,
      existingHosts: [...existingHosts],
      hosts,
      newHosts,
    });

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
    }

    this.logger.info('Joined federation for new universe hosts', {
      hosts: newHosts,
      accountId,
    });
  }
}
