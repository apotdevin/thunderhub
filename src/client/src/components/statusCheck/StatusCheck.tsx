import { useEffect } from 'react';
import { toast } from 'react-toastify';
import getConfig from 'next/config';
import { useGetNodeInfoQuery } from '../../../src/graphql/queries/__generated__/getNodeInfo.generated';

const { publicRuntimeConfig } = getConfig();
const { logoutUrl, basePath } = publicRuntimeConfig;

export const StatusCheck: React.FC = () => {
  const { error, stopPolling } = useGetNodeInfoQuery({
    fetchPolicy: 'network-only',
    pollInterval: 10000,
  });

  useEffect(() => {
    if (error) {
      toast.error(`Unable to connect to node`);
      stopPolling();
      window.location.href = logoutUrl || `${basePath}/login`;
    }
  }, [error, stopPolling]);

  return null;
};
