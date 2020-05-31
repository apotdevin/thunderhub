import { getForwards as getLnForwards, getWalletInfo } from 'ln-service';
import { subHours, subDays } from 'date-fns';
import { sortBy } from 'underscore';
import { ContextType } from 'server/types/apiTypes';
import { getNodeFromChannel } from 'server/schemas/helpers/getNodeFromChannel';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from '../../../../helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from '../../../../helpers/helpers';
import { countArray, countRoutes } from './helpers';
import { ForwardCompleteProps } from './interface';

export const getForwardChannelsReport = async (
  _: undefined,
  params: any,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'forwardChannels');

  const auth = getCorrectAuth(params.auth, context);
  const lnd = getAuthLnd(auth);

  let startDate = new Date();
  const endDate = new Date();

  if (params.time === 'month') {
    startDate = subDays(endDate, 30);
  } else if (params.time === 'week') {
    startDate = subDays(endDate, 7);
  } else {
    startDate = subHours(endDate, 24);
  }

  const getRouteAlias = (array: any[], publicKey: string) =>
    Promise.all(
      array.map(async channel => {
        const nodeAliasIn = await getNodeFromChannel(
          channel.in,
          publicKey,
          lnd
        );
        const nodeAliasOut = await getNodeFromChannel(
          channel.out,
          publicKey,
          lnd
        );

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
        const nodeAlias = await getNodeFromChannel(
          channel.name,
          publicKey,
          lnd
        );
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
    const outgoingAlias = await getAlias(outgoingCount, walletInfo.public_key);
    const sortedOutCount = sortBy(outgoingAlias, params.order)
      .reverse()
      .slice(0, 10);
    return JSON.stringify(sortedOutCount);
  } catch (error) {
    logger.error('Error getting forward channel report: %o', error);
    throw new Error(getErrorMsg(error));
  }
};
