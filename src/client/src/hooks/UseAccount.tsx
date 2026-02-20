import { ServerAccount } from '@/graphql/types';
import { useGetAccountQuery } from '@/graphql/queries/__generated__/getAccount.generated';

export const useAccount = (): ServerAccount | null => {
  const { data, loading } = useGetAccountQuery();

  if (loading || !data?.getAccount) {
    return null;
  }

  return data.getAccount;
};
