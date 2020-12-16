import React from 'react';
import { useSpring, animated } from 'react-spring';
import { getValue } from '../../utils/helpers';
import { useConfigState } from '../../context/ConfigContext';
import { usePriceState } from '../../context/PriceContext';

type PriceProps = {
  price: number;
  symbol: string;
  currency: string;
};

type AnimatedProps = {
  amount?: number;
};

export const AnimatedNumber: React.FC<AnimatedProps> = ({ amount = 0 }) => {
  const { value } = useSpring({
    from: { value: 0 },
    value: amount,
  });
  const { currency, displayValues } = useConfigState();
  const { fiat, prices, dontShow } = usePriceState();

  if (!displayValues) {
    return <>-</>;
  }

  let priceProps: PriceProps = {
    price: 0,
    symbol: '',
    currency: currency !== 'btc' && currency !== 'sat' ? 'sat' : currency,
  };

  if (currency === 'fiat' && prices && !dontShow) {
    const current: { last: number; symbol: string } = prices[fiat] ?? {
      last: 0,
      symbol: '',
    };

    priceProps = {
      price: current.last,
      symbol: current.symbol,
      currency,
    };
  }

  return (
    <animated.div>
      {value.interpolate(amount =>
        getValue({ amount: amount as number, ...priceProps })
      )}
    </animated.div>
  );
};
