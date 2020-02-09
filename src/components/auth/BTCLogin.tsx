import React, { useState, useEffect } from 'react';
import { useAccount } from '../../context/AccountContext';
import { getConfigLnd, saveUserAuth, getAuthString } from '../../utils/auth';
import CryptoJS from 'crypto-js';
import { PasswordInput } from './Password';
import { toast } from 'react-toastify';
import { useLazyQuery } from '@apollo/react-hooks';
import { GET_CAN_CONNECT } from '../../graphql/query';
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

export const BTCLoginForm = ({
    available,
    callback,
    withRedirect,
    goBack,
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
                    <StyledTitle>BTCPayServer Connect JSON:</StyledTitle>
                    <Input onChange={e => setJson(e.target.value)} />
                </Line>
                {canConnect && (
                    <ColorButton
                        disabled={!canConnect}
                        onClick={handleClick}
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
