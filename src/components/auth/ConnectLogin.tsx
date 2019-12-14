import React, { useState, useEffect } from 'react';
import { Input, SingleLine, Sub4Title } from '../../components/generic/Styled';
import { useAccount } from '../../context/AccountContext';
import {
    getAuthLnd,
    getBase64CertfromDerFormat,
    saveUserAuth,
    getAuthString,
} from '../../utils/auth';
import { LoginButton, PasswordInput } from './Password';
import CryptoJS from 'crypto-js';
import { useLazyQuery } from '@apollo/react-hooks';
import { GET_CAN_CONNECT } from '../../graphql/query';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';

interface AuthProps {
    available: number;
    callback?: () => void;
}

export const ConnectLoginForm = ({ available, callback }: AuthProps) => {
    const { setAccount } = useAccount();

    const [isName, setName] = useState('');
    const [isUrl, setUrl] = useState('');

    const [hasInfo, setHasInfo] = useState(false);
    const [isPass, setPass] = useState('');

    const [tryToConnect, { data, loading }] = useLazyQuery(GET_CAN_CONNECT, {
        onError: error => {
            setHasInfo(false);
            toast.error(getErrorContent(error));
        },
    });

    useEffect(() => {
        if (!loading && data && data.getNodeInfo && data.getNodeInfo.alias) {
            const { cert, macaroon, socket } = getAuthLnd(isUrl);

            const base64Cert = getBase64CertfromDerFormat(cert) || '';

            const encryptedAdmin = CryptoJS.AES.encrypt(
                macaroon,
                isPass,
            ).toString();

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

            toast.success('Connected!');
            callback && callback();
        }
    }, [data, loading, available, callback, isName, isPass, isUrl, setAccount]);

    const handleConnect = () => {
        const { cert, macaroon, socket } = getAuthLnd(isUrl);

        const base64Cert = getBase64CertfromDerFormat(cert) || '';

        tryToConnect({
            variables: { auth: getAuthString(socket, macaroon, base64Cert) },
        });
    };

    const renderContent = () => {
        const canConnect = isUrl !== '' && !!available;
        return (
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
