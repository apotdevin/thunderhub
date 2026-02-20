export const numberWithCommas = (
  x: number | string | undefined | null
): string => {
  const normalized = Number(x);

  if (!normalized) {
    return '-';
  }

  return normalized.toLocaleString('en-US', { maximumFractionDigits: 0 });
};
