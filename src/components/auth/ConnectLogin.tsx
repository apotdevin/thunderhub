import React, { useState } from 'react';
import { Input, SingleLine, Sub4Title } from '../../components/generic/Styled';
import { useAccount } from '../../context/AccountContext';
import {
    getAuthLnd,
    getBase64CertfromDerFormat,
    saveUserAuth,
} from '../../utils/auth';
import { LoginButton, PasswordInput } from './Password';
import CryptoJS from 'crypto-js';

interface AuthProps {
    available?: number;
    callback?: () => void;
}

export const ConnectLoginForm = ({ available, callback }: AuthProps) => {
    const { setAccount } = useAccount();

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

        callback && callback();
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
