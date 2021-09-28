import {
  getNode,
  getWalletInfo,
  getClosedChannels,
  getPendingChannels,
  getChannelBalance,
  getChannels,
  getChainBalance,
  getPendingChainBalance,
} from 'ln-service';
import { to, toWithError } from 'server/helpers/async';
import { requestLimiter } from 'server/helpers/rateLimiter';
import {
  ClosedChannelsType,
  LndObject,
  GetWalletInfoType,
  GetNodeType,
  GetPendingChannelsType,
  GetChannelsType,
  GetChainBalanceType,
  GetPendingChainBalanceType,
} from 'server/types/ln-service.types';
import { ContextType } from '../../types/apiTypes';
import { logger } from '../../helpers/logger';

const errorNode = { alias: 'Node not found' };

type ChannelBalanceProps = {
  channel_balance: number;
  pending_balance: number;
};

type ChainBalanceProps = {
  chain_balance: number;
};

type PendingChainBalanceProps = {
  pending_chain_balance: number;
};

type NodeParent = {
  lnd: LndObject;
  publicKey: string;
  withChannels?: boolean;
};

export const nodeResolvers = {
  Query: {
    getNodeBalances: async (_: undefined, __: any, context: ContextType) => {
      await requestLimiter(context.ip, 'getNodeBalances');
      return {};
    },
    getNode: async (_: undefined, params: any, context: ContextType) => {
      await requestLimiter(context.ip, 'getNode');

      const { withoutChannels = true, publicKey } = params;
      const { lnd } = context;

      return { lnd, publicKey, withChannels: !withoutChannels };
    },
    getNodeInfo: async (_: undefined, __: undefined, context: ContextType) => {
      await requestLimiter(context.ip, 'nodeInfo');

      const { lnd } = context;

      const info = await to<GetWalletInfoType>(
        getWalletInfo({
          lnd,
        })
      );

      const closedChannels: ClosedChannelsType = await to(
        getClosedChannels({
          lnd,
        })
      );

      const { pending_channels } = await to<GetPendingChannelsType>(
        getPendingChannels({ lnd })
      );

      const pending_channels_count = pending_channels.length;

      return {
        ...info,
        pending_channels_count,
        closed_channels_count: closedChannels?.channels?.length || 0,
      };
    },
  },

  BalancesType: {
    onchain: async () => {
      return 0;
    },
    lightning: async (_: undefined, __: undefined, { lnd }: ContextType) => {
      const { channels } = await to<GetChannelsType>(getChannels({ lnd }));

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
    },
  },

  OnChainBalanceType: {
    confirmed: async (
      _: undefined,
      __: undefined,
      { ip, lnd }: ContextType
    ) => {
      await requestLimiter(ip, 'chainBalance');

      const value: ChainBalanceProps = await to<GetChainBalanceType>(
        getChainBalance({
          lnd,
        })
      );
      return value.chain_balance || 0;
    },
    pending: async (_: undefined, __: undefined, { lnd }: ContextType) => {
      const pendingValue: PendingChainBalanceProps =
        await to<GetPendingChainBalanceType>(
          getPendingChainBalance({
            lnd,
          })
        );

      return pendingValue.pending_chain_balance || 0;
    },
    closing: async (_: undefined, __: undefined, { lnd }: ContextType) => {
      const { pending_channels } = await to<GetPendingChannelsType>(
        getPendingChannels({ lnd })
      );

      const closing =
        pending_channels
          .filter(p => p.is_timelocked)
          .reduce((p, c) => p + c.local_balance, 0) || 0;

      return closing || 0;
    },
  },

  LightningBalanceType: {
    pending: async (_: undefined, __: undefined, { lnd }: ContextType) => {
      const channelBalance: ChannelBalanceProps = await to(
        getChannelBalance({
          lnd,
        })
      );
      return channelBalance.pending_balance;
    },
  },

  Node: {
    node: async (parent: NodeParent) => {
      const { lnd, withChannels, publicKey } = parent;

      if (!lnd) {
        logger.debug('ExpectedLNDToGetNode');
        return errorNode;
      }

      if (!publicKey) {
        logger.debug('ExpectedPublicKeyToGetNode');
        return errorNode;
      }

      const [info, error] = await toWithError(
        getNode({
          lnd,
          is_omitting_channels: !withChannels,
          public_key: publicKey,
        })
      );

      if (error || !info) {
        logger.debug(`Error getting node with key: ${publicKey}`);
        return errorNode;
      }

      return { ...(info as GetNodeType), public_key: publicKey };
    },
  },
};
