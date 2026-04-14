import Big from 'big.js';

/**
 * Converts display asset units to satoshis using the atomic rate.
 * rate is in atomic-asset-units per BTC (full_amount from trade API).
 */
export const displayAssetToSats = (
  displayAmount: string,
  rate: string,
  precision: number
): string => {
  if (!rate || rate === '0') return '0';
  const multiplier = BigInt(10 ** precision);
  return (
    (BigInt(displayAmount) * multiplier * BigInt(100_000_000)) /
    BigInt(rate)
  ).toString();
};

/**
 * Converts atomic asset units to a human-readable decimal string.
 * Uses big.js to avoid precision loss for large values.
 */
export const atomicToDisplay = (atomic: string, precision: number): string => {
  if (precision === 0) return atomic;
  return new Big(atomic).div(new Big(10).pow(precision)).toFixed(precision);
};
