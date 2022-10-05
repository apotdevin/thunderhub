import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Interval } from '@nestjs/schedule';
import { getWalletInfo } from 'lightning';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { getNetwork } from 'src/server/utils/network';
import { Logger } from 'winston';
import { AccountsService } from '../../accounts/accounts.service';
import { FetchService } from '../../fetch/fetch.service';
import {
  pingHealthCheckMutation,
  pushBalancesMutation,
  saveBackupMutation,
} from './amboss.gql';
import { auto, map, each } from 'async';
import { NodeService } from '../../node/node.service';
import { UserConfigService } from '../userConfig/userConfig.service';
import { getSHA256Hash } from 'src/server/utils/crypto';

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

  async pushBalancesToAmboss(
    timestamp: string,
    signature: string,
    onchainBalance: string,
    channels: { balance: string; capacity: string; chan_id: string }[]
  ) {
    const { data, error } = await this.fetchService.graphqlFetchWithProxy(
      this.ambossUrl,
      pushBalancesMutation,
      { input: { signature, timestamp, channels, onchainBalance } }
    );

    if (!data?.pushBalances || error) {
      this.logger.error('Error pushing balances to Amboss', {
        error,
        data,
      });
      throw new Error('Error pushing balances to Amboss');
    }
  }

  @Interval(ONE_MINUTE)
  async ping() {
    const isProduction = this.configService.get('isProduction');
    const disabled = this.configService.get('amboss.disableHealthCheckPings');

    if (!isProduction) {
      this.logger.silly('Health check pings are only sent in production');
      return;
    }

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

          this.logger.silly(
            `Connected to ${names.join(', ')} for healthcheck ping`
          );

          return unique;
        },
      ],

      pingAmboss: [
        'checkAvailable',
        async ({ checkAvailable }) => {
          await each(checkAvailable, async node => {
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
        this.logger.silly(
          `Finished healthcheck pings for ${nodes} node${
            nodes.length > 1 ? 's' : ''
          }.`
        );
      })
      .catch(error => {
        this.logger.error(error.message);
      });
  }

  @Interval(ONE_MINUTE)
  async pushBalances() {
    const isProduction = this.configService.get('isProduction');
    const disabled = this.configService.get('amboss.disableBalancePushes');

    if (!isProduction) {
      this.logger.silly('Balance pushes are only sent in production');
      return;
    }

    if (disabled) {
      this.logger.silly('Balance pushes are disabled in the server.');
      return;
    }

    const {
      onchainPushEnabled,
      channelPushEnabled,
      privateChannelPushEnabled,
    } = this.userConfigService.getConfig();

    if (
      !channelPushEnabled &&
      !privateChannelPushEnabled &&
      !onchainPushEnabled
    ) {
      this.logger.silly('Balance pushes are disabled.');
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
            throw new Error('No node available for balance pushes');
          }

          const names = unique.map(a => a.name);

          this.logger.silly(
            `Connected to ${names.join(', ')} for balance pushes`
          );

          return unique;
        },
      ],

      pingAmboss: [
        'checkAvailable',
        async ({ checkAvailable }) => {
          await each(checkAvailable, async node => {
            if (node.network !== 'btc') {
              this.logger.silly('Balance pushes are only sent for mainnet', {
                node: node.name,
              });
              return;
            }

            let onchain;
            let message = '';

            if (onchainPushEnabled) {
              const { chain_balance } = await this.nodeService.getChainBalance(
                node.id
              );
              const { pending_chain_balance } =
                await this.nodeService.getPendingChainBalance(node.id);

              onchain = (chain_balance + pending_chain_balance).toString();
              message += onchain;
            }

            const allChannels = [];

            if (channelPushEnabled) {
              const channels = await this.nodeService.getChannels(node.id, {
                is_public: true,
              });

              if (!channels.channels.length) return;

              const mapped = channels.channels.map(c => ({
                chan_id: c.id,
                balance: c.local_balance + '',
                capacity: c.capacity + '',
              }));

              allChannels.push(...mapped);
            }

            if (privateChannelPushEnabled) {
              const privateChannels = await this.nodeService.getChannels(
                node.id,
                { is_private: true }
              );

              if (!privateChannels.channels.length) return;

              const mapped = privateChannels.channels.map(c => ({
                chan_id: c.id,
                balance: c.local_balance + '',
                capacity: c.capacity + '',
              }));

              allChannels.push(...mapped);
            }

            if (allChannels.length) {
              const infoString = allChannels.reduce((p, c) => {
                return p + `${c.chan_id}${c.balance}${c.capacity || ''}`;
              }, '');

              message += getSHA256Hash(infoString);
            }

            const timestamp = new Date().toISOString();
            const finalMessage = timestamp + message;

            const { signature } = await this.nodeService.signMessage(
              node.id,
              finalMessage
            );

            this.logger.info('Push Info', {
              onchainBalance: !!onchain,
              amountOfChannels: allChannels.length,
              finalMessage,
              signature,
            });

            await this.pushBalancesToAmboss(
              timestamp,
              signature,
              onchain,
              allChannels
            );
          });
        },
      ],
    })
      .then(result => {
        const nodes = result.checkAvailable.length;
        this.logger.silly(
          `Finished balance pushes for ${nodes} node${
            nodes.length > 1 ? 's' : ''
          }.`
        );
      })
      .catch(error => {
        this.logger.error(error.message);
      });
  }
}
