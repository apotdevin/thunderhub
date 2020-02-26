import React, { useState } from 'react';
import { getNextAvailable } from 'utils/storage';
import { LoginForm } from './views/NormalLogin';
import { ConnectLoginForm } from './views/ConnectLogin';
import { BTCLoginForm } from './views/BTCLogin';
import { QRLogin } from './views/QRLogin';
import { ViewCheck } from './checks/ViewCheck';
import CryptoJS from 'crypto-js';
import { useAccount } from 'context/AccountContext';
import { useHistory } from 'react-router-dom';
import { saveUserAuth } from 'utils/auth';
import { PasswordInput } from './views/Password';
import { useConnectionDispatch } from 'context/ConnectionContext';
import { useStatusDispatch } from 'context/StatusContext';

type AuthProps = {
    type: string;
    status: string;
    callback: () => void;
    setStatus: (state: string) => void;
};

export const Auth = ({ type, status, callback, setStatus }: AuthProps) => {
    const next = getNextAvailable();

    const { changeAccount } = useAccount();
    const { push } = useHistory();

    const dispatch = useConnectionDispatch();
    const dispatchState = useStatusDispatch();

    const [name, setName] = useState();
    const [host, setHost] = useState();
    const [admin, setAdmin] = useState();
    const [viewOnly, setViewOnly] = useState();
    const [cert, setCert] = useState();
    const [password, setPassword] = useState();

    const [adminChecked, setAdminChecked] = useState(false);

    const handleSet = ({
        name,
        host,
        admin,
        viewOnly,
        cert,
        skipCheck,
    }: {
        name?: string;
        host?: string;
        admin?: string;
        viewOnly?: string;
        cert?: string;
        skipCheck?: boolean;
    }) => {
        if (skipCheck) {
            quickSave({ name, cert, admin, viewOnly, host });
        } else {
            name && setName(name);
            host && setHost(host);
            admin && setAdmin(admin);
            viewOnly && setViewOnly(viewOnly);
            cert && setCert(cert);

            setStatus('confirmNode');
        }
    };

    const quickSave = ({
        name,
        host,
        admin,
        viewOnly,
        cert,
    }: {
        name?: string;
        host?: string;
        admin?: string;
        viewOnly?: string;
        cert?: string;
    }) => {
        saveUserAuth({
            available: next,
            name,
            host: host || '',
            admin,
            viewOnly,
            cert,
        });

        dispatch({ type: 'disconnected' });
        dispatchState({ type: 'disconnected' });
        changeAccount(next);

        push('/');
    };

    const handleSave = () => {
        const encryptedAdmin =
            admin && password
                ? CryptoJS.AES.encrypt(admin, password).toString()
                : undefined;

        saveUserAuth({
            available: next,
            name,
            host,
            admin: encryptedAdmin,
            viewOnly,
            cert,
        });

        dispatch({ type: 'disconnected' });
        dispatchState({ type: 'disconnected' });
        changeAccount(next);

        push('/');
    };

    const handleConnect = () => {
        if (adminChecked) {
            setStatus('password');
        } else {
            handleSave();
        }
    };

    const renderView = () => {
        switch (type) {
            case 'login':
                return <LoginForm handleSet={handleSet} />;
            case 'qrcode':
                return <QRLogin handleSet={handleSet} />;
            case 'connect':
                return <ConnectLoginForm handleSet={handleSet} />;
            default:
                return <BTCLoginForm handleSet={handleSet} />;
        }
    };

    return (
        <>
            {status === 'none' && renderView()}
            {status === 'confirmNode' && (
                <ViewCheck
                    host={host}
                    admin={admin}
                    viewOnly={viewOnly}
                    cert={cert}
                    adminChecked={adminChecked}
                    setAdminChecked={setAdminChecked}
                    handleConnect={handleConnect}
                    callback={callback}
                />
            )}
            {status === 'password' && (
                <PasswordInput
                    isPass={password}
                    setPass={setPassword}
                    callback={handleSave}
                    loading={false}
                />
            )}
        </>
    );
};
