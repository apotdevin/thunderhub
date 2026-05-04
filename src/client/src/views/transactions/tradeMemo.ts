import { formatNumber } from '../../utils/helpers';

const TRADE_MEMO_PREFIX = 'th:trade:';

type TradeMemo = {
  t?: 'buy' | 'sell' | string;
  amt?: string;
  s?: string;
  p?: number;
};

const formatAssetAmount = (atomic?: string, precision?: number) => {
  if (!atomic) return null;

  const numericPrecision = Number(precision ?? 0);
  const value = Number(atomic);

  if (!Number.isFinite(value)) return atomic;

  if (numericPrecision > 0) {
    return (value / 10 ** numericPrecision).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: numericPrecision,
    });
  }

  return formatNumber(atomic);
};

export const formatTradeMemo = (value?: string | null) => {
  if (!value?.startsWith(TRADE_MEMO_PREFIX)) return value ?? null;

  try {
    const parsed = JSON.parse(
      value.slice(TRADE_MEMO_PREFIX.length)
    ) as TradeMemo;
    const direction =
      parsed.t === 'buy' ? 'Buy' : parsed.t === 'sell' ? 'Sell' : 'Trade';
    const amount = formatAssetAmount(parsed.amt, parsed.p);
    const symbol = parsed.s || 'asset';

    return amount
      ? `${direction} ${amount} ${symbol}`
      : `${direction} ${symbol}`;
  } catch {
    return 'Trade';
  }
};
