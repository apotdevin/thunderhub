import React, { useState, useContext } from 'react';
import {
    Input,
    SingleLine,
    Sub4Title,
    SimpleButton,
} from '../../components/generic/Styled';
import { AccountContext } from '../../context/AccountContext';
import { buildAuthString, getAuthLnd } from '../../utils/auth';

export const ConnectLoginForm = ({ available }: { available: number }) => {
    const { setAccount } = useContext(AccountContext);

    const [isName, setName] = useState('');
    const [isUrl, setUrl] = useState('');

    const canConnect = isUrl !== '' && !!available;

    const handleConnect = () => {
        const { cert, macaroon, socket } = getAuthLnd(isUrl);

        const authString = buildAuthString(
            isName,
            socket,
            macaroon,
            macaroon,
            cert,
        );

        localStorage.setItem(`auth${available}`, authString);

        setAccount({
            loggedIn: true,
            host: socket,
            admin: macaroon,
            read: macaroon,
            cert,
        });
    };

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
            <SimpleButton
                disabled={!canConnect}
                enabled={canConnect}
                onClick={handleConnect}
            >
                Connect
            </SimpleButton>
        </>
    );
};
