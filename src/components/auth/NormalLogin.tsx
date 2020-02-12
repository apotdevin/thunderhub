import React, { useState, useEffect } from 'react';
import { useAccount } from '../../context/AccountContext';
import { saveUserAuth, getAuthString, saveSessionAuth } from '../../utils/auth';
import CryptoJS from 'crypto-js';
import { PasswordInput } from './Password';
import { useLazyQuery } from '@apollo/react-hooks';
import { GET_CAN_CONNECT } from '../../graphql/query';
import { getErrorContent } from '../../utils/error';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { ColorButton } from '../buttons/colorButton/ColorButton';
import { Input } from 'components/input/Input';
import { Line, StyledTitle } from './Auth.styled';
import { SingleLine, Sub4Title } from 'components/generic/Styled';
import {
    MultiButton,
    SingleButton,
} from 'components/buttons/multiButton/MultiButton';
import { ChevronLeft } from 'components/generic/Icons';
import { RiskCheckboxAndConfirm } from './Checkboxes';

interface AuthProps {
    available: number;
    callback?: () => void;
    withRedirect?: boolean;
    goBack?: () => void;
}

export const LoginForm = ({
    available,
    callback,
    withRedirect,
    goBack,
}: AuthProps) => {
    const { setAccount } = useAccount();
    const { push } = useHistory();

    const [viewOnly, setViewOnly] = useState(true);
    const [checked, setChecked] = useState(false);

    const [isName, setName] = useState('');
    const [isHost, setHost] = useState('');
    const [isAdmin, setAdmin] = useState('');
    const [isRead, setRead] = useState('');
    const [isCert, setCert] = useState('');

    const [hasInfo, setHasInfo] = useState(false);
    const [isPass, setPass] = useState('');

    const [tryToConnect, { data, loading }] = useLazyQuery(GET_CAN_CONNECT, {
        onError: error => {
            setHasInfo(false);
            toast.error(getErrorContent(error));
        },
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
            const admin = isAdmin;
            const read = isRead;
            const cert = isCert;

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

            saveSessionAuth(admin);

            setAccount({
                loggedIn: true,
                name: isName,
                host: isHost,
                admin: encryptedAdmin,
                ...(read === '' && { sessionAdmin: admin }),
                read,
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
        isAdmin,
        isCert,
        isHost,
        isName,
        isPass,
        isRead,
        setAccount,
        withRedirect,
        push,
    ]);

    const handleConnect = () => {
        const admin = isAdmin;
        const read = isRead;
        const cert = isCert;

        const correctMacaroon = read ? read : admin;

        tryToConnect({
            variables: {
                auth: getAuthString(isHost, correctMacaroon, cert),
            },
        });
    };

    const renderContent = () => {
        const canConnect =
            isName !== '' &&
            isHost !== '' &&
            (isAdmin !== '' || isRead !== '') &&
            !!available &&
            checked;
        return (
            <>
                <SingleLine>
                    {goBack && (
                        <ColorButton onClick={goBack}>
                            <ChevronLeft />
                        </ColorButton>
                    )}
                    <Sub4Title>Type of Account:</Sub4Title>
                    <MultiButton>
                        <SingleButton
                            selected={viewOnly}
                            onClick={() => setViewOnly(true)}
                        >
                            ViewOnly
                        </SingleButton>
                        <SingleButton
                            selected={!viewOnly}
                            onClick={() => setViewOnly(false)}
                        >
                            Admin
                        </SingleButton>
                    </MultiButton>
                </SingleLine>
                <Line>
                    <StyledTitle>Name:</StyledTitle>
                    <Input
                        placeholder={'Name for this node'}
                        onChange={e => setName(e.target.value)}
                    />
                </Line>
                <Line>
                    <StyledTitle>Host:</StyledTitle>
                    <Input
                        placeholder={'Url and port (e.g.: www.node.com:443)'}
                        onChange={e => setHost(e.target.value)}
                    />
                </Line>
                {!viewOnly && (
                    <Line>
                        <StyledTitle>Admin:</StyledTitle>
                        <Input
                            placeholder={'Base64 or HEX Admin macaroon'}
                            onChange={e => setAdmin(e.target.value)}
                        />
                    </Line>
                )}
                <Line>
                    <StyledTitle>Readonly:</StyledTitle>
                    <Input
                        placeholder={'Base64 or HEX Readonly macaroon'}
                        onChange={e => setRead(e.target.value)}
                    />
                </Line>
                <Line>
                    <StyledTitle>Certificate:</StyledTitle>
                    <Input
                        placeholder={'Base64 or HEX TLS Certificate'}
                        onChange={e => setCert(e.target.value)}
                    />
                </Line>
                <RiskCheckboxAndConfirm
                    disabled={!canConnect}
                    handleClick={handleClick}
                    checked={checked}
                    onChange={setChecked}
                />
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
