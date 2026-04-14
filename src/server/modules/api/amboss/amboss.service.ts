import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Interval } from '@nestjs/schedule';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
  getAmbossAuthUrl,
  getAmbossMagmaUrl,
  getAmbossSpaceUrl,
  getAmbossTradeUrl,
  getNetwork,
} from 'src/server/utils/network';
import { Logger } from 'winston';
import { AccountsService } from '../../accounts/accounts.service';
import { FetchService } from '../../fetch/fetch.service';
import { UserService } from '../../user/user.service';
import { AuthType, UserId } from '../../security/security.types';
import {
  CreateApiKey,
  NodeLogin,
  NodeLoginInfo,
  getEdgeInfoBatchQuery,
  getNodeAliasBatchQuery,
  pingHealthCheckMutation,
  pushNodeBalancesMutation,
  saveBackupMutation,
} from './amboss.gql';
import { auto, map, each } from 'async';
import { NodeService } from '../../node/node.service';
import { UserConfigService } from '../userConfig/userConfig.service';
import { getSHA256Hash } from 'src/server/utils/crypto';
import { orderBy } from 'lodash';
import {
  getMappedChannelInfo,
  mapEdgeResult,
  mapNodeResult,
} from './amboss.helpers';
import { EdgeInfo, NodeAlias } from './amboss.types';
import { toWithError } from 'src/server/utils/async';

const ONE_MINUTE = 60 * 1000;
const SIX_MONTHS_SECONDS = 60 * 60 * 24 * 30 * 6;

type AmbossNode = {
  id: string;
  name: string;
  pubkey: string;
};

type ChannelBalanceInputType = {
  signature: string;
  timestamp: string;
  pendingChannelBalance?: {
    local: string;
    total: string;
  };
  onchainBalance?: {
    confirmed: string;
    pending: string;
  };
  channelBalance?: {
    local: string;
    total: string;
  };
  channels: { balance: string; capacity: string; chan_id: string }[];
};

@Injectable()
export class AmbossService {
  constructor(
    private nodeService: NodeService,
    private fetchService: FetchService,
    private configService: ConfigService,
    private accountsService: AccountsService,
    private userConfigService: UserConfigService,
    private userService: UserService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  /**
   * Resolves the network for the given user.
   *
   * Priority:
   *   1. For DB users: the `network` column on the `nodes` table (recorded at
   *      add_node/edit_node time from the node's actual chain genesis hash).
   *   2. Fallback: live `getWalletInfo` on the node and derive from `chains[0]`.
   */
  async resolveNetwork(user: UserId): Promise<string | undefined> {
    if (user.authType === AuthType.USER) {
      const stored = await this.userService.getNodeNetwork(user.id);
      if (stored === 'btc' || stored === 'btcsignet') return stored;
    }
    const walletInfo = await this.nodeService.getWalletInfo(user.id);
    return getNetwork(walletInfo?.chains?.[0] || '');
  }

  /** Amboss Account/Auth URL for the user's network, or env override. */
  async resolveAuthUrl(user: UserId): Promise<string> {
    const override = this.configService.get<string>('urls.amboss.auth');
    if (override) return override;
    return getAmbossAuthUrl(await this.resolveNetwork(user));
  }

  /** Amboss Space API URL for the user's network, or env override. */
  async resolveSpaceUrl(user: UserId): Promise<string> {
    const override = this.configService.get<string>('urls.amboss.space');
    if (override) return override;
    return getAmbossSpaceUrl(await this.resolveNetwork(user));
  }

  /** Magma API URL for the user's network, or env override. */
  async resolveMagmaUrl(user: UserId): Promise<string> {
    const override = this.configService.get<string>('urls.amboss.magma');
    if (override) return override;
    return getAmbossMagmaUrl(await this.resolveNetwork(user));
  }

  /** Trade (Rails) API URL for the user's network, or env override. */
  async resolveTradeUrl(user: UserId): Promise<string> {
    const override = this.configService.get<string>('urls.amboss.trade');
    if (override) return override;
    return getAmbossTradeUrl(await this.resolveNetwork(user));
  }

  async getAmbossJWT(user: UserId): Promise<string> {
    const [walletInfo, walletError] = await toWithError(
      this.nodeService.getWalletInfo(user.id)
    );

    if (!walletInfo?.public_key || walletError) {
      if (walletError) this.logger.error(walletError);
      throw new Error('Error getting node information for Amboss login');
    }

    const override = this.configService.get<string>('urls.amboss.auth');
    let authUrl = override;
    if (!authUrl && user.authType === AuthType.USER) {
      const stored = await this.userService.getNodeNetwork(user.id);
      if (stored === 'btc' || stored === 'btcsignet') {
        authUrl = getAmbossAuthUrl(stored);
      }
    }
    if (!authUrl) {
      authUrl = getAmbossAuthUrl(getNetwork(walletInfo.chains?.[0] || ''));
    }

    // Step 1 — ask Amboss for a challenge tied to this node identifier.
    const { data: loginInfo, error: loginInfoError } =
      await this.fetchService.graphqlFetchWithProxy<{
        login: { node_login: { identifier: string; message: string } };
      }>(authUrl, NodeLoginInfo);

    if (!loginInfo?.login.node_login || loginInfoError) {
      if (loginInfoError) this.logger.error(loginInfoError);
      throw new Error('Error getting login information from Amboss');
    }

    const { identifier, message } = loginInfo.login.node_login;

    // Step 2 — sign it with the node's key.
    const [signed, signError] = await toWithError<{ signature: string }>(
      this.nodeService.signMessage(user.id, message)
    );
    if (!signed?.signature || signError) {
      if (signError) this.logger.error(signError);
      throw new Error('Error signing message to login');
    }

    // Step 3 — exchange the signature for a short-lived node-auth JWT.
    const { data: loginData, error: loginError } =
      await this.fetchService.graphqlFetchWithProxy<{
        public: { node_login: { jwt: string } };
      }>(authUrl, NodeLogin, {
        input: { identifier, signature: signed.signature },
      });

    if (!loginData?.public.node_login.jwt || loginError) {
      if (loginError) this.logger.error(loginError);
      throw new Error('Error getting login information from Amboss');
    }

    const nodeAuthJwt = loginData.public.node_login.jwt;

    // Step 4 — trade the short-lived JWT for a long-lived API key (6 months).
    const { data: apiKeyData, error: apiKeyError } =
      await this.fetchService.graphqlFetchWithProxy<{
        api_keys: { create: { token: string } };
      }>(
        authUrl,
        CreateApiKey,
        {
          input: {
            details: 'ThunderHub',
            seconds: SIX_MONTHS_SECONDS,
            pubkey: walletInfo.public_key,
          },
        },
        { authorization: `Bearer ${nodeAuthJwt}` }
      );

    if (!apiKeyData?.api_keys.create.token || apiKeyError) {
      if (apiKeyError) this.logger.error(apiKeyError);
      throw new Error('Error creating Amboss API key');
    }

    this.logger.debug('Got Amboss API key');
    return apiKeyData.api_keys.create.token;
  }

  async getNodeAliasBatchQuery(pubkeys: string[]) {
    const { data, error } = await this.fetchService.graphqlFetchWithProxy<any>(
      getAmbossSpaceUrl('btc'),
      getNodeAliasBatchQuery,
      { pubkeys }
    );

    if (!data?.getNodeAliasBatch || error) return [];

    return data.getNodeAliasBatch;
  }

  async getNodeAliasBatch(pubkeys: string[]): Promise<(NodeAlias | null)[]> {
    this.logger.info('Fetching information for nodes', {
      amount: pubkeys.length,
    });

    const start = new Date();
    const nodes = await this.getNodeAliasBatchQuery(pubkeys);
    const end = new Date();

    this.logger.debug('Time to fetch node info', {
      duration: end.getTime() - start.getTime() + ' ms',
    });

    return mapNodeResult(pubkeys, nodes);
  }

  async getEdgeInfoBatchQuery(ids: string[]) {
    const { data, error } = await this.fetchService.graphqlFetchWithProxy<any>(
      getAmbossSpaceUrl('btc'),
      getEdgeInfoBatchQuery,
      { ids }
    );

    if (!data?.getEdgeInfoBatch || error) return [];

    return data.getEdgeInfoBatch;
  }

  async getEdgeInfoBatch(ids: string[]): Promise<(EdgeInfo | null)[]> {
    this.logger.info('Fetching information for edges', {
      amount: ids.length,
    });

    const start = new Date();
    const edges = await this.getEdgeInfoBatchQuery(ids);
    const end = new Date();

    this.logger.debug('Time to fetch edge info', {
      duration: end.getTime() - start.getTime() + ' ms',
    });

    return mapEdgeResult(ids, edges);
  }

  async pushBackup(spaceUrl: string, backup: string, signature: string) {
    const { data, error } = await this.fetchService.graphqlFetchWithProxy<any>(
      spaceUrl,
      saveBackupMutation,
      { backup, signature }
    );

    if (!data?.saveBackup || error) {
      this.logger.error('Error pushing backup to Amboss', { error, data });
      throw new Error('Error pushing backup to Amboss');
    }
  }

  async pingHealthCheck(
    spaceUrl: string,
    timestamp: string,
    signature: string
  ) {
    const { data, error } = await this.fetchService.graphqlFetchWithProxy<any>(
      spaceUrl,
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

  async pushBalancesToAmboss(spaceUrl: string, input: ChannelBalanceInputType) {
    const { data, error } = await this.fetchService.graphqlFetchWithProxy<any>(
      spaceUrl,
      pushNodeBalancesMutation,
      { input }
    );

    if (!data?.pushNodeBalances || error) {
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

    await auto<any>({
      // Get Authenticated LND objects for each node
      getNodes: async () => {
        const accounts = this.accountsService.getAllAccounts();

        const validAccounts = [];

        for (const key in accounts) {
          if (accounts.hasOwnProperty(key)) {
            const account = accounts[key];
            if (!account.encrypted) {
              validAccounts.push({ id: account.hash });
            }
          }
        }

        return validAccounts;
      },

      // Try to connect to nodes
      checkNodes: [
        'getNodes',
        async ({ getNodes }: { getNodes: { id: string }[] }) => {
          return map(getNodes, async ({ id }) => {
            try {
              const info = await this.nodeService.getWalletInfo(id);

              const network = getNetwork(info?.chains?.[0] || '');
              const sliced = info.public_key.slice(0, 10);
              const name = `${info.alias}(${sliced})[${network}]`;

              return {
                id,
                name,
                pubkey: info.public_key,
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
        async ({ checkNodes }: { checkNodes: AmbossNode[] }) => {
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
        async ({
          checkAvailable,
        }: {
          checkAvailable: { id: string; network: string; name: string }[];
        }) => {
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

            await this.pingHealthCheck(
              getAmbossSpaceUrl('btc'),
              timestamp,
              signature
            );
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

    await auto<any>({
      // Get Authenticated LND objects for each node
      getNodes: async () => {
        const accounts = this.accountsService.getAllAccounts();

        const validAccounts = [];

        for (const key in accounts) {
          if (accounts.hasOwnProperty(key)) {
            const account = accounts[key];
            if (!account.encrypted) {
              validAccounts.push({ id: account.hash });
            }
          }
        }

        return validAccounts;
      },

      // Try to connect to nodes
      checkNodes: [
        'getNodes',
        async ({ getNodes }: { getNodes: { id: string }[] }) => {
          return map(getNodes, async ({ id }) => {
            try {
              const info = await this.nodeService.getWalletInfo(id);

              const network = getNetwork(info?.chains?.[0] || '');
              const sliced = info.public_key.slice(0, 10);
              const name = `${info.alias}(${sliced})[${network}]`;

              return {
                id,
                name,
                pubkey: info.public_key,
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
        async ({ checkNodes }: { checkNodes: AmbossNode[] }) => {
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
        async ({
          checkAvailable,
        }: {
          checkAvailable: { id: string; network: string; name: string }[];
        }) => {
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

              onchain = {
                confirmed: chain_balance + '',
                pending: pending_chain_balance + '',
              };

              message += `${chain_balance}${pending_chain_balance}`;
            }

            let pendingChannelBalance;

            if (channelPushEnabled) {
              pendingChannelBalance = {
                local: '0',
                total: '0',
              };

              const { pending_channels } =
                await this.nodeService.getPendingChannels(node.id);

              if (pending_channels.length) {
                const amounts = pending_channels.reduce(
                  (p, c) => {
                    if (!c) return p;

                    const local = p.local + c.local_balance;
                    const total = p.total + c.capacity;

                    return { local, total };
                  },
                  { local: 0, total: 0 }
                );

                pendingChannelBalance = {
                  local: amounts.local + '',
                  total: amounts.total + '',
                };
              }

              message += `${pendingChannelBalance.local}${pendingChannelBalance.total}`;
            }

            const allChannels = [];

            if (channelPushEnabled) {
              const channels = await this.nodeService.getChannels(node.id, {
                is_public: true,
              });

              const mapped = getMappedChannelInfo(channels);
              allChannels.push(...mapped);
            }

            if (privateChannelPushEnabled) {
              const privateChannels = await this.nodeService.getChannels(
                node.id,
                { is_private: true }
              );

              const mapped = getMappedChannelInfo(privateChannels);
              allChannels.push(...mapped);
            }

            const sortedChannels = orderBy(allChannels, ['chan_id'], ['desc']);

            if (sortedChannels.length) {
              const infoString = sortedChannels.reduce(
                (p, c) => p + `${c.chan_id}${c.balance}${c.capacity || ''}`,
                ''
              );

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
              pendingChannelBalance: !!pendingChannelBalance,
              amountOfChannels: sortedChannels.length,
              finalMessage,
              signature,
            });

            await this.pushBalancesToAmboss(getAmbossSpaceUrl('btc'), {
              timestamp,
              signature,
              pendingChannelBalance,
              onchainBalance: onchain,
              channels: sortedChannels,
            });
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
