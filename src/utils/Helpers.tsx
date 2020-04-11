import numeral from 'numeral';

const getValueString = (amount: number): string => {
  if (amount >= 100000) {
    return `${amount / 1000000}m`;
  }
  if (amount >= 1000) {
    return `${amount / 1000}k`;
  }
  return `${amount}`;
};

interface GetNumberProps {
  amount: string | number;
  price: number;
  symbol: string;
  currency: string;
  breakNumber?: boolean;
}

export const getValue = ({
  amount,
  price,
  symbol,
  currency,
  breakNumber,
}: GetNumberProps): string => {
  let value: number = 0;
  if (typeof amount === 'string') {
    value = Number(amount);
  } else {
    value = amount;
  }

  if (currency === 'btc') {
    if (!value) return '₿0.0';
    const amountInBtc = value / 100000000;
    return `₿${amountInBtc}`;
  }
  if (currency === 'sat') {
    const breakAmount = breakNumber
      ? getValueString(value)
      : numeral(value).format('0,0');
    return `${breakAmount} sats`;
  }

  const amountInFiat = (value / 100000000) * price;
  return `${symbol}${numeral(amountInFiat).format('0,0.00')}`;
};

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

export const saveToPc = (jsonData: string, filename: string) => {
  const fileData = jsonData;
  const blob = new Blob([fileData], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${filename}.txt`;
  link.href = url;
  link.click();
};
