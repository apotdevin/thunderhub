import { getForwards, getWalletInfo } from 'ln-service';
import { subHours, subDays } from 'date-fns';
import { sortBy } from 'underscore';
import { ContextType } from 'server/types/apiTypes';
import { getNodeFromChannel } from 'server/helpers/getNodeFromChannel';
import { requestLimiter } from 'server/helpers/rateLimiter';

import { to } from 'server/helpers/async';
import {
  GetForwardsType,
  GetWalletInfoType,
} from 'server/types/ln-service.types';
import { countArray, countRoutes } from './helpers';

export const getForwardChannelsReport = async (
  _: undefined,
  params: any,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'forwardChannels');

  const { lnd } = context;

  let startDate = new Date();
  const endDate = new Date();

  if (params.time === 'week') {
    startDate = subDays(endDate, 7);
  } else if (params.time === 'month') {
    startDate = subDays(endDate, 30);
  } else if (params.time === 'quarter_year') {
    startDate = subDays(endDate, 90);
  } else if (params.time === 'half_year') {
    startDate = subDays(endDate, 180);
  } else if (params.time === 'year') {
    startDate = subDays(endDate, 360);
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

  const forwardsList = await to<GetForwardsType>(
    getForwards({
      lnd,
      after: startDate,
      before: endDate,
    })
  );

  const walletInfo = await to<GetWalletInfoType>(
    getWalletInfo({
      lnd,
    })
  );

  let forwards = forwardsList.forwards;
  let next = forwardsList.next;

  let finishedFetching = false;

  if (!next || !forwards || forwards.length <= 0) {
    finishedFetching = true;
  }

  while (!finishedFetching) {
    if (next) {
      const moreForwards = await to<GetForwardsType>(
        getForwards({ lnd, token: next })
      );
      forwards = [...forwards, ...moreForwards.forwards];
      if (moreForwards.next) {
        next = moreForwards.next;
      } else {
        finishedFetching = true;
      }
    } else {
      finishedFetching = true;
    }
  }

  if (params.type === 'route') {
    const mapped = forwards.map(forward => {
      return {
        route: `${forward.incoming_channel} - ${forward.outgoing_channel}`,
        ...forward,
      };
    });
    const grouped = countRoutes(mapped);

    const routeAlias = await getRouteAlias(grouped, walletInfo.public_key);

    const sortedRoute = sortBy(routeAlias, params.order).reverse().slice(0, 10);
    return JSON.stringify(sortedRoute);
  }
  if (params.type === 'incoming') {
    const incomingCount = countArray(forwards, true);
    const incomingAlias = await getAlias(incomingCount, walletInfo.public_key);
    const sortedInCount = sortBy(incomingAlias, params.order)
      .reverse()
      .slice(0, 10);
    return JSON.stringify(sortedInCount);
  }
  const outgoingCount = countArray(forwards, false);
  const outgoingAlias = await getAlias(outgoingCount, walletInfo.public_key);
  const sortedOutCount = sortBy(outgoingAlias, params.order)
    .reverse()
    .slice(0, 10);
  return JSON.stringify(sortedOutCount);
};
