import { useState, useEffect } from 'react';
import { useGetBaseCanConnectQuery } from 'src/graphql/queries/__generated__/getBaseCanConnect.generated';

export const useBaseConnect = () => {
  const [canConnect, setCanConnect] = useState<boolean>(false);

  const { loading, error, data } = useGetBaseCanConnectQuery();

  useEffect(() => {
    if (loading || !data?.getBaseCanConnect || error) return;
    setCanConnect(true);
  }, [loading, data, error]);

  return canConnect;
};
