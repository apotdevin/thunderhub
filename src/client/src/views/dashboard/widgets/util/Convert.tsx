import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { SelectWithValue } from '../../../../components/select';
import { usePriceState } from '../../../../context/PriceContext';

export const ConvertWidget = () => {
  const { prices, dontShow } = usePriceState();

  const [firstAmount, setFirstAmount] = useState(1);
  const [secondAmount, setSecondAmount] = useState(100000000);

  const available = Object.keys(prices || {});
  const options = [
    { value: 'btc', label: 'BTC' },
    { value: 'sat', label: 'SAT' },
    ...available.map(c => ({ value: c, label: c })),
  ];

  const [first, setFirst] = useState(options[0]);
  const [second, setSecond] = useState(options[1]);

  if (dontShow) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        Fetching fiat prices is disabled. Enable it in the settings.
      </div>
    );
  }

  const getPrice = (currency: string) => {
    switch (currency) {
      case 'btc':
        return 1;
      case 'sat':
        return 100000000;
      default:
        return prices?.[currency]?.last || 0;
    }
  };

  const convert = (from: string, to: string, value: number) => {
    const fromPrice = getPrice(from);
    const toPrice = getPrice(to);

    if (from === to) {
      return value;
    }

    if (from === 'btc') {
      return fromPrice * toPrice * value;
    }

    return (toPrice / fromPrice) * value;
  };

  const getValue = (value: number, current: string) => {
    switch (current) {
      case 'btc':
        return value.toLocaleString('en-US', { maximumFractionDigits: 8 });
      case 'sat':
        return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
      default:
        return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center px-1">
      <div className="my-2 grid gap-2 grid-cols-[2fr_4fr_100px] items-center">
        <div>{getValue(firstAmount, first.value)}</div>
        <Input
          placeholder={'Amount'}
          value={firstAmount}
          type={'number'}
          onChange={e => {
            const value = Number(e.target.value);
            setFirstAmount(value);
            setSecondAmount(convert(first.value, second.value, value));
          }}
        />
        <SelectWithValue
          callback={e => {
            const value = (e[0] || options[0]) as any;
            setFirst(value);
            setFirstAmount(convert(second.value, value.value, secondAmount));
          }}
          options={options}
          value={first}
          isClearable={false}
          maxWidth={'100px'}
        />
        <div>{getValue(secondAmount, second.value)}</div>
        <Input
          placeholder={'Amount'}
          value={secondAmount}
          type={'number'}
          onChange={e => {
            const value = Number(e.target.value);
            setSecondAmount(value);
            setFirstAmount(convert(second.value, first.value, value));
          }}
        />
        <SelectWithValue
          callback={e => {
            const value = (e[0] || options[1]) as any;
            setSecond(value);
            setSecondAmount(convert(first.value, value.value, firstAmount));
          }}
          options={options}
          value={second}
          isClearable={false}
          maxWidth={'100px'}
        />
      </div>
    </div>
  );
};
