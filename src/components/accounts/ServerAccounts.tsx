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

  const { data, loading } = useGetServerAccountsQuery({
    fetchPolicy: 'network-only',
  });

  React.useEffect(() => {
    const session = sessionStorage.getItem('session') || null;
    const changeId = localStorage.getItem('active') || null;
    const savedAccounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    const accountsToAdd = savedAccounts.map(a => addIdAndTypeToAccount(a));
    const storedAccounts = JSON.parse(
      localStorage.getItem('storedAccounts') || '[]'
    );
    dispatch({
      type: 'initialize',
      accountsToAdd: [...accountsToAdd, ...storedAccounts],
      changeId,
      session,
    });
  }, [dispatch]);

  React.useEffect(() => {
    if (!loading && data?.getServerAccounts) {
      const accountsToAdd = data.getServerAccounts.map(a => {
        const type = a?.id === SSO_ACCOUNT ? SSO_ACCOUNT : SERVER_ACCOUNT;
        return {
          name: a.name,
          id: a.id,
          loggedIn: a.loggedIn,
          type,
        };
      });
      localStorage.setItem('storedAccounts', JSON.stringify(accountsToAdd));
      dispatch({ type: 'addAccounts', accountsToAdd });
    }
  }, [loading, data, dispatch]);

  return null;
};
