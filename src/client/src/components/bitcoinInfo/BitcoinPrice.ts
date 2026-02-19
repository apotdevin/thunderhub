import { useEffect } from 'react';
import { useGetBitcoinPriceQuery } from '@/graphql/queries/__generated__/getBitcoinPrice.generated';
import { usePriceDispatch } from '../../context/PriceContext';
import { useConfigState } from '../../context/ConfigContext';

export const BitcoinPrice: React.FC = () => {
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
      } catch {
        setPrices({ type: 'dontShow' });
        stopPolling();
      }
    }
  }, [data, loading, setPrices, stopPolling, fetchPrices]);

  return null;
};
