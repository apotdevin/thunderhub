import React, { useState, useContext } from 'react';
import { Input, SingleLine, Sub4Title } from '../../components/generic/Styled';
import { AccountContext } from '../../context/AccountContext';
import { getConfigLnd, saveUserAuth } from '../../utils/auth';
import CryptoJS from 'crypto-js';
import { LoginButton, PasswordInput } from './Password';
import { toast } from 'react-toastify';

export const BTCLoginForm = ({ available }: { available: number }) => {
    const { setAccount } = useContext(AccountContext);

    const [isName, setName] = useState('');
    const [isJson, setJson] = useState('');

    const [hasInfo, setHasInfo] = useState(false);
    const [isPass, setPass] = useState('');

    const canConnect = isJson !== '' && !!available;

    const handleClick = () => {
        try {
            JSON.parse(isJson);
            setHasInfo(true);
        } catch (error) {
            toast.error('Invalid JSON Object');
        }
    };

    const handleConnect = () => {
        const { cert, macaroon, readMacaroon, host } = getConfigLnd(isJson);

        const encryptedAdmin =
            macaroon && isPass !== ''
                ? CryptoJS.AES.encrypt(macaroon, isPass).toString()
                : undefined;

        if (!host) {
            toast.error('Invalid connection credentials');
            return;
        }

        saveUserAuth({
            available,
            name: isName,
            host,
            admin: encryptedAdmin,
            read: readMacaroon,
            cert,
        });

        setAccount({
            loggedIn: true,
            host,
            admin: macaroon,
            read: readMacaroon,
            cert,
        });
    };

    const renderContent = () => (
        <>
            <SingleLine>
                <Sub4Title>Name:</Sub4Title>
                <Input onChange={e => setName(e.target.value)} />
            </SingleLine>
            <SingleLine>
                <Sub4Title>BTCPay Connect Url:</Sub4Title>
                <Input onChange={e => setJson(e.target.value)} />
            </SingleLine>
            {canConnect && (
                <LoginButton
                    disabled={!canConnect}
                    enabled={canConnect}
                    onClick={handleClick}
                    color={'yellow'}
                >
                    Connect
                </LoginButton>
            )}
        </>
    );

    return hasInfo ? (
        <PasswordInput
            isPass={isPass}
            setPass={setPass}
            callback={handleConnect}
        />
    ) : (
        renderContent()
    );
};
