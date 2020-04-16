import { useEffect } from 'react';
import { usePriceDispatch } from '../../context/PriceContext';
import { useGetBitcoinPriceQuery } from '../../generated/graphql';

export const BitcoinPrice = () => {
  const setPrices = usePriceDispatch();
  const { loading, data, stopPolling } = useGetBitcoinPriceQuery({
    fetchPolicy: 'network-only',
    onError: () => setPrices({ type: 'error' }),
    pollInterval: 60000,
  });

  useEffect(() => {
    if (!loading && data && data.getBitcoinPrice) {
      try {
        const prices = JSON.parse(data.getBitcoinPrice);
        setPrices({
          type: 'fetched',
          state: { loading: false, error: false, prices },
        });
      } catch (error) {
        stopPolling();
        setPrices({ type: 'error' });
      }
    }
  }, [data, loading, setPrices, stopPolling]);

  return null;
};
