import { useGetNodeBalancesQuery } from '../../src/graphql/queries/__generated__/getNodeBalances.generated';

const initialState = {
  onchain: { confirmed: '0', pending: '0', closing: '0' },
  lightning: {
    confirmed: '0',
    active: '0',
    commit: '0',
    pending: '0',
  },
  liquid: '0',
};

export const useNodeBalances = () => {
  const { data, loading, error } = useGetNodeBalancesQuery();

  if (!data?.getNodeBalances || loading || error) {
    return initialState;
  }

  return data.getNodeBalances;
};
