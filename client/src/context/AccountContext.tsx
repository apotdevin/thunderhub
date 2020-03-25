import React, { createContext, useState, useContext } from 'react';
import merge from 'lodash.merge';
import { getAuth } from 'utils/auth';
import { saveAccounts } from 'utils/storage';

interface SingleAccountProps {
    name: string;
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
}

interface AccountProps {
    loggedIn: boolean;
    name: string;
    host: string;
    admin: string;
    sessionAdmin: string;
    viewOnly: string;
    cert: string;
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
    accounts: [],
    setAccount: () => {},
    changeAccount: () => {},
    deleteAccount: () => {},
    refreshAccount: () => {},
});

const AccountProvider = ({ children }: any) => {
    const sessionAdmin = sessionStorage.getItem('session') || '';
    const { name, host, admin, viewOnly, cert, accounts, loggedIn } = getAuth();

    const setAccount = ({
        loggedIn,
        name,
        host,
        admin,
        sessionAdmin,
        viewOnly,
        cert,
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
            });
        });
    };

    const changeAccount = (currentActive: string) => {
        const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
        const index = accounts.findIndex(
            (account: any) => account.name === currentActive,
        );

        if (index < 0) return;

        sessionStorage.removeItem('session');
        localStorage.setItem('active', `${index}`);

        refreshAccount(`${index}`);
    };

    const deleteAccount = (accountName: string) => {
        const currentAccounts = JSON.parse(
            localStorage.getItem('accounts') || '[]',
        );
        const current = currentAccounts.find(
            (account: any) => account.name === accountName,
        );

        if (!current) return;

        const isCurrentAccount = current.name === name;

        const changedAccounts = [...currentAccounts].filter(
            (account) => account.name !== accountName,
        );
        const length = changedAccounts.length;

        if (isCurrentAccount) {
            sessionStorage.removeItem('session');
            localStorage.setItem('active', `${length - 1}`);
        } else {
            const newIndex = changedAccounts.findIndex(
                (account: any) => account.name === name,
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
            });

            return { ...merged, accounts };
        });
    };

    const accountState = {
        loggedIn,
        name,
        host,
        admin,
        sessionAdmin,
        viewOnly,
        cert,
        accounts,
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
