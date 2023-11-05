import numeral from 'numeral';

export const numberWithCommas = (
  x: number | string | undefined | null,
  format = '0,0'
): string => {
  const normalized = Number(x);

  if (!normalized) {
    return '-';
  }

  return numeral(normalized).format(format);
};
