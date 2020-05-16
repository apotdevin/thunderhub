import { useGetServerAccountsQuery } from 'src/generated/graphql';
import * as React from 'react';
import {
  useAccountDispatch,
  SERVER_ACCOUNT,
  SSO_ACCOUNT,
} from 'src/context/NewAccountContext';
import { addIdAndTypeToAccount } from 'src/context/helpers/context';
import { useConfigState } from 'src/context/ConfigContext';

export const ServerAccounts = () => {
  const { ssoVerified } = useConfigState();
  const dispatch = useAccountDispatch();

  const { data, loading } = useGetServerAccountsQuery();

  React.useEffect(() => {
    if (ssoVerified) {
      dispatch({
        type: 'addAccounts',
        accountsToAdd: [
          { name: 'SSO Account', id: SSO_ACCOUNT, type: SSO_ACCOUNT },
        ],
      });
    }
  }, [ssoVerified, dispatch]);

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
      const accountsToAdd = data.getServerAccounts.map(a => ({
        ...a,
        type: SERVER_ACCOUNT,
      }));
      dispatch({ type: 'addAccounts', accountsToAdd });
    }
  }, [loading, data, dispatch]);

  return null;
};
