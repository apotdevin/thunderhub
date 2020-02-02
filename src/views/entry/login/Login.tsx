import React, { useState } from 'react';
import { Card } from '../../../components/generic/Styled';
import styled from 'styled-components';
import { LoginForm } from '../../../components/auth/NormalLogin';
import { ConnectLoginForm } from '../../../components/auth/ConnectLogin';
import { getNextAvailable } from '../../../utils/storage';
import { BTCLoginForm } from '../../../components/auth/BTCLogin';
import { Section } from 'components/section/Section';
import {
    MultiButton,
    SingleButton,
} from 'components/buttons/multiButton/MultiButton';

const ConnectTitle = styled.h1`
    width: 100%;
    text-align: center;
`;

export const LoginView = () => {
    const [isType, setIsType] = useState('login');
    const next = getNextAvailable();

    const renderButtons = () => (
        <>
            <MultiButton margin={'16px 0'}>
                <SingleButton
                    selected={isType === 'login'}
                    onClick={() => setIsType('login')}
                >
                    Details
                </SingleButton>
                <SingleButton
                    selected={isType === 'connect'}
                    onClick={() => setIsType('connect')}
                >
                    LndConnect
                </SingleButton>
                <SingleButton
                    selected={isType === 'btcpay'}
                    onClick={() => setIsType('btcpay')}
                >
                    BTCPayServer
                </SingleButton>
            </MultiButton>
        </>
    );
    return (
        <Section padding={'0 0 60px'}>
            <ConnectTitle>{'How do you want to connect?'}</ConnectTitle>
            <Card bottom={'0'}>
                {renderButtons()}
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
