import React, { useState } from 'react';
import {
    CardWithTitle,
    SubTitle,
    Card,
    SubCard,
    ColorButton,
} from '../../components/generic/Styled';
import { LoginForm } from '../../components/auth/NormalLogin';
import { ConnectLoginForm } from '../../components/auth/ConnectLogin';
import { BTCLoginForm } from '../../components/auth/BTCLogin';
import { SettingsLine, SettingsButton, ButtonRow } from './Settings';
import { useAccount } from '../../context/AccountContext';
import styled from 'styled-components';
import { getNextAvailable, getStorageSaved } from '../../utils/storage';

const ConnectButton = styled(ColorButton)`
    width: 100%;
    padding: 30px;
    margin: 30px 0;
    font-size: 14px;
`;

export const AccountSettings = () => {
    const [isType, setIsType] = useState('none');
    const [willAdd, setWillAdd] = useState(false);
    const { changeAccount, refreshAccount } = useAccount();

    const next = getNextAvailable();

    const currentAuth = localStorage.getItem('account') || 'auth1';

    const handleConnected = () => {
        setIsType('none');
        setWillAdd(false);
    };

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
        <CardWithTitle>
            <SubTitle>Account</SubTitle>
            <Card>
                <SettingsLine>
                    <SubTitle>Change Account</SubTitle>
                    <ButtonRow>
                        {getStorageSaved().map((entry, index) => {
                            return (
                                <SettingsButton
                                    enabled={
                                        currentAuth === `auth${entry.index}`
                                    }
                                    onClick={() => {
                                        localStorage.setItem(
                                            'account',
                                            `auth${entry.index}`,
                                        );
                                        changeAccount(entry.index);
                                        refreshAccount();
                                    }}
                                    key={index}
                                >
                                    {entry.name}
                                </SettingsButton>
                            );
                        })}
                    </ButtonRow>
                </SettingsLine>
                {next && (
                    <SettingsLine>
                        <SubTitle>Add Account</SubTitle>
                        <SettingsButton
                            onClick={() => {
                                if (willAdd) {
                                    setIsType('none');
                                }
                                setWillAdd(prev => !prev);
                            }}
                        >
                            {willAdd ? 'Cancel' : 'Add New Account'}
                        </SettingsButton>
                    </SettingsLine>
                )}
                {isType === 'none' && willAdd && renderButtons()}
                {willAdd && (
                    <>
                        {isType === 'login' && (
                            <SubCard padding={'30px 50px'}>
                                <LoginForm
                                    available={next}
                                    callback={handleConnected}
                                />
                            </SubCard>
                        )}
                        {isType === 'connect' && (
                            <SubCard padding={'30px 50px'}>
                                <ConnectLoginForm
                                    available={next}
                                    callback={handleConnected}
                                />
                            </SubCard>
                        )}
                        {isType === 'btcpay' && (
                            <SubCard padding={'30px 50px'}>
                                <BTCLoginForm
                                    available={next}
                                    callback={handleConnected}
                                />
                            </SubCard>
                        )}
                    </>
                )}
            </Card>
        </CardWithTitle>
    );
};
