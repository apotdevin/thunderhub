import { differenceInCalendarDays, differenceInHours, subDays } from 'date-fns';
import groupBy from 'lodash.groupby';
import { Forward } from 'src/graphql/types';

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
