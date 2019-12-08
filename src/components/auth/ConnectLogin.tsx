import React, { useState, useContext } from 'react';
import { Input, SingleLine, Sub4Title } from '../../components/generic/Styled';
import { AccountContext } from '../../context/AccountContext';
import {
    getAuthLnd,
    getBase64CertfromDerFormat,
    saveUserAuth,
} from '../../utils/auth';
import { LoginButton, PasswordInput } from './Password';
import CryptoJS from 'crypto-js';

export const ConnectLoginForm = ({ available }: { available?: number }) => {
    const { setAccount } = useContext(AccountContext);

    const [isName, setName] = useState('');
    const [isUrl, setUrl] = useState('');

    const [hasInfo, setHasInfo] = useState(false);
    const [isPass, setPass] = useState('');

    if (!available) return null;

    const canConnect = isUrl !== '' && !!available;

    const handleConnect = () => {
        const { cert, macaroon, socket } = getAuthLnd(isUrl);

        const base64Cert = getBase64CertfromDerFormat(cert) || '';

        const encryptedAdmin = CryptoJS.AES.encrypt(
            macaroon,
            isPass,
        ).toString();

        console.log(encryptedAdmin);

        saveUserAuth({
            available,
            name: isName,
            host: socket,
            admin: encryptedAdmin,
            cert: base64Cert,
        });

        sessionStorage.setItem('session', macaroon);

        setAccount({
            loggedIn: true,
            host: socket,
            admin: encryptedAdmin,
            read: macaroon,
            cert: base64Cert,
        });
    };

    const renderContent = () => (
        <>
            <SingleLine>
                <Sub4Title>Name:</Sub4Title>
                <Input onChange={e => setName(e.target.value)} />
            </SingleLine>
            <SingleLine>
                <Sub4Title>LN Connect Url:</Sub4Title>
                <Input onChange={e => setUrl(e.target.value)} />
            </SingleLine>
            {canConnect && (
                <LoginButton
                    disabled={!canConnect}
                    enabled={canConnect}
                    onClick={() => setHasInfo(true)}
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
