import * as React from 'react';
import {
  useAccountDispatch,
  SERVER_ACCOUNT,
  SSO_ACCOUNT,
  useAccountState,
} from 'src/context/AccountContext';
import { addIdAndTypeToAccount } from 'src/context/helpers/context';
import { useGetServerAccountsQuery } from 'src/graphql/queries/__generated__/getServerAccounts.generated';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { appendBasePath } from 'src/utils/basePath';

export const ServerAccounts = () => {
  const { hasAccount } = useAccountState();
  const dispatch = useAccountDispatch();
  const { push, pathname } = useRouter();

  const { data, loading } = useGetServerAccountsQuery();

  React.useEffect(() => {
    if (hasAccount === 'error' && pathname !== '/') {
      toast.error('No account found');
      dispatch({ type: 'resetFetch' });
      push(appendBasePath('/'));
    }
  }, [hasAccount, push, dispatch, pathname]);

  React.useEffect(() => {
    const session = sessionStorage.getItem('session') || null;
    const changeId = localStorage.getItem('active') || null;
    const savedAccounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    const accountsToAdd = savedAccounts.map(a => addIdAndTypeToAccount(a));
    dispatch({
      type: 'initialize',
      accountsToAdd,
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
      dispatch({
        type: 'addAccounts',
        accountsToAdd,
      });
    }
  }, [loading, data, dispatch]);

  return null;
};
