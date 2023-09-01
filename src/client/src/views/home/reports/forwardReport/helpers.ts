import { differenceInCalendarDays, differenceInHours, subDays } from 'date-fns';
import { sortBy, groupBy } from 'lodash';
import { GetClosedChannelsQuery } from '../../../../graphql/queries/__generated__/getClosedChannels.generated';
import { Forward } from '../../../../graphql/types';

type ListProps = {
  [key: string]: Forward[];
};

export const reduceForwardArray = (list: ListProps) => {
  const reducedOrder = [];
  for (const key in list) {
    if (Object.prototype.hasOwnProperty.call(list, key)) {
      const element: Forward[] = list[key];

      const reducedArray = element.reduce(
        (prev, current) => {
          return {
            fee: (prev.fee || 0) + (current.fee || 0),
            tokens: (prev.tokens || 0) + (current.tokens || 0),
          };
        },
        {
          fee: 0,
          tokens: 0,
        }
      );

      reducedOrder.push({
        period: Number(key),
        amount: element.length,
        ...reducedArray,
      });
    }
  }

  return reducedOrder;
};

export const orderAndReducedArray = (time: number, forwardArray: Forward[]) => {
  const endDate = subDays(new Date(), time);
  const filtered = forwardArray.filter(Boolean);

  if (time === 1) {
    const orderedHour = groupBy(filtered, item =>
      differenceInHours(new Date(item.created_at), endDate)
    );

    const reducedOrderedHour = reduceForwardArray(orderedHour);

    return reducedOrderedHour;
  }

  const orderedDay = groupBy(filtered, item =>
    differenceInCalendarDays(new Date(item.created_at), endDate)
  );

  const reducedOrderedDay = reduceForwardArray(orderedDay);

  return reducedOrderedDay;
};

const countRoutes = (list: Forward[]) => {
  const grouped = groupBy(list, 'route');

  const channelInfo = [];
  for (const key in grouped) {
    if (Object.prototype.hasOwnProperty.call(grouped, key)) {
      const element = grouped[key];

      const fee = element
        .map(forward => forward.fee)
        .reduce((p: number, c: number) => p + c);

      const tokens = element
        .map(forward => forward.tokens)
        .reduce((p: number, c: number) => p + c);

      channelInfo.push({
        incoming_alias:
          element[0].incoming_channel_info?.node2_info.alias || 'Unknown',
        outgoing_alias:
          element[0].outgoing_channel_info?.node2_info.alias || 'Unknown',
        incoming_channel: element[0].incoming_channel,
        outgoing_channel: element[0].outgoing_channel,
        route: key,
        amount: element.length,
        fee,
        tokens,
      });
    }
  }

  return channelInfo;
};

const countArray = (list: Forward[], type: boolean) => {
  const inOrOut = type ? 'incoming_channel' : 'outgoing_channel';
  const grouped = groupBy(list, inOrOut);

  const channelInfo = [];
  for (const key in grouped) {
    if (Object.prototype.hasOwnProperty.call(grouped, key)) {
      const element = grouped[key];

      const fee = element
        .map(forward => forward.fee)
        .reduce((p: number, c: number) => p + c);

      const tokens = element
        .map(forward => forward.tokens)
        .reduce((p: number, c: number) => p + c);

      const channelId = type
        ? element[0].incoming_channel
        : element[0].outgoing_channel;

      const alias = type
        ? element[0].incoming_channel_info?.node2_info.alias || 'Unknown'
        : element[0].outgoing_channel_info?.node2_info.alias || 'Unknown';

      channelInfo.push({
        alias,
        channelId,
        name: key,
        amount: element.length,
        fee,
        tokens,
      });
    }
  }

  return channelInfo;
};

export const orderForwardChannels = (
  type: string,
  order: string,
  forwardArray: Forward[]
) => {
  if (type === 'route') {
    const mapped = forwardArray.map(forward => {
      return {
        route: `${forward.incoming_channel} - ${forward.outgoing_channel}`,
        ...forward,
      };
    });
    const grouped = countRoutes(mapped);

    const sortedRoute = sortBy(grouped, order).reverse().slice(0, 10);
    return sortedRoute;
  }
  if (type === 'incoming') {
    const incomingCount = countArray(forwardArray, true);
    const sortedInCount = sortBy(incomingCount, order).reverse().slice(0, 10);
    return sortedInCount;
  }
  const outgoingCount = countArray(forwardArray, false);
  const sortedOutCount = sortBy(outgoingCount, order).reverse().slice(0, 10);
  return sortedOutCount;
};

export const getAliasFromClosedChannels = (
  channelId: string,
  channels: GetClosedChannelsQuery['getClosedChannels']
): { alias: string; closed: boolean } => {
  if (!channels) return { alias: 'Unknown', closed: false };

  const channel = channels.find(c => c?.id === channelId);

  if (channel?.partner_node_info.node?.alias) {
    return { alias: channel.partner_node_info.node.alias, closed: true };
  }

  return { alias: 'Unknown', closed: false };
};
