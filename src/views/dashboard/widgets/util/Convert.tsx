import numeral from 'numeral';
import { useState } from 'react';
import { Input } from 'src/components/input';
import { SelectWithValue } from 'src/components/select';
import { usePriceState } from 'src/context/PriceContext';
import styled from 'styled-components';

const S = {
  row: styled.div`
    margin: 8px 0;
    display: grid;
    grid-gap: 8px;
    grid-template-columns: 2fr 4fr 100px;
    align-items: center;
  `,
  wrapper: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 4px;
  `,
  contentWrapper: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  content: styled.div`
    width: 100%;
    padding: 0 16px;
    height: calc(100% - 40px);
    overflow: auto;
  `,
  title: styled.h4`
    font-weight: 900;
    margin: 8px 0;
  `,
  nowrap: styled.div`
    white-space: nowrap;
  `,
};

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
      <S.contentWrapper>
        Fetching fiat prices is disabled. Enable it in the settings.
      </S.contentWrapper>
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
        return numeral(value).format('0,0.[00000000]');
      case 'sat':
        return numeral(value).format('0,0');
      default:
        return numeral(value).format('0,0.[00]');
    }
  };

  return (
    <S.wrapper>
      <S.row>
        <div>{getValue(firstAmount, first.value)}</div>
        <Input
          fullWidth={true}
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
          fullWidth={true}
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
      </S.row>
    </S.wrapper>
  );
};
