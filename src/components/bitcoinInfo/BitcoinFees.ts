import { useEffect } from 'react';
import { useBitcoinDispatch } from '../../context/BitcoinContext';
import { useGetBitcoinFeesQuery } from '../../generated/graphql';
import { useConfigState } from '../../context/ConfigContext';

export const BitcoinFees = () => {
  const { fetchFees } = useConfigState();
  const setInfo = useBitcoinDispatch();

  const { loading, data, stopPolling } = useGetBitcoinFeesQuery({
    skip: !fetchFees,
    fetchPolicy: 'network-only',
    onError: () => {
      setInfo({ type: 'dontShow' });
      stopPolling();
    },
    pollInterval: 60000,
  });

  useEffect(() => {
    if (!fetchFees) {
      setInfo({ type: 'dontShow' });
    }
  }, [fetchFees, setInfo]);

  useEffect(() => {
    if (!loading && data && data.getBitcoinFees && fetchFees) {
      const { fast, halfHour, hour } = data.getBitcoinFees;
      setInfo({ type: 'fetched', state: { fast, halfHour, hour } });
    }
  }, [data, loading, setInfo, fetchFees]);

  return null;
};
