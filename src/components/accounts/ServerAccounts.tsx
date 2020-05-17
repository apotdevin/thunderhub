import * as React from 'react';
import {
  useAccountDispatch,
  SERVER_ACCOUNT,
  SSO_ACCOUNT,
} from 'src/context/AccountContext';
import { addIdAndTypeToAccount } from 'src/context/helpers/context';
import { useGetServerAccountsQuery } from 'src/graphql/queries/__generated__/getServerAccounts.generated';

export const ServerAccounts = () => {
  const dispatch = useAccountDispatch();

  const { data, loading } = useGetServerAccountsQuery();

  React.useEffect(() => {
    const session = sessionStorage.getItem('session') || null;
    const changeId = localStorage.getItem('active') || null;
    const savedAccounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    const accountsToAdd = savedAccounts.map(a => addIdAndTypeToAccount(a));
    dispatch({ type: 'addAccounts', accountsToAdd });
    changeId && dispatch({ type: 'changeAccount', changeId });
    session && dispatch({ type: 'addSession', session });
  }, [dispatch]);

  React.useEffect(() => {
    if (!loading && data?.getServerAccounts) {
      const accountsToAdd = data.getServerAccounts.map(a => {
        const type = a?.id === SSO_ACCOUNT ? SSO_ACCOUNT : SERVER_ACCOUNT;
        return {
          ...a,
          type,
        };
      });
      dispatch({ type: 'addAccounts', accountsToAdd });
    }
  }, [loading, data, dispatch]);

  return null;
};
