import { useGetAmbossUserQuery } from 'src/graphql/queries/__generated__/getAmbossUser.generated';

export const useAmbossUser = () => {
  const { data, loading } = useGetAmbossUserQuery();

  if (loading || !data?.getAmbossUser) {
    return null;
  }

  return data.getAmbossUser.subscription;
};
