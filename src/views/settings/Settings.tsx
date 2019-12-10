import React, { useContext, useState } from 'react';
import {
    Card,
    CardWithTitle,
    SubTitle,
    SingleLine,
    SimpleButton,
    ColorButton,
    SubCard,
} from '../../components/generic/Styled';
import {
    getStorageSaved,
    getNextAvailable,
    deleteStorage,
} from '../../utils/storage';
import { AccountContext } from '../../context/AccountContext';
import { LoginForm } from '../../components/auth/NormalLogin';
import { ConnectLoginForm } from '../../components/auth/ConnectLogin';
import styled from 'styled-components';
import { BTCLoginForm } from '../../components/auth/BTCLogin';
import { InterfaceSettings } from './Interface';
import { deleteAuth } from '../../utils/auth';
import { textColor } from '../../styles/Themes';

export const ButtonRow = styled.div`
    width: auto;
    display: flex;
`;

const ConnectButton = styled(ColorButton)`
    width: 100%;
    padding: 30px;
    margin: 30px 0;
    font-size: 14px;
`;

const OutlineCard = styled(Card)`
    &:hover {
        border: 1px solid red;
    }
`;

export const SettingsLine = styled(SingleLine)`
    margin: 10px 0;
`;

export const SettingsButton = styled(SimpleButton)`
    padding: 10px;

    &:hover {
        border: 1px solid ${textColor};
    }
`;

export const SettingsView = () => {
    const [isType, setIsType] = useState('none');
    const [willAdd, setWillAdd] = useState(false);
    const { changeAccount, refreshAccount } = useContext(AccountContext);

    const next = getNextAvailable();

    const currentAuth = localStorage.getItem('account') || 'auth1';

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

    const handleConnected = () => {
        setIsType('none');
        setWillAdd(false);
    };

    return (
        <>
            <InterfaceSettings />
            <CardWithTitle>
                <SubTitle>Account</SubTitle>
                <Card>
                    <SettingsLine>
                        Change Account
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
                            Add Account
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
            <CardWithTitle>
                <SubTitle>Danger Zone</SubTitle>
                <OutlineCard>
                    <SettingsLine>
                        Delete Account:
                        <ButtonRow>
                            {getStorageSaved().map((entry, index) => {
                                return (
                                    <SettingsButton
                                        onClick={() => {
                                            deleteAuth(entry.index);
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
                    <SettingsLine>
                        Delete all Accounts and Settings:
                        <ButtonRow>
                            <SettingsButton
                                onClick={() => {
                                    deleteStorage();
                                    refreshAccount();
                                }}
                            >
                                Delete All
                            </SettingsButton>
                        </ButtonRow>
                    </SettingsLine>
                </OutlineCard>
            </CardWithTitle>
        </>
    );
};
