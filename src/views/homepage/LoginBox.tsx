import React, { useState } from 'react';
import styled from 'styled-components';
import { useAccountState } from 'src/context/NewAccountContext';
import { Card, Separation } from '../../components/generic/Styled';
import { Section } from '../../components/section/Section';
import {
  MultiButton,
  SingleButton,
} from '../../components/buttons/multiButton/MultiButton';
import { Link } from '../../components/link/Link';
import { Auth } from '../../components/auth';
import { mediaWidths, unSelectedNavButton } from '../../styles/Themes';
import { ConnectTitle } from './HomePage.styled';

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

export const LoginBox = () => {
  const [isType, setIsType] = useState('login');
  const [status, setStatus] = useState('none');
  const [help, setHelp] = useState(false);
  const { accounts } = useAccountState();

  const change = accounts.length <= 0;

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
              {`To connect with your BTCPayServer instance you need the connection JSON that they provide.`}
            </Text>
            <Text>To access this JSON in your BPS instance, go to:</Text>
            <Text>
              {`Server Settings > Services > gRPC server > Show QR Code > QR Code Information > Open Config file`}
            </Text>
            <Text>{`Then copy the complete JSON and paste it below.`}</Text>
            <Separation />
          </>
        );
      case 'connect':
        return (
          <>
            <Separation />
            <Text>
              {
                'To connect via LNDConnect paste the LNDConnectUrl down below. Find the url format specification '
              }
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
    <Section withColor={false}>
      <ConnectTitle change={change}>Connect to your Node</ConnectTitle>
      <Card>
        {status === 'none' && (
          <>
            {renderButtons()}
            <HelpBox onClick={() => setHelp(prev => !prev)}>
              {!help && renderHelp()}
              {help && renderText()}
            </HelpBox>
          </>
        )}
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
