import React, { useState } from 'react';
import { Card, Separation } from '../../../components/generic/Styled';
import styled from 'styled-components';
import { Section } from 'components/section/Section';
import {
    MultiButton,
    SingleButton,
} from 'components/buttons/multiButton/MultiButton';
import { Text } from 'views/other/OtherViews.styled';
import { Link } from 'components/link/Link';
import { Auth } from 'components/auth';

const ConnectTitle = styled.h1`
    width: 100%;
    text-align: center;
`;

export const LoginView = () => {
    const [isType, setIsType] = useState('login');
    const [status, setStatus] = useState('none');

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
                <SingleButton
                    selected={isType === 'qrcode'}
                    onClick={() => setIsType('qrcode')}
                >
                    QR Code
                </SingleButton>
            </MultiButton>
        </>
    );

    const renderText = () => {
        switch (isType) {
            case 'btcpay':
                return (
                    <>
                        <Separation />
                        <Text>
                            To connect with your BTCPayServer instance you need
                            the connection JSON that they provide.
                        </Text>
                        <Text>
                            To access this JSON in your BPS instance, go to:
                        </Text>
                        <Text>
                            Server Settings > Services > gRPC server > Show QR
                            Code > QR Code Information > Open Config file
                        </Text>
                        <Text>
                            Then copy the complete JSON and paste it below.
                        </Text>
                        <Separation />
                    </>
                );
            case 'connect':
                return (
                    <>
                        <Separation />
                        <Text>
                            To connect via LNDConnect paste the LNDConnectUrl
                            down below.
                            {' Find the url format specification '}
                            <Link
                                href={
                                    'https://github.com/LN-Zap/lndconnect/blob/master/lnd_connect_uri.md'
                                }
                            >
                                here.
                            </Link>
                        </Text>
                        <Separation />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Section padding={'0 0 60px'}>
            <ConnectTitle>{'How do you want to connect?'}</ConnectTitle>
            <Card bottom={'0'}>
                {status === 'none' && renderButtons()}
                {status === 'none' && renderText()}
                <Auth
                    type={isType}
                    status={status}
                    setStatus={setStatus}
                    callback={() => setStatus('none')}
                />
            </Card>
        </Section>
    );
};
