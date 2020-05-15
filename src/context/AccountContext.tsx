/* eslint-disable  @typescript-eslint/no-use-before-define */
import React, { createContext, useState, useContext, useEffect } from 'react';
import merge from 'lodash.merge';
import { getAuth, getAuthObj } from '../utils/auth';
import { saveAccounts } from '../utils/storage';

export interface SingleAccountProps {
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
  name?: string;
  host?: string;
  admin?: string;
  sessionAdmin?: string;
  viewOnly?: string;
  cert?: string;
  id?: string;
}

interface AccountProps {
  name: string;
  host: string;
  admin: string;
  sessionAdmin: string;
  viewOnly: string;
  cert: string;
  id: string;
  auth: AuthProps | undefined;
  accounts: SingleAccountProps[];
  changeAccount: (account: string) => void;
  deleteAccount: (account: string) => void;
  refreshAccount: () => void;
}

export const AccountContext = createContext<AccountProps>({
  name: '',
  host: '',
  admin: '',
  sessionAdmin: '',
  viewOnly: '',
  cert: '',
  id: '',
  auth: undefined,
  accounts: [],
  changeAccount: () => ({}),
  deleteAccount: () => ({}),
  refreshAccount: () => ({}),
});

const AccountProvider = ({ children }: any) => {
  useEffect(() => {
    refreshAccount();
  }, []);

  const changeAccount = (changeToId: string) => {
    const currentAccounts = JSON.parse(
      localStorage.getItem('accounts') || '[]'
    );

    let index = -1;
    for (let i = 0; i < currentAccounts.length; i++) {
      if (currentAccounts[i].id === changeToId) {
        index = i;
      }
    }

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
    const { name, host, admin, viewOnly, cert, id, accounts } = getAuth(
      account
    );

    updateAccount((prevState: any) => {
      const newState = { ...prevState };

      const merged = merge(newState, {
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
    name: '',
    host: '',
    admin: '',
    sessionAdmin: '',
    viewOnly: '',
    cert: '',
    id: '',
    auth: undefined,
    accounts: [],
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
