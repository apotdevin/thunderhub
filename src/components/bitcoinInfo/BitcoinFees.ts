import { useEffect } from 'react';
import { useGetBitcoinFeesQuery } from 'src/graphql/queries/__generated__/getBitcoinFees.generated';
import { useConfigState } from '../../context/ConfigContext';

export const BitcoinFees: React.FC = () => {
  const { fetchFees } = useConfigState();

  const { stopPolling, error } = useGetBitcoinFeesQuery({
    ssr: false,
    skip: !fetchFees,
    fetchPolicy: 'network-only',
    pollInterval: 60000,
  });

  useEffect(() => {
    if (error || !fetchFees) {
      stopPolling();
    }
  }, [error, stopPolling, fetchFees]);

  return null;
};
