import { useGetAmbossUserQuery } from '../../src/graphql/queries/__generated__/getAmbossUser.generated';

export const useAmbossUser = () => {
  const { data, loading } = useGetAmbossUserQuery();

  if (loading || !data?.getAmbossUser) {
    return { user: null, loading };
  }

  return { user: data.getAmbossUser, loading };
};
