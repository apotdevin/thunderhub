import { useEffect } from 'react';
import { usePriceDispatch } from '../../context/PriceContext';
import { useGetBitcoinPriceQuery } from '../../generated/graphql';
import { useConfigState } from '../../context/ConfigContext';

export const BitcoinPrice = () => {
  const { fetchPrices } = useConfigState();
  const setPrices = usePriceDispatch();
  const { loading, data, stopPolling } = useGetBitcoinPriceQuery({
    skip: !fetchPrices,
    fetchPolicy: 'network-only',
    onError: () => {
      setPrices({ type: 'dontShow' });
      stopPolling();
    },
    pollInterval: 60000,
  });

  useEffect(() => {
    if (!fetchPrices) {
      setPrices({ type: 'dontShow' });
    }
  }, [fetchPrices, setPrices]);

  useEffect(() => {
    if (!loading && data && data.getBitcoinPrice && fetchPrices) {
      try {
        const prices = JSON.parse(data.getBitcoinPrice);
        setPrices({ type: 'fetched', state: { prices } });
      } catch (error) {
        setPrices({ type: 'dontShow' });
        stopPolling();
      }
    }
  }, [data, loading, setPrices, stopPolling, fetchPrices]);

  return null;
};
