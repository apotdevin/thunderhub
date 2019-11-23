import { reduce, sortBy } from "underscore";
import {
  ForwardProps,
  ReduceObjectProps,
  FinalProps,
  FinalList,
  ListProps,
  CountProps,
  ChannelCounts
} from "./ForwardReport.interface";

export const reduceForwardArray = (list: ListProps): FinalList => {
  let reducedOrder: FinalList = {};
  for (const key in list) {
    if (list.hasOwnProperty(key)) {
      const element: ForwardProps[] = list[key];
      const reducedArray: ReduceObjectProps = reduce(element, (a, b) => {
        return {
          fee: a.fee + b.fee,
          tokens: a.tokens + b.tokens
        };
      });
      reducedOrder[key] = {
        amount: element.length,
        ...reducedArray
      } as FinalProps;
    }
  }

  return reducedOrder;
};

export const countArray = (
  list: ForwardProps[],
  type: boolean
): ChannelCounts[] => {
  const count: CountProps = {};
  list
    .map(item => {
      return type ? item.incoming_channel : item.outgoing_channel;
    })
    .forEach(channel => {
      count[channel] = (count[channel] || 0) + 1;
    });

  const mapped: ChannelCounts[] = [];
  for (const key in count) {
    if (count.hasOwnProperty(key)) {
      const element = count[key];
      mapped.push({
        name: key,
        count: element
      });
    }
  }
  sortBy(mapped, "count");
  return mapped;
};
