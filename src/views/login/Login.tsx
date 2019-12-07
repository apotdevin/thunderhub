import React from 'react';
import { Card, SubTitle } from '../../components/generic/Styled';
import styled from 'styled-components';
import { LoginForm } from '../../components/auth/NormalLogin';
import { ConnectLoginForm } from '../../components/auth/ConnectLogin';
import { getNextAvailable } from '../../utils/storage';
import { BTCLoginForm } from '../../components/auth/BTCLogin';

const Login = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
`;

export const LoginView = () => {
    const available = getNextAvailable();
    console.log(available);
    return (
        <Login>
            <h1>Welcome to ThunderHub</h1>
            <Card>
                <SubTitle> Login now:</SubTitle>
                <LoginForm available={available} />
                <ConnectLoginForm available={available} />
                <BTCLoginForm available={available} />
            </Card>
        </Login>
    );
};
