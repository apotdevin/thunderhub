import React, { useState } from 'react';
import {
    Card,
    SubTitle,
    ColorButton,
} from '../../../components/generic/Styled';
import styled from 'styled-components';
import { LoginForm } from '../../../components/auth/NormalLogin';
import { ConnectLoginForm } from '../../../components/auth/ConnectLogin';
import { getNextAvailable } from '../../../utils/storage';
import { BTCLoginForm } from '../../../components/auth/BTCLogin';
import { useSettings } from '../../../context/SettingsContext';
import { textColorMap } from '../../../styles/Themes';
import { Section } from 'components/section/Section';

const ConnectButton = styled(ColorButton)`
    width: 100%;
    padding: 30px;
    margin: 30px 0;
    font-size: 14px;
`;

export const LoginView = () => {
    const { theme } = useSettings();
    const [isType, setIsType] = useState('none');
    const next = getNextAvailable();

    const renderButtons = () => (
        <>
            <ConnectButton
                color={textColorMap[theme]}
                onClick={() => setIsType('login')}
            >
                <SubTitle>CONNECTION DETAILS</SubTitle>
            </ConnectButton>
            <ConnectButton
                color={textColorMap[theme]}
                onClick={() => setIsType('connect')}
            >
                <SubTitle>LNDCONNECT URL</SubTitle>
            </ConnectButton>
            <ConnectButton
                color={textColorMap[theme]}
                onClick={() => setIsType('btcpay')}
            >
                <SubTitle>BTCPAYSERVER INFO</SubTitle>
            </ConnectButton>
        </>
    );
    return (
        <Section padding={'48px 0 60px'}>
            <Card padding={'50px 100px'} bottom={'0'}>
                {isType === 'none' && (
                    <SubTitle> How do you want to connect?</SubTitle>
                )}
                {isType === 'none' && renderButtons()}
                {isType === 'login' && (
                    <LoginForm available={next} withRedirect={true} />
                )}
                {isType === 'connect' && (
                    <ConnectLoginForm available={next} withRedirect={true} />
                )}
                {isType === 'btcpay' && (
                    <BTCLoginForm available={next} withRedirect={true} />
                )}
            </Card>
        </Section>
    );
};
