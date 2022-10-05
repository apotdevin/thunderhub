import fs from 'fs';
import { reconnect } from 'balanceofsatoshis/network';
import { rebalance } from 'balanceofsatoshis/swaps';
import { getAccountingReport } from 'balanceofsatoshis/balances';
import { simpleRequest } from 'balanceofsatoshis/commands';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccountsService } from '../../accounts/accounts.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { to } from 'src/server/utils/async';
import { BosRebalanceResult, RebalanceResponseType } from './bos.types';
import { WsService } from '../../ws/ws.service';
import { stripAnsi } from 'src/server/utils/string';
import { auto, map, each } from 'async';
import { getWalletInfo } from 'lightning';

type NodeType = {
  id: string;
  name: string;
  pubkey: string;
  lnd: any;
};

@Resolver()
export class BosResolver {
  constructor(
    private wsService: WsService,
    private accountsService: AccountsService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => String)
  async getAccountingReport(
    @CurrentUser() user: UserId,
    @Args('category', { nullable: true }) category?: string,
    @Args('currency', { nullable: true }) currency?: string,
    @Args('fiat', { nullable: true }) fiat?: string,
    @Args('month', { nullable: true }) month?: string,
    @Args('year', { nullable: true }) year?: string
  ) {
    const account = this.accountsService.getAccount(user.id);
    if (!account) throw new Error('Node account not found');

    this.logger.info('Generating accounting report', {
      category,
      currency,
      fiat,
      month,
      year,
    });

    const response = await to(
      getAccountingReport({
        lnd: account.lnd,
        logger: this.logger,
        request: simpleRequest,
        is_csv: true,
        category,
        currency,
        fiat,
        month,
        year,
        rate_provider: 'coingecko',
      })
    );

    return response;
  }

  @Mutation(() => BosRebalanceResult)
  async bosRebalance(
    @CurrentUser() user: UserId,
    @Args('avoid', { nullable: true, type: () => [String] }) avoid?: string[],
    @Args('in_through', { nullable: true }) in_through?: string,
    @Args('max_fee', { nullable: true }) max_fee?: number,
    @Args('max_fee_rate', { nullable: true }) max_fee_rate?: number,
    @Args('max_rebalance', { nullable: true }) max_rebalance?: number,
    @Args('timeout_minutes', { nullable: true }) timeout_minutes?: number,
    @Args('node', { nullable: true }) node?: string,
    @Args('out_through', { nullable: true }) out_through?: string,
    @Args('out_inbound', { nullable: true }) out_inbound?: number
  ) {
    const account = this.accountsService.getAccount(user.id);
    if (!account) throw new Error('Node account not found');

    const filteredParams = {
      out_channels: [],
      avoid,
      ...(in_through && { in_through }),
      ...(max_fee && max_fee > 0 && { max_fee }),
      ...(max_fee_rate && max_fee_rate > 0 && { max_fee_rate }),
      ...(timeout_minutes ? { timeout_minutes } : { timeout_minutes: 5 }),
      ...(max_rebalance && max_rebalance > 0
        ? { max_rebalance: `${max_rebalance}` }
        : {}),
      ...(node && { node }),
      ...(out_through && { out_through }),
      ...(out_inbound && out_inbound > 0
        ? { out_inbound: `${out_inbound}` }
        : {}),
    };

    this.logger.info('Rebalance Params', { filteredParams });

    const logger = {
      info: (message, ...args) => {
        let payload = message;

        if (payload?.evaluating?.length) {
          payload = {
            evaluating: payload.evaluating.map((m: string) => stripAnsi(m)),
          };
        }

        this.wsService.emit(user.id, 'rebalance', payload);
        this.logger.info(message, args);
      },
      warn: (message, ...args) => {
        this.wsService.emit(user.id, 'rebalance', message);
        this.logger.warn(message, args);
      },
      error: (message, ...args) => {
        this.wsService.emit(user.id, 'rebalance', message);
        this.logger.error(message, args);
      },
    };

    const response = await to<RebalanceResponseType>(
      rebalance({
        lnd: account.lnd,
        logger,
        fs: { getFile: fs.readFile },
        ...filteredParams,
      })
    );

    const result = {
      increase: response.rebalance[0],
      decrease: response.rebalance[1],
      result: response.rebalance[2],
    };

    return result;
  }

  // Disabled until solution for https://github.com/apotdevin/thunderhub/issues/480 is found
  // Run every hour
  // @Cron('0 0 * * * *')
  async reconnectToPeers() {
    this.logger.debug('Reconnecting to disconnected peers for all nodes.');

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
            throw new Error(
              'No nodes available to try reconnecting to disconnected peers.'
            );
          }

          const names = unique.map(a => a.name);

          this.logger.silly(
            `Connected to ${names.join(', ')} for peer reconnection`
          );

          return unique;
        },
      ],

      reconnectToNodes: [
        'checkAvailable',
        async ({ checkAvailable }) => {
          await each(checkAvailable, async ({ lnd, name }) => {
            try {
              await reconnect({ lnd });
            } catch (error) {
              this.logger.error('Error reconnecting to peers', {
                node: name,
                error,
              });
            }
          });
        },
      ],
    })
      .then(result => {
        const nodes = result.checkAvailable.length;
        this.logger.silly(
          `Finished reconnecting to peers for ${nodes} node${
            nodes.length > 1 ? 's' : ''
          }.`
        );
      })
      .catch(error => {
        this.logger.error(error.message);
      });
  }
}
