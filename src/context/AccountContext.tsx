import React, { createContext, useState, useContext } from 'react';
import merge from 'lodash.merge';
import { getAuthParams } from '../utils/auth';

interface ChangeProps {
    loggedIn?: boolean;
    name?: string;
    host?: string;
    admin?: string;
    sessionAdmin?: string;
    read?: string;
    cert?: string;
}

interface AccountProps {
    loggedIn: boolean;
    name: string;
    host: string;
    admin: string;
    sessionAdmin: string;
    read: string;
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
    read: '',
    cert: '',
    setAccount: () => {},
    changeAccount: () => {},
    refreshAccount: () => {},
});

const AccountProvider = ({ children }: any) => {
    const activeAccount = localStorage.getItem('account') || 'auth1';
    const sessionAdmin = sessionStorage.getItem('session') || '';
    const { name, host, admin, read, cert } = getAuthParams(activeAccount);
    const readMacaroon = read ? read : sessionAdmin;
    const loggedIn = host !== '' && readMacaroon !== '';

    const setAccount = ({
        loggedIn,
        name,
        host,
        admin,
        read,
        cert,
    }: ChangeProps) => {
        updateAccount((prevState: any) => {
            const newState = { ...prevState };
            return merge(newState, {
                loggedIn,
                name,
                host,
                admin,
                read,
                cert,
            });
        });
    };

    const changeAccount = (account: number) => {
        const newAccount = localStorage.getItem(`auth${account}-name`);

        if (!newAccount) return;

        const { name, host, admin, read, cert } = getAuthParams(newAccount);
        sessionStorage.removeItem('session');

        updateAccount((prevState: any) => {
            const newState = { ...prevState };
            return merge(newState, {
                name,
                host,
                admin,
                read,
                cert,
            });
        });
    };

    const refreshAccount = () => {
        const activeAccount = localStorage.getItem('account') || 'auth1';
        const sessionAdmin = sessionStorage.getItem('session') || '';
        const { name, host, admin, read, cert } = getAuthParams(activeAccount);
        const readMacaroon = read ? read : sessionAdmin;
        const loggedIn = host !== '' && readMacaroon !== '';

        console.log('REFRESHING', readMacaroon);

        updateAccount((prevState: any) => {
            const newState = { ...prevState };
            return merge(newState, {
                loggedIn,
                name,
                host,
                admin,
                sessionAdmin,
                read: readMacaroon,
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
        read: readMacaroon,
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
