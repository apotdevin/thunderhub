import { useGetNodeBalancesQuery } from 'src/graphql/queries/__generated__/getNodeBalances.generated';

const initialState = {
  onchain: { confirmed: '-', pending: '-', closing: '' },
  lightning: {
    confirmed: '-',
    active: '-',
    commit: '-',
    pending: '-',
  },
};

export const useNodeBalances = () => {
  const { data, loading, error } = useGetNodeBalancesQuery({
    pollInterval: 10000,
  });

  if (!data?.getNodeBalances || loading || error) {
    return initialState;
  }

  return data.getNodeBalances;
};
