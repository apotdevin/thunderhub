import React, { useState, useContext } from 'react';
import {
    Input,
    SingleLine,
    Sub4Title,
    SimpleButton,
} from '../../components/generic/Styled';
import { AccountContext } from '../../context/AccountContext';
import { buildAuthString, getConfigLnd } from '../../utils/auth';
import CryptoJS from 'crypto-js';

export const BTCLoginForm = ({ available }: { available: number }) => {
    const { setAccount } = useContext(AccountContext);

    const [isName, setName] = useState('');
    const [isUrl, setUrl] = useState('');

    const canConnect = isUrl !== '' && !!available;

    const testPassword = 'Test Password!';

    const handleConnect = () => {
        console.log(JSON.parse(isUrl));

        const { cert, macaroon, readMacaroon, host } = getConfigLnd(isUrl);

        const encryptedAdmin = CryptoJS.AES.encrypt(
            macaroon,
            testPassword,
        ).toString();
        const authString = buildAuthString(
            isName,
            host,
            encryptedAdmin,
            readMacaroon,
            cert,
        );

        localStorage.setItem(`auth${available}`, authString);

        setAccount({
            loggedIn: true,
            host,
            admin: macaroon,
            read: readMacaroon,
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
                <Sub4Title>BTCPay Connect Url:</Sub4Title>
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
