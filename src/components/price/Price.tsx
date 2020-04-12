import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { getValue } from '../../utils/Helpers';
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
  amount: number;
  breakNumber?: boolean;
}) => {
  const { currency } = useSettings();
  const { prices, loading, error } = usePriceState();

  let priceProps: PriceProps = {
    price: 0,
    symbol: '',
    currency: currency !== 'btc' && currency !== 'sat' ? 'sat' : currency,
  };

  if (prices && !loading && !error) {
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

  const getFormat = (amount: number) =>
    getValue({ amount, ...priceProps, breakNumber });

  return <>{getFormat(amount)}</>;
};

export const getPrice = (
  currency: string,
  priceContext: {
    error: boolean;
    loading: boolean;
    prices?: { [key: string]: { last: number; symbol: string } };
  }
) => ({
  amount,
  breakNumber = false,
}: {
  amount: number;
  breakNumber?: boolean;
}) => {
  const { prices, loading, error } = priceContext;

  let priceProps: PriceProps = {
    price: 0,
    symbol: '',
    currency: currency !== 'btc' && currency !== 'sat' ? 'sat' : currency,
  };

  if (prices && !loading && !error) {
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

  const getFormat = (amount: number) =>
    getValue({ amount, ...priceProps, breakNumber });

  return getFormat(amount);
};
