import React, { createContext, useState } from 'react';
import merge from 'lodash.merge';
import { getAuthParams } from '../utils/auth';

interface ChangeProps {
    loggedIn?: boolean;
    name?: string;
    host?: string;
    admin?: string;
    read?: string;
    cert?: string;
}

interface AccountProps {
    loggedIn: boolean;
    name: string;
    host: string;
    admin: string;
    read: string;
    cert: string;
    // accountList: [];
    setAccount: (newProps: ChangeProps) => void;
    changeAccount: (account: number) => void;
    // addAccount: (account: number) => void;
    // deleteAccount: (account: number) => void;
}

export const AccountContext = createContext<AccountProps>({
    loggedIn: false,
    name: '',
    host: '',
    admin: '',
    read: '',
    cert: '',
    // accountList: [],
    setAccount: () => {},
    changeAccount: () => {},
    // addAccount: () => {},
    // deleteAccount: () => {}
});

const AccountProvider = ({ children }: any) => {
    const activeAccount = localStorage.getItem('account') || 'auth1';
    const auth = localStorage.getItem(activeAccount);

    const { name, host, admin, read, cert } = getAuthParams(auth);

    const loggedIn = host !== '' && admin !== '' && read !== '';

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
        const newAccount = localStorage.getItem(`auth${account}`);

        if (!newAccount) return;

        const { name, host, admin, read, cert } = getAuthParams(newAccount);
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

    const accountState = {
        loggedIn,
        name,
        host,
        admin,
        read,
        cert,
        setAccount,
        changeAccount,
    };

    const [settings, updateAccount] = useState(accountState);

    return (
        <AccountContext.Provider value={settings}>
            {children}
        </AccountContext.Provider>
    );
};

export default AccountProvider;
