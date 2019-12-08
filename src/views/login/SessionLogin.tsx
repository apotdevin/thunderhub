import React, { useContext, useState } from 'react';
import { AccountContext } from '../../context/AccountContext';
import {
    SingleLine,
    Sub4Title,
    Input,
    CardWithTitle,
    Card,
    SubTitle,
} from '../../components/generic/Styled';
import styled from 'styled-components';
import { LoginButton } from '../../components/auth/Password';
import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';

const Login = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
`;

export const SessionLogin = () => {
    const { admin, refreshAccount } = useContext(AccountContext);
    const [pass, setPass] = useState('');

    const handleClick = () => {
        try {
            const bytes = CryptoJS.AES.decrypt(admin, pass);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);

            sessionStorage.setItem('session', decrypted);
            refreshAccount();
        } catch (error) {
            toast.error('Wrong Password');
        }
    };

    return (
        <Login>
            <h1>Welcome to ThunderHub</h1>
            <CardWithTitle>
                <SubTitle>Please Login:</SubTitle>
                <Card>
                    <SingleLine>
                        <Sub4Title>Password:</Sub4Title>
                        <Input onChange={e => setPass(e.target.value)} />
                    </SingleLine>
                    {pass !== '' && (
                        <LoginButton
                            disabled={pass === ''}
                            enabled={pass !== ''}
                            onClick={handleClick}
                            color={'yellow'}
                        >
                            Connect
                        </LoginButton>
                    )}
                </Card>
            </CardWithTitle>
        </Login>
    );
};
