export const formatNativeAsset = (balance: number, symbol: string) => {
  const formatted =
    balance % 1 === 0
      ? balance.toLocaleString()
      : balance.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
  return `${formatted} ${symbol}`;
};
