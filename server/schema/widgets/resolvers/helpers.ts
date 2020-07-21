import { reduce, groupBy } from 'underscore';
import { ForwardType } from 'server/types/ln-service.types';
import {
  ReduceObjectProps,
  ListProps,
  InOutProps,
  InOutListProps,
} from './interface';

export const reduceForwardArray = (list: ListProps) => {
  const reducedOrder = [];
  for (const key in list) {
    if (Object.prototype.hasOwnProperty.call(list, key)) {
      const element: ForwardType[] = list[key];
      const reducedArray: ReduceObjectProps = reduce(
        element,
        (a: ReduceObjectProps, b: ReduceObjectProps) => {
          return {
            fee: a.fee + b.fee,
            tokens: a.tokens + b.tokens,
          };
        },
        { fee: 0, tokens: 0 }
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

export const reduceInOutArray = (list: InOutListProps) => {
  const reducedOrder = [];
  for (const key in list) {
    if (Object.prototype.hasOwnProperty.call(list, key)) {
      const element: InOutProps[] = list[key];
      const reducedArray: InOutProps = reduce(
        element,
        (a, b) => ({
          tokens: a.tokens + b.tokens,
        }),
        { tokens: 0 }
      );
      reducedOrder.push({
        period: Number(key),
        amount: element.length,
        tokens: reducedArray.tokens,
      });
    }
  }
  return reducedOrder;
};

export const countArray = (list: ForwardType[], type: boolean) => {
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

      channelInfo.push({
        name: key,
        amount: element.length,
        fee,
        tokens,
      });
    }
  }

  return channelInfo;
};

export const countRoutes = (list: ForwardType[]) => {
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
        route: key,
        in: element[0].incoming_channel,
        out: element[0].outgoing_channel,
        amount: element.length,
        fee,
        tokens,
      });
    }
  }

  return channelInfo;
};
