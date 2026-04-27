import Big from 'big.js';

/**
 * Converts a decimal display string (e.g. "1.5") to atomic BigInt units.
 */
export const displayToAtomic = (display: string, precision: number): bigint => {
  const [whole] = display.split('.');
  if (precision === 0) return BigInt(whole || '0');

  const frac = display.split('.')[1] || '';
  const padded = frac.padEnd(precision, '0').slice(0, precision);
  return BigInt(whole || '0') * BigInt(10 ** precision) + BigInt(padded || '0');
};

/**
 * Converts display asset units to satoshis using the rate.
 * rate is in asset-units per BTC (full_amount from trade API).
 */
export const displayAssetToSats = (
  displayAmount: string,
  rate: string,
  precision: number
): string => {
  if (!rate || rate === '0') return '0';
  const atomic = new Big(displayToAtomic(displayAmount, precision).toString());
  const sats = atomic.times(1e8).div(new Big(rate));
  const rounded = sats.round(0, Big.roundDown);
  return rounded.toString();
};

/**
 * Converts atomic asset units to a human-readable decimal string.
 * Uses big.js to avoid precision loss for large values.
 */
export const atomicToDisplay = (atomic: string, precision: number): string => {
  if (precision === 0) return atomic;
  return new Big(atomic).div(new Big(10).pow(precision)).toFixed(precision);
};
