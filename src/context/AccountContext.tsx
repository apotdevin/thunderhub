import React, { createContext, useState, useContext, useEffect } from 'react';
import merge from 'lodash.merge';
import { getAuth, getAuthObj } from '../utils/auth';
import { saveAccounts } from '../utils/storage';

interface SingleAccountProps {
  name: string;
  host: string;
  admin: string;
  viewOnly: string;
  cert: string;
  id: string;
}

interface AuthProps {
  host: string;
  admin: string;
  viewOnly: string;
  cert: string;
}

interface ChangeProps {
  loggedIn?: boolean;
  name?: string;
  host?: string;
  admin?: string;
  sessionAdmin?: string;
  viewOnly?: string;
  cert?: string;
  id?: string;
}

interface AccountProps {
  loggedIn: boolean;
  name: string;
  host: string;
  admin: string;
  sessionAdmin: string;
  viewOnly: string;
  cert: string;
  id: string;
  auth: AuthProps | undefined;
  accounts: SingleAccountProps[];
  setAccount: (newProps: ChangeProps) => void;
  changeAccount: (account: string) => void;
  deleteAccount: (account: string) => void;
  refreshAccount: () => void;
}

export const AccountContext = createContext<AccountProps>({
  loggedIn: false,
  name: '',
  host: '',
  admin: '',
  sessionAdmin: '',
  viewOnly: '',
  cert: '',
  id: '',
  auth: undefined,
  accounts: [],
  setAccount: () => {},
  changeAccount: () => {},
  deleteAccount: () => {},
  refreshAccount: () => {},
});

const AccountProvider = ({ children }: any) => {
  useEffect(() => {
    refreshAccount();
  }, []);

  const setAccount = ({
    loggedIn,
    name,
    host,
    admin,
    sessionAdmin,
    viewOnly,
    cert,
    id,
  }: ChangeProps) => {
    updateAccount((prevState: any) => {
      const newState = { ...prevState };
      return merge(newState, {
        loggedIn,
        name,
        host,
        admin,
        sessionAdmin,
        viewOnly,
        cert,
        id,
        auth: getAuthObj(host, viewOnly, sessionAdmin, cert),
      });
    });
  };

  const changeAccount = (changeToId: string) => {
    const currentAccounts = JSON.parse(
      localStorage.getItem('accounts') || '[]'
    );
    const index = currentAccounts.findIndex(
      (account: any) => account.id === changeToId
    );

    if (index < 0) return;

    sessionStorage.removeItem('session');
    localStorage.setItem('active', `${index}`);

    refreshAccount(`${index}`);
  };

  const deleteAccount = (deleteId: string) => {
    const currentAccounts = JSON.parse(
      localStorage.getItem('accounts') || '[]'
    );
    const current = currentAccounts.find(
      (account: any) => account.id === deleteId
    );

    if (!current) return;

    const isCurrentAccount = current.id === settings.id;

    const changedAccounts = [...currentAccounts].filter(
      account => account.id !== deleteId
    );
    const length = changedAccounts.length;

    if (isCurrentAccount) {
      sessionStorage.removeItem('session');
      localStorage.setItem('active', `${length - 1}`);
    } else {
      const newIndex = changedAccounts.findIndex(
        (account: any) => account.id === settings.id
      );
      localStorage.setItem('active', `${newIndex}`);
    }

    saveAccounts(changedAccounts);

    refreshAccount();
  };

  const refreshAccount = (account?: string) => {
    const sessionAdmin = sessionStorage.getItem('session') || '';
    const {
      name,
      host,
      admin,
      viewOnly,
      cert,
      id,
      accounts,
      loggedIn,
    } = getAuth(account);

    updateAccount((prevState: any) => {
      const newState = { ...prevState };

      const merged = merge(newState, {
        loggedIn,
        name,
        host,
        admin,
        sessionAdmin,
        viewOnly,
        cert,
        id,
        auth: getAuthObj(host, viewOnly, sessionAdmin, cert),
      });

      return { ...merged, accounts };
    });
  };

  const accountState = {
    loggedIn: false,
    name: '',
    host: '',
    admin: '',
    sessionAdmin: '',
    viewOnly: '',
    cert: '',
    id: '',
    auth: undefined,
    accounts: [],
    setAccount,
    changeAccount,
    deleteAccount,
    refreshAccount,
  };

  const [settings, updateAccount] = useState(accountState);

  return (
    <AccountContext.Provider value={settings}>
      {children}
    </AccountContext.Provider>
  );
};

const useAccount = () => useContext(AccountContext);

export { AccountProvider, useAccount };
