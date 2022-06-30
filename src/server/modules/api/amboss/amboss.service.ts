import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Interval } from '@nestjs/schedule';
import { getWalletInfo } from 'lightning';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { getNetwork } from 'src/server/utils/network';
import { Logger } from 'winston';
import { AccountsService } from '../../accounts/accounts.service';
import { FetchService } from '../../fetch/fetch.service';
import { pingHealthCheckMutation, saveBackupMutation } from './amboss.gql';
import { auto, map, each } from 'async';
import { NodeService } from '../../node/node.service';
import { UserConfigService } from '../userConfig/userConfig.service';

const ONE_MINUTE = 60 * 1000;

type NodeType = {
  id: string;
  name: string;
  pubkey: string;
  lnd: any;
};

@Injectable()
export class AmbossService {
  constructor(
    private nodeService: NodeService,
    private fetchService: FetchService,
    private configService: ConfigService,
    private accountsService: AccountsService,
    private userConfigService: UserConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  ambossUrl = this.configService.get('urls.amboss');

  async pushBackup(backup: string, signature: string) {
    const { data, error } = await this.fetchService.graphqlFetchWithProxy(
      this.ambossUrl,
      saveBackupMutation,
      { backup, signature }
    );

    if (!data?.saveBackup || error) {
      this.logger.error('Error pushing backup to Amboss', { error, data });
      throw new Error('Error pushing backup to Amboss');
    }
  }

  async pingHealthCheck(timestamp: string, signature: string) {
    const { data, error } = await this.fetchService.graphqlFetchWithProxy(
      this.ambossUrl,
      pingHealthCheckMutation,
      { timestamp, signature }
    );

    if (!data?.healthCheck || error) {
      this.logger.error('Error pinging Amboss for a healthcheck', {
        error,
        data,
      });
      throw new Error('Error pinging Amboss for a healthcheck');
    }
  }

  @Interval(ONE_MINUTE)
  async ping() {
    const disabled = this.configService.get('amboss.disableHealthCheckPings');

    if (disabled) {
      this.logger.silly('Healthchecks are disabled in the server.');
      return;
    }

    const { healthCheckPingEnabled } = this.userConfigService.getConfig();

    if (!healthCheckPingEnabled) {
      this.logger.silly('Healthchecks are disabled.');
      return;
    }

    await auto({
      // Get Authenticated LND objects for each node
      getNodes: async () => {
        const accounts = this.accountsService.getAllAccounts();

        const validAccounts = [];

        for (const key in accounts) {
          if (accounts.hasOwnProperty(key)) {
            const account = accounts[key];
            if (!account.encrypted) {
              validAccounts.push({ id: account.hash, lnd: account.lnd });
            }
          }
        }

        return validAccounts;
      },

      // Try to connect to nodes
      checkNodes: [
        'getNodes',
        async ({ getNodes }) => {
          return map(getNodes, async ({ lnd, id }) => {
            try {
              const info = await getWalletInfo({ lnd });

              const network = getNetwork(info?.chains?.[0] || '');
              const sliced = info.public_key.slice(0, 10);
              const name = `${info.alias}(${sliced})[${network}]`;

              return {
                id,
                name,
                pubkey: info.public_key,
                lnd,
                network,
              };
            } catch (err) {
              this.logger.error('Error connecting to node', {
                id,
                err,
              });
            }
          });
        },
      ],

      // Check which nodes are available and remove duplicates
      checkAvailable: [
        'checkNodes',
        async ({ checkNodes }: { checkNodes: NodeType[] }) => {
          const unique = checkNodes.filter(Boolean);

          if (!unique.length) {
            throw new Error('No node available for healthcheck ping');
          }

          const names = unique.map(a => a.name);

          this.logger.info(`Connected to ${names.join(', ')}`);

          return unique;
        },
      ],

      pingAmboss: [
        'checkAvailable',
        async ({ checkAvailable }) => {
          const isProduction = this.configService.get('isProduction');

          await each(checkAvailable, async node => {
            if (!isProduction) {
              this.logger.silly(
                'Health check pings are only sent in production',
                { node: node.name }
              );
              return;
            }

            if (node.network !== 'btc') {
              this.logger.silly(
                'Health check pings are only sent for mainnet',
                { node: node.name }
              );
              return;
            }

            const timestamp = new Date().toISOString();

            const { signature } = await this.nodeService.signMessage(
              node.id,
              timestamp
            );

            await this.pingHealthCheck(timestamp, signature);
          });
        },
      ],
    })
      .then(result => {
        const nodes = result.checkAvailable.length;
        this.logger.debug(`Finished healthcheck pings for ${nodes} nodes.`);
      })
      .catch(error => {
        this.logger.error(error.message);
      });
  }
}
