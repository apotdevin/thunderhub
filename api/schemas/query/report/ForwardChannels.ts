import { GraphQLString } from 'graphql';
import {
  getForwards as getLnForwards,
  getNode,
  getChannel,
  getWalletInfo,
} from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { subHours, subDays } from 'date-fns';
import { countArray, countRoutes } from './Helpers';
import { ForwardCompleteProps } from './ForwardReport.interface';
import { sortBy } from 'underscore';
import { getAuthLnd, getErrorMsg } from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';

interface NodeProps {
  alias: string;
  color: string;
}

interface ChannelsProps {
  policies: { public_key: string }[];
}

export const getForwardChannelsReport = {
  type: GraphQLString,
  args: {
    ...defaultParams,
    time: { type: GraphQLString },
    order: { type: GraphQLString },
    type: { type: GraphQLString },
  },
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, 'forwardChannels');

    const lnd = getAuthLnd(params.auth);

    let startDate = new Date();
    const endDate = new Date();

    if (params.time === 'month') {
      startDate = subDays(endDate, 30);
    } else if (params.time === 'week') {
      startDate = subDays(endDate, 7);
    } else {
      startDate = subHours(endDate, 24);
    }

    const getNodeAlias = async (id: string, publicKey: string) => {
      const channelInfo: ChannelsProps = await getChannel({
        lnd,
        id,
      });

      const partnerPublicKey =
        channelInfo.policies[0].public_key !== publicKey
          ? channelInfo.policies[0].public_key
          : channelInfo.policies[1].public_key;

      const nodeInfo: NodeProps = await getNode({
        lnd,
        is_omitting_channels: true,
        public_key: partnerPublicKey,
      });

      return {
        alias: nodeInfo.alias,
        color: nodeInfo.color,
      };
    };

    const getRouteAlias = (array: any[], publicKey: string) =>
      Promise.all(
        array.map(async channel => {
          const nodeAliasIn = await getNodeAlias(channel.in, publicKey);
          const nodeAliasOut = await getNodeAlias(channel.out, publicKey);

          return {
            aliasIn: nodeAliasIn.alias,
            colorIn: nodeAliasIn.color,
            aliasOut: nodeAliasOut.alias,
            colorOut: nodeAliasOut.color,
            ...channel,
          };
        })
      );

    const getAlias = (array: any[], publicKey: string) =>
      Promise.all(
        array.map(async channel => {
          const nodeAlias = await getNodeAlias(channel.name, publicKey);
          return {
            alias: nodeAlias.alias,
            color: nodeAlias.color,
            ...channel,
          };
        })
      );

    try {
      const forwardsList: ForwardCompleteProps = await getLnForwards({
        lnd,
        after: startDate,
        before: endDate,
        limit: 10000,
      });

      const walletInfo: { public_key: string } = await getWalletInfo({
        lnd,
      });

      if (params.type === 'route') {
        const mapped = forwardsList.forwards.map(forward => {
          return {
            route: `${forward.incoming_channel} - ${forward.outgoing_channel}`,
            ...forward,
          };
        });
        const grouped = countRoutes(mapped);

        const routeAlias = await getRouteAlias(grouped, walletInfo.public_key);

        const sortedRoute = sortBy(routeAlias, params.order)
          .reverse()
          .slice(0, 10);
        return JSON.stringify(sortedRoute);
      }
      if (params.type === 'incoming') {
        const incomingCount = countArray(forwardsList.forwards, true);
        const incomingAlias = await getAlias(
          incomingCount,
          walletInfo.public_key
        );
        const sortedInCount = sortBy(incomingAlias, params.order)
          .reverse()
          .slice(0, 10);
        return JSON.stringify(sortedInCount);
      }
      const outgoingCount = countArray(forwardsList.forwards, false);
      const outgoingAlias = await getAlias(
        outgoingCount,
        walletInfo.public_key
      );
      const sortedOutCount = sortBy(outgoingAlias, params.order)
        .reverse()
        .slice(0, 10);
      return JSON.stringify(sortedOutCount);
    } catch (error) {
      params.logger &&
        logger.error('Error getting forward channel report: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
