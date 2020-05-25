import * as React from 'react';
import {
  useAccountDispatch,
  useAccountState,
  CompleteAccount,
} from 'src/context/AccountContext';
import { addIdAndTypeToAccount } from 'src/context/helpers/context';
import { useGetServerAccountsQuery } from 'src/graphql/queries/__generated__/getServerAccounts.generated';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { appendBasePath } from 'src/utils/basePath';
import { getUrlParam } from 'src/utils/url';
import { useGetAuthTokenQuery } from 'src/graphql/queries/__generated__/getAuthToken.generated';

export const ServerAccounts = () => {
  const { hasAccount } = useAccountState();
  const dispatch = useAccountDispatch();
  const { push, pathname, query } = useRouter();

  const { data, loading, refetch } = useGetServerAccountsQuery();

  const cookieParam = getUrlParam(query?.token);

  const { data: authData } = useGetAuthTokenQuery({
    skip: !cookieParam,
    variables: { cookie: cookieParam },
    errorPolicy: 'ignore',
  });

  React.useEffect(() => {
    if (cookieParam && authData && authData.getAuthToken) {
      refetch();
      push(appendBasePath('/'));
    }
  }, [push, authData, cookieParam, refetch]);

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
    if (!loading && data && data.getServerAccounts) {
      dispatch({
        type: 'addServerAccounts',
        accountsToAdd: data.getServerAccounts as CompleteAccount[],
      });
    }
  }, [loading, data, dispatch]);

  return null;
};
