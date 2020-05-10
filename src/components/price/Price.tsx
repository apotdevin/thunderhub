import React from 'react';
import { useConfigState } from '../../context/ConfigContext';
import { getValue } from '../../utils/helpers';
import { usePriceState } from '../../context/PriceContext';

type PriceProps = {
  price: number;
  symbol: string;
  currency: string;
};

export const Price = ({
  amount,
  breakNumber = false,
}: {
  amount: number | string;
  breakNumber?: boolean;
}) => {
  const { currency, displayValues } = useConfigState();
  const { prices, dontShow } = usePriceState();

  if (!displayValues) {
    return <>-</>;
  }

  let priceProps: PriceProps = {
    price: 0,
    symbol: '',
    currency: currency !== 'btc' && currency !== 'sat' ? 'sat' : currency,
  };

  if (prices && !dontShow) {
    const current: { last: number; symbol: string } = prices[currency] ?? {
      last: 0,
      symbol: '',
    };

    priceProps = {
      price: current.last,
      symbol: current.symbol,
      currency,
    };
  }

  return <>{getValue({ amount, ...priceProps, breakNumber })}</>;
};

interface GetPriceProps {
  amount: number | string;
  breakNumber?: boolean;
}

export const getPrice = (
  currency: string,
  displayValues: boolean,
  priceContext: {
    dontShow: boolean;
    prices?: { [key: string]: { last: number; symbol: string } };
  }
) => ({ amount, breakNumber = false }: GetPriceProps): string => {
  const { prices, dontShow } = priceContext;

  if (!displayValues) {
    return '-';
  }

  let priceProps: PriceProps = {
    price: 0,
    symbol: '',
    currency: currency !== 'btc' && currency !== 'sat' ? 'sat' : currency,
  };

  if (prices && !dontShow) {
    const current: { last: number; symbol: string } = prices[currency] ?? {
      last: 0,
      symbol: '',
    };

    priceProps = {
      price: current.last,
      symbol: current.symbol,
      currency,
    };
  }

  return getValue({ amount, ...priceProps, breakNumber });
};
