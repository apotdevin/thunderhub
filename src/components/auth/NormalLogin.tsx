import React, { useState, useEffect } from 'react';
import { Input, SingleLine, Sub4Title } from '../generic/Styled';
import { useAccount } from '../../context/AccountContext';
import { saveUserAuth, getAuthString } from '../../utils/auth';
import CryptoJS from 'crypto-js';
import base64url from 'base64url';
import { PasswordInput, LoginButton } from './Password';
import { useLazyQuery } from '@apollo/react-hooks';
import { GET_CAN_CONNECT } from '../../graphql/query';
import { getErrorContent } from '../../utils/error';
import { toast } from 'react-toastify';

interface AuthProps {
    available: number;
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

    const [tryToConnect, { data, loading }] = useLazyQuery(GET_CAN_CONNECT, {
        onError: error => toast.error(getErrorContent(error)),
    });

    const handleClick = () => {
        if (isAdmin !== '') {
            setHasInfo(true);
        } else {
            handleConnect();
        }
    };

    useEffect(() => {
        if (!loading && data && data.getNodeInfo && data.getNodeInfo.alias) {
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

            toast.success('Connected!');
            callback && callback();
        }
    }, [
        data,
        loading,
        available,
        callback,
        isAdmin,
        isCert,
        isHost,
        isName,
        isPass,
        isRead,
        setAccount,
    ]);

    const handleConnect = () => {
        const admin = base64url.fromBase64(isAdmin);
        const read = base64url.fromBase64(isRead);
        const cert = base64url.fromBase64(isCert);

        const correctMacaroon = read ? read : admin;

        tryToConnect({
            variables: {
                auth: getAuthString(isHost, correctMacaroon, cert),
            },
        });
    };

    const renderContent = () => {
        const canConnect =
            isName !== '' && isHost !== '' && isRead !== '' && !!available;
        return (
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
    };

    return hasInfo ? (
        <PasswordInput
            isPass={isPass}
            setPass={setPass}
            callback={handleConnect}
            loading={loading}
        />
    ) : (
        renderContent()
    );
};
