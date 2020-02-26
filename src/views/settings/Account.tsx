import React, { useState } from 'react';
import {
    CardWithTitle,
    SubTitle,
    Card,
    SingleLine,
    Sub4Title,
    Separation,
} from '../../components/generic/Styled';
import { SettingsLine } from './Settings';
import { useAccount } from '../../context/AccountContext';
import { getNextAvailable, getStorageSaved } from '../../utils/storage';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { XSvg } from '../../components/generic/Icons';
import {
    MultiButton,
    SingleButton,
} from 'components/buttons/multiButton/MultiButton';
import { useHistory } from 'react-router-dom';
import { useConnectionDispatch } from 'context/ConnectionContext';
import { useStatusDispatch } from 'context/StatusContext';
import { Auth } from 'components/auth';

export const AccountSettings = () => {
    const [status, setStatus] = useState('none');

    const { push } = useHistory();
    const { name, changeAccount } = useAccount();

    const dispatch = useConnectionDispatch();
    const dispatchState = useStatusDispatch();

    const [isType, setIsType] = useState('login');
    const [willAdd, setWillAdd] = useState(false);

    const next = getNextAvailable();

    const renderButtons = () => (
        <SingleLine>
            <Sub4Title>Connection Type:</Sub4Title>
            <MultiButton margin={'0 0 16px'}>
                <SingleButton
                    selected={isType === 'login'}
                    onClick={() => setIsType('login')}
                >
                    Connection Details
                </SingleButton>
                <SingleButton
                    selected={isType === 'connect'}
                    onClick={() => setIsType('connect')}
                >
                    LndConnect Url
                </SingleButton>
                <SingleButton
                    selected={isType === 'btcpay'}
                    onClick={() => setIsType('btcpay')}
                >
                    BTCPayServer Info
                </SingleButton>
                <SingleButton
                    selected={isType === 'qrcode'}
                    onClick={() => setIsType('qrcode')}
                >
                    QR Code
                </SingleButton>
            </MultiButton>
        </SingleLine>
    );

    return (
        <CardWithTitle>
            <SubTitle>Account</SubTitle>
            <Card>
                <SettingsLine>
                    <Sub4Title>Change Account</Sub4Title>
                    <MultiButton>
                        {getStorageSaved().map((entry, index) => {
                            return (
                                <SingleButton
                                    key={index}
                                    selected={
                                        name.localeCompare(entry.name) === 0
                                    }
                                    onClick={() => {
                                        if (
                                            name.localeCompare(entry.name) !== 0
                                        ) {
                                            dispatch({ type: 'disconnected' });
                                            dispatchState({
                                                type: 'disconnected',
                                            });
                                            changeAccount(entry.index);
                                            push('/');
                                        }
                                    }}
                                >
                                    {entry.name}
                                </SingleButton>
                            );
                        })}
                    </MultiButton>
                </SettingsLine>
                {next && (
                    <SettingsLine>
                        <Sub4Title>Add Account</Sub4Title>
                        <ColorButton
                            onClick={() => {
                                if (willAdd) {
                                    setIsType('login');
                                }
                                setWillAdd(prev => !prev);
                            }}
                        >
                            {willAdd ? <XSvg /> : 'Add New Account'}
                        </ColorButton>
                    </SettingsLine>
                )}
                {willAdd && (
                    <>
                        <Separation />
                        {status === 'none' && renderButtons()}
                        <Auth
                            type={isType}
                            status={status}
                            setStatus={setStatus}
                            callback={() => setStatus('none')}
                        />
                    </>
                )}
            </Card>
        </CardWithTitle>
    );
};
