import { useEffect } from 'react';
import { useBitcoinDispatch } from '../../context/BitcoinContext';
import { useGetBitcoinFeesQuery } from '../../generated/graphql';

export const BitcoinFees = () => {
  const setInfo = useBitcoinDispatch();
  const { loading, data, stopPolling } = useGetBitcoinFeesQuery({
    onError: () => {
      setInfo({ type: 'error' });
      stopPolling();
    },
    pollInterval: 60000,
  });

  useEffect(() => {
    if (!loading && data && data.getBitcoinFees) {
      const { fast, halfHour, hour } = data.getBitcoinFees;
      setInfo({
        type: 'fetched',
        state: { loading: false, error: false, fast, halfHour, hour },
      });
    }
  }, [data, loading, setInfo]);

  return null;
};
