import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Interval } from '@nestjs/schedule';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { FetchService } from '../../fetch/fetch.service';
import { TapdNodeService } from '../../node/tapd/tapd-node.service';
import { AccountsService } from '../../accounts/accounts.service';
import { ProviderRegistryService } from '../../node/provider-registry.service';
import { Capability } from '../../node/lightning.types';
import { toWithError } from '../../../utils/async';
import { getSupportedAssetsQuery } from './tapd.gql';

interface TradeApiAsset {
  taproot_asset_details?: { universe?: string };
}

const ONE_HOUR_MS = 60 * 60 * 1000;

@Injectable()
export class TapFederationService implements OnApplicationBootstrap {
  private joinedHosts = new Set<string>();

  constructor(
    private tapdNodeService: TapdNodeService,
    private accountsService: AccountsService,
    private providerRegistry: ProviderRegistryService,
    private fetchService: FetchService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    // Run on a short delay so the rest of the app finishes starting up
    setTimeout(() => this.syncFederation(), 5000);
  }

  @Interval(ONE_HOUR_MS)
  async syncFederation(): Promise<void> {
    const tradeUrl = this.configService.get<string>('urls.trade');
    if (!tradeUrl) return;

    const universeHosts = await this.fetchUniverseHosts(tradeUrl);
    if (!universeHosts.length) return;

    const newHosts = universeHosts.filter(h => !this.joinedHosts.has(h));
    if (!newHosts.length) return;

    const accountIds = this.getTapdAccountIds();
    if (!accountIds.length) return;

    for (const id of accountIds) {
      for (const host of newHosts) {
        const [, error] = await toWithError(
          this.tapdNodeService.addFederationServer({ id, host })
        );
        if (error) {
          this.logger.warn('Failed to join federation', {
            error,
            host,
            accountId: id,
          });
        }
      }
    }

    for (const host of newHosts) {
      this.joinedHosts.add(host);
    }

    this.logger.info('Joined federation for new universe hosts', {
      hosts: newHosts,
    });
  }

  private async fetchUniverseHosts(tradeUrl: string): Promise<string[]> {
    const { data, error } = await this.fetchService.graphqlFetchWithProxy<{
      public: {
        assets: {
          supported: {
            list: TradeApiAsset[];
          };
        };
      };
    }>(tradeUrl, getSupportedAssetsQuery);

    if (error || !data?.public?.assets?.supported) {
      if (error)
        this.logger.error('Error fetching supported assets for federation', {
          error,
        });
      return [];
    }

    return [
      ...new Set(
        data.public.assets.supported.list
          .map(a => a.taproot_asset_details?.universe)
          .filter((h): h is string => !!h)
      ),
    ];
  }

  private getTapdAccountIds(): string[] {
    const accounts = this.accountsService.getAllAccounts();
    return Object.entries(accounts)
      .filter(([, account]) => {
        if (!this.providerRegistry.hasProvider(account.type)) return false;
        const provider = this.providerRegistry.getProvider(account.type);
        return provider.getCapabilities().has(Capability.TAPROOT_ASSETS);
      })
      .map(([id]) => id);
  }
}
