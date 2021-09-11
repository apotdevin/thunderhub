import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import getConfig from 'next/config';
import { useGetNodeInfoQuery } from 'src/graphql/queries/__generated__/getNodeInfo.generated';

const { publicRuntimeConfig } = getConfig();
const { logoutUrl } = publicRuntimeConfig;

export const StatusCheck: React.FC = () => {
  const { push } = useRouter();

  const { error, stopPolling } = useGetNodeInfoQuery({
    fetchPolicy: 'network-only',
    pollInterval: 10000,
  });

  useEffect(() => {
    if (error) {
      toast.error(`Unable to connect to node`);
      stopPolling();
      logoutUrl ? (window.location.href = logoutUrl) : push('/login');
    }
  }, [error, push, stopPolling]);

  return null;
};
