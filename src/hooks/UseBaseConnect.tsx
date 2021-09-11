import { useGetBaseCanConnectQuery } from 'src/graphql/queries/__generated__/getBaseCanConnect.generated';

export const useBaseConnect = () => {
  const { loading, error, data } = useGetBaseCanConnectQuery({
    ssr: false,
    fetchPolicy: 'cache-first',
  });

  if (loading || !data?.getBaseCanConnect || error)
    return { connected: false, loading };

  return { connected: true, loading };
};
