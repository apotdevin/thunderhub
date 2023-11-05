import numeral from 'numeral';
import { SatoshiSymbol } from '../components/satoshi/Satoshi';
import { unSelectedNavButton } from '../styles/Themes';
import styled from 'styled-components';

const DarkUnit = styled.span`
  font-size: 12px;
  color: ${unSelectedNavButton};
`;

const getValueString = (amount: number): string => {
  if (amount >= 100000) {
    return `${numeral(amount / 1000000).format('0,0.[0]')}m`;
  }
  if (amount >= 1000) {
    return `${numeral(amount / 1000).format('0,0.[0]')}k`;
  }
  return `${numeral(amount).format('0,0.[0]')}`;
};

interface GetNumberProps {
  amount: string | number | null | undefined;
  price: number;
  symbol: string;
  currency: string;
  breakNumber?: boolean;
  override?: string;
  noUnit?: boolean;
  useSatWord?: boolean;
}

export const getValue = ({
  amount,
  price,
  symbol,
  currency,
  breakNumber,
  override,
  noUnit,
  useSatWord,
}: GetNumberProps): JSX.Element | string => {
  if (!amount) return '';
  const correctCurrency = override || currency;
  let value = 0;
  if (typeof amount === 'string') {
    value = Number(amount);
  } else {
    value = amount;
  }

  if (correctCurrency === 'ppm') {
    const amount = numeral(value).format('0,0.[000]');
    return noUnit ? amount : `${amount} ppm`;
  }

  if (correctCurrency === 'btc') {
    if (!value) return noUnit ? '0.0' : '₿0.0';
    const amountInBtc = value / 100000000;
    const rounded = Math.round(amountInBtc * 10000) / 10000;

    return noUnit ? (
      `${rounded}`
    ) : (
      <>
        <DarkUnit>₿</DarkUnit>
        {rounded}
      </>
    );
  }
  if (correctCurrency === 'sat') {
    const breakAmount = breakNumber
      ? getValueString(value)
      : numeral(value).format('0,0.[000]');

    if (noUnit) {
      return `${breakAmount}`;
    }

    if (useSatWord) {
      return (
        <>
          {breakAmount}
          <DarkUnit as={'span'}>sats</DarkUnit>
        </>
      );
    }

    return (
      <>
        {breakAmount}
        <SatoshiSymbol color={'grey'} transform={'translate(0,2)'} />
      </>
    );
  }

  const amountInFiat = ((value / 100000000) * price).toFixed(2);
  return noUnit ? (
    numeral(amountInFiat).format('0,0.00')
  ) : (
    <>
      {numeral(amountInFiat).format('0,0.00')}
      <DarkUnit>{symbol}</DarkUnit>
    </>
  );
};

export const formatSats = (value: number) => numeral(value).format('0,0.[000]');

export const btcToSat = (value: number | string | null | undefined): number => {
  if (!value) return 0;
  const amount = Number(value);

  if (isNaN(amount)) {
    return 0;
  }

  return Math.round(amount * 100000000);
};

export const blockToTime = (blocks: number): string =>
  formatSeconds(blocks * 10 * 60) || '';

export const getPercent = (
  local: number,
  remote: number,
  withDecimals?: boolean
): number => {
  const total = remote + local;
  const percent = (local / total) * 100;

  if (remote === 0 && local === 0) {
    return 0;
  }

  if (withDecimals) {
    return Math.round(percent * 100) / 100;
  }

  return Math.round(percent);
};

export const saveToPc = (
  jsonData: string,
  filename: string,
  isCsv?: boolean,
  isJson?: boolean
) => {
  const fileData = jsonData;
  const blob = new Blob([fileData], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = isCsv
    ? `${filename}.csv`
    : isJson
    ? `${filename}.json`
    : `${filename}.txt`;
  link.href = url;
  link.click();
};

export const encode = (data: string): string =>
  Buffer.from(data, 'binary').toString('base64');
export const decode = (data: string): string =>
  Buffer.from(data, 'base64').toString('binary');

export const isLightningInvoice = (invoice: string): boolean => {
  let isValidLightningInvoice = false;
  if (
    invoice.toLowerCase().startsWith('lightning:lnb') ||
    invoice.toLowerCase().startsWith('lnb')
  ) {
    isValidLightningInvoice = true;
  }
  return isValidLightningInvoice;
};

export const cleanLightningInvoice = (invoice: string) => {
  return invoice.replace('LIGHTNING:', '').replace('lightning:', '');
};

export const formatSeconds = (
  seconds: number | null | undefined
): string | null => {
  if (!seconds || seconds === 0) {
    return null;
  }

  const y = Math.floor(seconds / (3600 * 24 * 365));
  const d = Math.floor((seconds % (3600 * 24 * 365)) / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const yDisplay = y > 0 ? `${y}y ` : '';
  const dDisplay = d > 0 ? `${d}d ` : '';
  const hDisplay = h > 0 ? `${h}h ` : '';
  const mDisplay = m > 0 ? `${m}m ` : '';
  const sDisplay = s > 0 ? `${s}s` : '';
  return yDisplay + dDisplay + hDisplay + mDisplay + sDisplay;
};
