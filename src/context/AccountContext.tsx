import React, { createContext, useState, useContext } from 'react';
import merge from 'lodash.merge';
import { getAuthParams } from '../utils/auth';

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
    setAccount: (newProps: ChangeProps) => void;
    changeAccount: (account: number) => void;
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
    setAccount: () => {},
    changeAccount: () => {},
    refreshAccount: () => {},
});

const AccountProvider = ({ children }: any) => {
    const activeAccount = localStorage.getItem('account') || 'auth1';
    const sessionAdmin = sessionStorage.getItem('session') || '';
    const { name, host, admin, viewOnly, cert } = getAuthParams(activeAccount);
    const loggedIn = host !== '' && (viewOnly !== '' || sessionAdmin !== '');

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

    const changeAccount = (account: number) => {
        const newAccount = localStorage.getItem(`auth${account}-name`);
        if (!newAccount) return;

        sessionStorage.removeItem('session');
        localStorage.setItem('account', `auth${account}`);

        refreshAccount(`auth${account}`);
    };

    const refreshAccount = (account?: string) => {
        const activeAccount = account
            ? account
            : localStorage.getItem('account') || 'auth1';
        const sessionAdmin = sessionStorage.getItem('session') || '';
        const { name, host, admin, viewOnly, cert } = getAuthParams(
            activeAccount,
        );
        const loggedIn =
            host !== '' && (viewOnly !== '' || sessionAdmin !== '');

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

    const accountState = {
        loggedIn,
        name,
        host,
        admin,
        sessionAdmin,
        viewOnly,
        cert,
        setAccount,
        changeAccount,
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
