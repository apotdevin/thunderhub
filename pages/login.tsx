import React, { useState } from 'react';
import { Card, Separation } from '../src/components/generic/Styled';
import styled from 'styled-components';
import { Section } from '../src/components/section/Section';
import {
  MultiButton,
  SingleButton,
} from '../src/components/buttons/multiButton/MultiButton';
import { Link } from '../src/components/link/Link';
import { Auth } from '../src/components/auth';
import { mediaWidths, unSelectedNavButton } from '../src/styles/Themes';

const Text = styled.p`
  width: 100%;
  text-align: center;
`;

const HelpBox = styled.div`
  font-size: 14px;
  color: ${unSelectedNavButton};
  cursor: pointer;
`;

const Help = styled.div`
  width: 100%;
  text-align: right;
  margin-bottom: -24px;

  :hover {
    font-weight: bold;
  }

  @media (${mediaWidths.mobile}) {
    text-align: center;
    margin-bottom: 0;
  }
`;

const ConnectTitle = styled.h1`
  width: 100%;
  text-align: center;
`;

const LoginView = () => {
  const [isType, setIsType] = useState('login');
  const [status, setStatus] = useState('none');
  const [help, setHelp] = useState(false);

  const renderButtons = () => (
    <>
      <MultiButton margin={'16px 0'}>
        <SingleButton
          selected={isType === 'login'}
          onClick={() => {
            setHelp(false);
            setIsType('login');
          }}
        >
          Details
        </SingleButton>
        <SingleButton
          selected={isType === 'connect'}
          onClick={() => {
            setHelp(false);
            setIsType('connect');
          }}
        >
          LndConnect
        </SingleButton>
        <SingleButton
          selected={isType === 'btcpay'}
          onClick={() => {
            setHelp(false);
            setIsType('btcpay');
          }}
        >
          BTCPayServer
        </SingleButton>
        <SingleButton
          selected={isType === 'qrcode'}
          onClick={() => {
            setHelp(false);
            setIsType('qrcode');
          }}
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
              To connect with your BTCPayServer instance you need the connection
              JSON that they provide.
            </Text>
            <Text>To access this JSON in your BPS instance, go to:</Text>
            <Text>
              Server Settings > Services > gRPC server > Show QR Code > QR Code
              Information > Open Config file
            </Text>
            <Text>Then copy the complete JSON and paste it below.</Text>
            <Separation />
          </>
        );
      case 'connect':
        return (
          <>
            <Separation />
            <Text>
              To connect via LNDConnect paste the LNDConnectUrl down below.
              {' Find the url format specification '}
              <Link
                href={
                  'github.com/LN-Zap/lndconnect/blob/master/lnd_connect_uri.md'
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

  const renderHelp = () => {
    switch (isType) {
      case 'btcpay':
      case 'connect':
        return <Help>Need Help?</Help>;
      default:
        return null;
    }
  };

  return (
    <Section padding={'0 0 60px'}>
      <ConnectTitle>{'How do you want to connect?'}</ConnectTitle>
      <Card bottom={'0'}>
        {status === 'none' && renderButtons()}
        <HelpBox onClick={() => setHelp(prev => !prev)}>
          {!help && renderHelp()}
          {status === 'none' && help && renderText()}
        </HelpBox>
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

export default LoginView;
