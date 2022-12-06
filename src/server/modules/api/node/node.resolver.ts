import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { NodeService } from '../../node/node.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import {
  Balances,
  LightningBalance,
  Node,
  NodeInfo,
  OnChainBalance,
} from './node.types';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { toWithError } from 'src/server/utils/async';
import { FetchService } from '../../fetch/fetch.service';
import { ConfigService } from '@nestjs/config';
import { gql } from 'graphql-tag';

@Resolver(LightningBalance)
export class LightningBalanceResolver {
  constructor(private nodeService: NodeService) {}

  @ResolveField()
  async pending(@CurrentUser() { id }: UserId) {
    const channelBalance = await this.nodeService.getChannelBalance(id);
    return channelBalance.pending_balance;
  }
}

@Resolver(OnChainBalance)
export class OnChainBalanceResolver {
  constructor(private nodeService: NodeService) {}

  @ResolveField()
  async confirmed(@CurrentUser() { id }: UserId) {
    const value = await this.nodeService.getChainBalance(id);
    return value.chain_balance || 0;
  }

  @ResolveField()
  async pending(@CurrentUser() { id }: UserId) {
    const pendingValue = await this.nodeService.getPendingChainBalance(id);
    return pendingValue.pending_chain_balance || 0;
  }

  @ResolveField()
  async closing(@CurrentUser() { id }: UserId) {
    const { pending_channels } = await this.nodeService.getPendingChannels(id);

    const closing =
      pending_channels
        .filter(p => p.is_timelocked)
        .reduce((p, c) => p + c.local_balance, 0) || 0;

    return closing || 0;
  }
}

@Resolver(Balances)
export class BalancesResolver {
  constructor(private nodeService: NodeService) {}

  @ResolveField()
  async onchain() {
    return 0;
  }

  @ResolveField()
  async lightning(@CurrentUser() { id }: UserId) {
    const { channels } = await this.nodeService.getChannels(id);

    const confirmed = channels
      .map(c => c.local_balance)
      .reduce((total, size) => total + size, 0);

    const active = channels
      .filter(c => c.is_active)
      .map(c => c.local_balance)
      .reduce((total, size) => total + size, 0);

    const commit = channels
      .filter(c => !c.is_partner_initiated)
      .map(c => c.commit_transaction_fee)
      .reduce((total, fee) => total + fee, 0);

    return {
      confirmed,
      active,
      commit,
    };
  }
}

@Resolver()
export class NodeResolver {
  constructor(
    private nodeService: NodeService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => Balances)
  async getNodeBalances() {
    return {};
  }

  @Query(() => Node)
  async getNode(
    @Args('withoutChannels', { nullable: true }) withoutChannels: boolean,
    @Args('publicKey') publicKey: string
  ) {
    return { publicKey, withoutChannels };
  }

  @Query(() => NodeInfo)
  async getNodeInfo(@CurrentUser() { id }: UserId) {
    const info = await this.nodeService.getWalletInfo(id);
    const closedChannels = await this.nodeService.getClosedChannels(id);
    const { pending_channels } = await this.nodeService.getPendingChannels(id);

    const pending_channels_count = pending_channels.length;

    return {
      ...info,
      pending_channels_count,
      closed_channels_count: closedChannels?.channels?.length || 0,
    };
  }
}

@Resolver(Node)
export class NodeFieldResolver {
  constructor(
    private nodeService: NodeService,
    private fetchService: FetchService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @ResolveField()
  async node(
    @Parent()
    { publicKey }: { publicKey: string },
    @CurrentUser() { id }: UserId
  ) {
    if (!publicKey) {
      this.logger.error('No public key to get node');
      return null;
    }

    const { data, error } = await this.fetchService.graphqlFetchWithProxy(
      this.configService.get('urls.amboss'),
      gql`
        query GetNodeAlias($pubkey: String!) {
          getNodeAlias(pubkey: $pubkey)
        }
      `,
      { pubkey: publicKey }
    );

    if (data?.getNodeAlias && !error) {
      return { alias: data.getNodeAlias, public_key: publicKey };
    }

    const [info, nodeError] = await toWithError(
      this.nodeService.getNode(id, publicKey, true)
    );

    if (nodeError || !info) return null;

    return { ...info, public_key: publicKey };
  }
}
