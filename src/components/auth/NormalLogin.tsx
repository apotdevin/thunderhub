import React, { useState } from 'react';
import { Input, SingleLine, Sub4Title } from '../generic/Styled';
import { useAccount } from '../../context/AccountContext';
import { saveUserAuth } from '../../utils/auth';
import CryptoJS from 'crypto-js';
import base64url from 'base64url';
import { PasswordInput, LoginButton } from './Password';

interface AuthProps {
    available?: number;
    callback?: () => void;
}

export const LoginForm = ({ available, callback }: AuthProps) => {
    const { setAccount } = useAccount();

    const [isName, setName] = useState('');
    const [isHost, setHost] = useState('');
    const [isAdmin, setAdmin] = useState('');
    const [isRead, setRead] = useState('');
    const [isCert, setCert] = useState('');

    const [hasInfo, setHasInfo] = useState(false);
    const [isPass, setPass] = useState('');

    if (!available) return null;

    const canConnect =
        isName !== '' && isHost !== '' && isRead !== '' && !!available;

    const handleClick = () => {
        if (isAdmin !== '') {
            setHasInfo(true);
        } else {
            handleConnect();
        }
    };

    const handleConnect = () => {
        const admin = base64url.fromBase64(isAdmin);
        const read = base64url.fromBase64(isRead);
        const cert = base64url.fromBase64(isCert);

        const encryptedAdmin =
            admin && isPass !== ''
                ? CryptoJS.AES.encrypt(admin, isPass).toString()
                : undefined;

        saveUserAuth({
            available,
            name: isName,
            host: isHost,
            admin: encryptedAdmin,
            read,
            cert,
        });

        setAccount({
            loggedIn: true,
            host: isHost,
            admin: encryptedAdmin,
            read,
            cert,
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
                <Sub4Title>Host:</Sub4Title>
                <Input onChange={e => setHost(e.target.value)} />
            </SingleLine>
            <SingleLine>
                <Sub4Title>Admin:</Sub4Title>
                <Input onChange={e => setAdmin(e.target.value)} />
            </SingleLine>
            <SingleLine>
                <Sub4Title>Readonly:</Sub4Title>
                <Input onChange={e => setRead(e.target.value)} />
            </SingleLine>
            <SingleLine>
                <Sub4Title>Certificate:</Sub4Title>
                <Input onChange={e => setCert(e.target.value)} />
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
