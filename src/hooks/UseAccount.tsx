import { useState, useEffect } from 'react';
import { ServerAccountType } from 'src/graphql/types';
import { useGetAccountQuery } from 'src/graphql/queries/__generated__/getAccount.generated';
import { useGetServerAccountsQuery } from 'src/graphql/queries/__generated__/getServerAccounts.generated';

export const useAccount = (): ServerAccountType | null => {
  const [account, setAccount] = useState<ServerAccountType | null>(null);

  const { data, loading } = useGetAccountQuery({ ssr: false });

  useEffect(() => {
    if (!loading && data?.getAccount) {
      setAccount(data.getAccount);
    }
  }, [data, loading]);

  return account;
};

export const useAccounts = (): ServerAccountType[] => {
  const [accounts, setAccounts] = useState<ServerAccountType[]>([]);

  const { data, loading } = useGetServerAccountsQuery({ ssr: false });

  useEffect(() => {
    if (loading || !data?.getServerAccounts?.length) return;
    setAccounts(data.getServerAccounts as ServerAccountType[]);
  }, [data, loading]);

  return accounts || [];
};
