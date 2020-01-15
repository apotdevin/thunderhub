import React, { useState, useEffect } from 'react';
import { Input, SingleLine, Sub4Title } from '../../components/generic/Styled';
import { useAccount } from '../../context/AccountContext';
import { getConfigLnd, saveUserAuth, getAuthString } from '../../utils/auth';
import CryptoJS from 'crypto-js';
import { LoginButton, PasswordInput } from './Password';
import { toast } from 'react-toastify';
import { useLazyQuery } from '@apollo/react-hooks';
import { GET_CAN_CONNECT } from '../../graphql/query';
import { getErrorContent } from '../../utils/error';
import { useHistory } from 'react-router-dom';

interface AuthProps {
    available: number;
    callback?: () => void;
    withRedirect?: boolean;
}

export const BTCLoginForm = ({
    available,
    callback,
    withRedirect,
}: AuthProps) => {
    const { setAccount } = useAccount();
    const { push } = useHistory();

    const [isName, setName] = useState('');
    const [isJson, setJson] = useState('');

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
            const { cert, macaroon, readMacaroon, host } = getConfigLnd(isJson);

            if (!host) {
                toast.error('Invalid connection credentials');
                return;
            }

            const encryptedAdmin =
                macaroon && isPass !== ''
                    ? CryptoJS.AES.encrypt(macaroon, isPass).toString()
                    : undefined;

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

            toast.success('Connected!');
            callback && callback();
            withRedirect && push('/');
        }
    }, [
        data,
        loading,
        available,
        callback,
        isJson,
        isName,
        isPass,
        setAccount,
        withRedirect,
        push,
    ]);

    const handleClick = () => {
        try {
            JSON.parse(isJson);
            setHasInfo(true);
        } catch (error) {
            toast.error('Invalid JSON Object');
        }
    };

    const handleConnect = () => {
        const { cert, readMacaroon, host } = getConfigLnd(isJson);

        if (!host) {
            toast.error('Invalid connection credentials');
            return;
        }

        tryToConnect({
            variables: { auth: getAuthString(host, readMacaroon, cert) },
        });
    };

    const renderContent = () => {
        const canConnect = isJson !== '' && !!available;
        return (
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
