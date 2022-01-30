import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import {
  subscribeToForwards,
  getWalletInfo,
  subscribeToChannels,
  subscribeToInvoices,
  subscribeToBackups,
  subscribeToPastPayments,
} from 'ln-service';
import asyncAuto from 'async/auto';
import asyncEach from 'async/each';
import asyncMap from 'async/map';
import asyncForever from 'async/forever';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AccountsService } from '../accounts/accounts.service';
import { WsService } from '../ws/ws.service';
import { ConfigService } from '@nestjs/config';

const restartSubscriptionTimeMs = 1000 * 30;

type NodeType = {
  id: string;
  name: string;
  pubkey: string;
  lnd: any;
};

@Injectable()
export class SubService implements OnApplicationBootstrap {
  subscriptions = [];

  constructor(
    private accountsService: AccountsService,
    private wsService: WsService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const disabled = this.configService.get('subscriptions.disableAll');
    if (disabled) {
      this.logger.info('All subscriptions are disabled');
      return;
    }

    this.startSubscription();
  }

  startSubscription() {
    return asyncForever(
      next => {
        return asyncAuto(
          {
            // Get Authenticated LND objects for each node
            getNodes: callback => {
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

              callback(null, validAccounts);
            },

            // Try to connect to nodes
            checkNodes: [
              'getNodes',
              async ({ getNodes }) => {
                return asyncMap(getNodes, async ({ lnd, id }) => {
                  try {
                    const info = await getWalletInfo({ lnd });

                    const sliced = info.public_key.slice(0, 10);
                    const name = `${info.alias}(${sliced})`;

                    return {
                      id,
                      name,
                      pubkey: info.public_key,
                      lnd,
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
                  this.logger.error(`Unable to connect to any node.`);

                  throw new Error('UnableToConnectToAnyNode');
                }

                const names = unique.map(a => a.name);

                this.logger.info(`Connected to ${names.join(', ')}`);

                return unique;
              },
            ],

            // Subscribe to node invoices
            invoices: [
              'checkAvailable',
              async ({ checkAvailable }, callback) => {
                const disabled = this.configService.get(
                  'subscriptions.disableInvoices'
                );
                if (disabled) {
                  this.logger.info('Invoice subscriptions are disabled');
                  return;
                }

                const names = checkAvailable.map(a => a.name);

                this.logger.info('Invoice subscription', {
                  connections: names.join(', '),
                });

                return asyncEach(
                  checkAvailable,
                  (node, cbk) => {
                    const sub = subscribeToInvoices({ lnd: node.lnd });

                    this.subscriptions.push(sub);

                    sub.on('invoice_updated', data => {
                      this.logger.info('invoice_updated', { node: node.name });
                      this.wsService.emit(node.id, 'invoice_updated', data);

                      return;
                    });

                    sub.on('error', async err => {
                      sub.removeAllListeners();

                      this.logger.error(
                        `ErrorInInvoiceSubscribe: ${node.name}`,
                        { err }
                      );

                      cbk([
                        'ErrorInInvoiceSubscribe',
                        { node: node.name, err },
                      ]);
                    });
                  },
                  callback
                );
              },
            ],

            // Subscribe to node payments
            payments: [
              'checkAvailable',
              async ({ checkAvailable }, callback) => {
                const disabled = this.configService.get(
                  'subscriptions.disablePayments'
                );
                if (disabled) {
                  this.logger.info('Payment subscriptions are disabled');
                  return;
                }

                const names = checkAvailable.map(a => a.name);

                this.logger.info('Payment subscription', {
                  connections: names.join(', '),
                });

                return asyncEach(
                  checkAvailable,
                  (node, cbk) => {
                    const sub = subscribeToPastPayments({ lnd: node.lnd });

                    this.subscriptions.push(sub);

                    sub.on('payment', data => {
                      this.logger.info('payment', { node: node.name });
                      this.wsService.emit(node.id, 'payment', data);

                      return;
                    });

                    sub.on('error', async err => {
                      sub.removeAllListeners();

                      this.logger.error(
                        `ErrorInPaymentSubscribe: ${node.name}`,
                        { err }
                      );

                      cbk([
                        'ErrorInPaymentSubscribe',
                        { node: node.name, err },
                      ]);
                    });
                  },
                  callback
                );
              },
            ],

            // Subscribe to node forwards
            forwards: [
              'checkAvailable',
              async ({ checkAvailable }, callback) => {
                const disabled = this.configService.get(
                  'subscriptions.disableForwards'
                );
                if (disabled) {
                  this.logger.info('Forward subscriptions are disabled');
                  return;
                }

                const names = checkAvailable.map(a => a.name);

                this.logger.info('Forward subscription', {
                  connections: names.join(', '),
                });

                return asyncEach(
                  checkAvailable,
                  (node, cbk) => {
                    const sub = subscribeToForwards({ lnd: node.lnd });

                    this.subscriptions.push(sub);

                    sub.on('forward', data => {
                      this.logger.info('forward', { node: node.name });
                      this.wsService.emit(node.id, 'forward', data);

                      return;
                    });

                    sub.on('error', async err => {
                      sub.removeAllListeners();

                      this.logger.error(
                        `ErrorInForwardSubscribe: ${node.name}`,
                        { err }
                      );

                      cbk([
                        'ErrorInForwardSubscribe',
                        { node: node.name, err },
                      ]);
                    });
                  },
                  callback
                );
              },
            ],

            // Subscribe to node channels
            channels: [
              'checkAvailable',
              async ({ checkAvailable }, callback) => {
                const disabled = this.configService.get(
                  'subscriptions.disableChannels'
                );
                if (disabled) {
                  this.logger.info('Channel subscriptions are disabled');
                  return;
                }

                const names = checkAvailable.map(a => a.name);

                this.logger.info('Channels subscription', {
                  connections: names.join(', '),
                });

                return asyncEach(
                  checkAvailable,
                  (node, cbk) => {
                    const sub = subscribeToChannels({ lnd: node.lnd });

                    this.subscriptions.push(sub);

                    sub.on('channel_active_changed', data => {
                      this.logger.info('channel_active_changed', {
                        node: node.name,
                      });
                      this.wsService.emit(
                        node.id,
                        'channel_active_changed',
                        data
                      );

                      return;
                    });

                    sub.on('channel_closed', data => {
                      this.logger.info('channel_closed', { node: node.name });
                      this.wsService.emit(node.id, 'channel_closed', data);

                      return;
                    });

                    sub.on('channel_opened', data => {
                      this.logger.info('channel_opened', { node: node.name });
                      this.wsService.emit(node.id, 'channel_opened', data);

                      return;
                    });

                    sub.on('channel_opening', data => {
                      this.logger.info('channel_opening', { node: node.name });
                      this.wsService.emit(node.id, 'channel_opening', data);

                      return;
                    });

                    sub.on('error', async err => {
                      sub.removeAllListeners();

                      this.logger.error(
                        `ErrorInChannelSubscribe: ${node.name}`,
                        { err }
                      );

                      cbk([
                        'ErrorInChannelSubscribe',
                        { node: node.name, err },
                      ]);
                    });
                  },
                  callback
                );
              },
            ],

            // // Subscribe to node backups
            backups: [
              'checkAvailable',
              ({ checkAvailable }, callback) => {
                const disabled = this.configService.get(
                  'subscriptions.disableBackups'
                );
                if (disabled) {
                  this.logger.info('Backup subscriptions are disabled');
                  return;
                }

                const names = checkAvailable.map(a => a.name);

                this.logger.info('Backup subscription', {
                  connections: names.join(', '),
                });

                return asyncEach(
                  checkAvailable,
                  (node, cbk) => {
                    let postBackupTimeoutHandle;
                    const sub = subscribeToBackups({ lnd: node.lnd });

                    this.subscriptions.push(sub);

                    sub.on('backup', ({ backup }) => {
                      if (!!postBackupTimeoutHandle) {
                        clearTimeout(postBackupTimeoutHandle);
                      }

                      postBackupTimeoutHandle = setTimeout(async () => {
                        const time = Math.round(new Date().getTime() / 1000);
                        this.logger.info('channel_backup', { node: node.name });
                        this.wsService.emit(node.id, 'channel_backup', {
                          file: `${time}-${node.name}-backup.txt`,
                          backup,
                        });
                      }, restartSubscriptionTimeMs);

                      return;
                    });

                    sub.on('error', async err => {
                      sub.removeAllListeners();

                      this.logger.error(`ErrorInBackupSubscribe: ${node.name}`);
                      cbk(['ErrorInBackupSubscribe', { node: node.name, err }]);
                    });
                  },
                  callback
                );
              },
            ],
          },
          async (err, results) => {
            this.subscriptions.forEach(sub => sub.removeAllListeners());
            this.subscriptions = [];
            this.logger.error(err?.message || '.....');
            if (err?.message === 'UnableToConnectToAnyNode') {
              next('UnableToConnectToAnyNode');
              return;
            }
            if (err) {
              this.logger.error('AsyncAuto error:', err);
            } else {
              this.logger.error('AsyncAuto results:', results);
            }
            const message = `Restarting subscription after ${restartSubscriptionTimeMs} ms`;
            this.logger.warn(message);
            setTimeout(async () => {
              this.logger.warn('Restarting...');
              next(null, 'retry');
            }, restartSubscriptionTimeMs);
          }
        );
      },
      async err => {
        this.logger.error('Initiating subscriptions failed: ', err);
      }
    );
  }
}
