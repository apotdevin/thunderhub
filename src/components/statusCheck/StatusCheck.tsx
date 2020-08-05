import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useGetNodeInfoQuery } from 'src/graphql/queries/__generated__/getNodeInfo.generated';

export const StatusCheck: React.FC = () => {
  const { push } = useRouter();

  const { error, stopPolling } = useGetNodeInfoQuery({
    ssr: false,
    fetchPolicy: 'network-only',
    pollInterval: 10000,
  });

  useEffect(() => {
    if (error) {
      toast.error(`Unable to connect to node`);
      stopPolling();
      push('/');
    }
  }, [error, push, stopPolling]);

  return null;
};
