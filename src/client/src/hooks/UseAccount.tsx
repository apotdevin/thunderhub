import { ServerAccount } from '../../src/graphql/types';
import { useGetAccountQuery } from '../../src/graphql/queries/__generated__/getAccount.generated';

export const useAccount = (): ServerAccount | null => {
  const { data, loading } = useGetAccountQuery({ ssr: false });

  if (loading || !data?.getAccount) {
    return null;
  }

  return data.getAccount;
};
