import { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_BITCOIN_FEES } from '../../graphql/query';
import { useBitcoinDispatch } from '../../context/BitcoinContext';

export const BitcoinFees = () => {
  const setInfo = useBitcoinDispatch();
  const { loading, data, stopPolling } = useQuery(GET_BITCOIN_FEES, {
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
