import { InOutProps, InOutListProps } from './interface';

export const reduceInOutArray = (list: InOutListProps) => {
  const reducedOrder = [];
  for (const key in list) {
    if (Object.prototype.hasOwnProperty.call(list, key)) {
      const element: InOutProps[] = list[key];
      const reducedArray: InOutProps = element.reduce(
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
