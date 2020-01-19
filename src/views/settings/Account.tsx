import React, { useState } from 'react';
import {
    CardWithTitle,
    SubTitle,
    Card,
    SubCard,
    SingleLine,
} from '../../components/generic/Styled';
import { LoginForm } from '../../components/auth/NormalLogin';
import { ConnectLoginForm } from '../../components/auth/ConnectLogin';
import { BTCLoginForm } from '../../components/auth/BTCLogin';
import { SettingsLine, ButtonRow } from './Settings';
import { useAccount } from '../../context/AccountContext';
import styled from 'styled-components';
import { getNextAvailable, getStorageSaved } from '../../utils/storage';
import { useSettings } from '../../context/SettingsContext';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { XSvg } from '../../components/generic/Icons';

const RightAlign = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

export const AccountSettings = () => {
    const { theme } = useSettings();
    const { name } = useAccount();

    const [isType, setIsType] = useState('none');
    const [willAdd, setWillAdd] = useState(false);
    const { changeAccount, refreshAccount } = useAccount();

    const next = getNextAvailable();

    const handleConnected = () => {
        setIsType('none');
        setWillAdd(false);
    };

    const renderButtons = () => (
        <SingleLine>
            {willAdd && (
                <RightAlign>
                    <ColorButton onClick={() => setIsType('login')}>
                        Connection Details
                    </ColorButton>
                    <ColorButton onClick={() => setIsType('connect')}>
                        LndConnect Url
                    </ColorButton>
                    <ColorButton onClick={() => setIsType('btcpay')}>
                        BTCPayServer Info
                    </ColorButton>
                </RightAlign>
            )}
            <ColorButton
                onClick={() => {
                    if (willAdd) {
                        setIsType('none');
                    }
                    setWillAdd(prev => !prev);
                }}
            >
                {willAdd ? <XSvg /> : 'Add New Account'}
            </ColorButton>
        </SingleLine>
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
                                <ColorButton
                                    selected={
                                        name.localeCompare(entry.name) === 0
                                    }
                                    withMargin={'0 0 0 8px'}
                                    onClick={() => {
                                        localStorage.setItem(
                                            'account',
                                            `auth${entry.index}`,
                                        );
                                        changeAccount(entry.index);
                                        refreshAccount();
                                    }}
                                >
                                    {entry.name}
                                </ColorButton>
                            );
                        })}
                    </ButtonRow>
                </SettingsLine>
                {next && (
                    <SettingsLine>
                        <SubTitle>Add Account</SubTitle>
                        {renderButtons()}
                    </SettingsLine>
                )}
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
