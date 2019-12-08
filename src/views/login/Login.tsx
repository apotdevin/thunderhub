import React, { useState } from 'react';
import { Card, SubTitle, ColorButton } from '../../components/generic/Styled';
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

const ConnectButton = styled(ColorButton)`
    width: 100%;
    padding: 30px;
    margin: 30px 0;
    font-size: 14px;
`;

const Content = styled.div`
    margin: 30px 0 0;
`;

export const LoginView = () => {
    const [isType, setIsType] = useState('none');
    const next = getNextAvailable();

    const renderButtons = () => (
        <>
            <ConnectButton color={'blue'} onClick={() => setIsType('login')}>
                <SubTitle>CONNECTION DETAILS</SubTitle>
            </ConnectButton>
            <ConnectButton
                color={'yellow'}
                onClick={() => setIsType('connect')}
            >
                <SubTitle>LNDCONNECT URL</SubTitle>
            </ConnectButton>
            <ConnectButton color={'green'} onClick={() => setIsType('btcpay')}>
                <SubTitle>BTCPAYSERVER INFO</SubTitle>
            </ConnectButton>
        </>
    );
    return (
        <Login>
            <h1>Welcome to ThunderHub</h1>
            <Card padding={'50px 100px'}>
                <SubTitle> How do you want to connect?</SubTitle>
                {isType === 'none' && renderButtons()}
                <Content>
                    {isType === 'login' && <LoginForm available={next} />}
                    {isType === 'connect' && (
                        <ConnectLoginForm available={next} />
                    )}
                    {isType === 'btcpay' && <BTCLoginForm available={next} />}
                </Content>
            </Card>
        </Login>
    );
};
