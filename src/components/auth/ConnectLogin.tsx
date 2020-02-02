import React, { useState, useEffect } from 'react';
import { useAccount } from '../../context/AccountContext';
import {
    getAuthLnd,
    getBase64CertfromDerFormat,
    saveUserAuth,
    getAuthString,
    saveSessionAuth,
} from '../../utils/auth';
import { PasswordInput } from './Password';
import CryptoJS from 'crypto-js';
import { useLazyQuery } from '@apollo/react-hooks';
import { GET_CAN_CONNECT } from '../../graphql/query';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import { useHistory } from 'react-router-dom';
import { ColorButton } from '../buttons/colorButton/ColorButton';
import { Input } from 'components/input/Input';
import { Line, StyledTitle } from './Auth.styled';
import { ChevronLeft } from 'components/generic/Icons';

interface AuthProps {
    available: number;
    withRedirect?: boolean;
    callback?: () => void;
    goBack?: () => void;
}

export const ConnectLoginForm = ({
    available,
    callback,
    withRedirect,
    goBack,
}: AuthProps) => {
    const { setAccount } = useAccount();
    const { push } = useHistory();

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

            saveSessionAuth(macaroon);

            setAccount({
                loggedIn: true,
                host: socket,
                admin: encryptedAdmin,
                sessionAdmin: macaroon,
                read: macaroon,
                cert: base64Cert,
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
        isName,
        isPass,
        isUrl,
        setAccount,
        withRedirect,
        push,
    ]);

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
                {goBack && (
                    <ColorButton onClick={goBack}>
                        <ChevronLeft />
                    </ColorButton>
                )}
                <Line>
                    <StyledTitle>Name:</StyledTitle>
                    <Input onChange={e => setName(e.target.value)} />
                </Line>
                <Line>
                    <StyledTitle>LND Connect Url:</StyledTitle>
                    <Input onChange={e => setUrl(e.target.value)} />
                </Line>
                {canConnect && (
                    <ColorButton
                        disabled={!canConnect}
                        onClick={() => setHasInfo(true)}
                        withMargin={'16px 0 0'}
                        fullWidth={true}
                        arrow={true}
                    >
                        Connect
                    </ColorButton>
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
