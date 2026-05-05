import { formatNumber } from '../../utils/helpers';

const TRADE_MEMO_PREFIX = 'th:trade:';

export type TradeDisplayMode = 'computed' | 'raw';

type TradeMemo = {
  t?: 'buy' | 'sell' | string;
  amt?: string;
  s?: string;
  p?: number;
};

export type TradeMemoDisplay = {
  isTradeMemo: boolean;
  raw: string;
  computed: string;
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

const formatTradeMemo = (value: string) => {
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

export const getTradeMemoDisplay = (
  value?: string | null
): TradeMemoDisplay | null => {
  if (!value) return null;

  if (!value.startsWith(TRADE_MEMO_PREFIX)) {
    return {
      isTradeMemo: false,
      raw: value,
      computed: value,
    };
  }

  return {
    isTradeMemo: true,
    raw: value,
    computed: formatTradeMemo(value),
  };
};

export const getTradeMemoText = (
  value: string | null | undefined,
  mode: TradeDisplayMode
) => {
  const display = getTradeMemoDisplay(value);
  if (!display) return null;

  return mode === 'raw' ? display.raw : display.computed;
};
