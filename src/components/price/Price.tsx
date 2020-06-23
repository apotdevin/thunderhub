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
  override,
}: {
  amount: number | string;
  breakNumber?: boolean;
  override?: string;
}): JSX.Element => {
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

  return <>{getValue({ amount, ...priceProps, breakNumber, override })}</>;
};

interface GetPriceProps {
  amount: number | string;
  breakNumber?: boolean;
  override?: string;
  noUnit?: boolean;
}

export const getPrice = (
  currency: string,
  displayValues: boolean,
  priceContext: {
    fiat: string;
    dontShow: boolean;
    prices?: { [key: string]: { last: number; symbol: string } };
  }
) => ({
  amount,
  breakNumber = false,
  override,
  noUnit,
}: GetPriceProps): string => {
  const { prices, dontShow, fiat } = priceContext;

  if (!displayValues) {
    return '-';
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

  return getValue({ amount, ...priceProps, breakNumber, override, noUnit });
};
