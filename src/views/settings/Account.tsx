import React, { useState } from 'react';
import {
  CardWithTitle,
  SubTitle,
  Card,
  SingleLine,
  Sub4Title,
  Separation,
} from '../../components/generic/Styled';
import { SettingsLine } from '../../../pages/settings';
import { useAccount } from '../../context/AccountContext';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { XSvg } from '../../components/generic/Icons';
import {
  MultiButton,
  SingleButton,
} from '../../components/buttons/multiButton/MultiButton';
import { useConnectionDispatch } from '../../context/ConnectionContext';
import { useStatusDispatch } from '../../context/StatusContext';
import { Auth } from '../../components/auth';
import { useRouter } from 'next/router';

export const AccountSettings = () => {
  const [status, setStatus] = useState('none');

  const { push } = useRouter();
  const { id, changeAccount, accounts } = useAccount();

  const dispatch = useConnectionDispatch();
  const dispatchState = useStatusDispatch();

  const [isType, setIsType] = useState('login');
  const [willAdd, setWillAdd] = useState(false);

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

  const renderChangeAccount = () => {
    if (accounts.length <= 1) {
      return null;
    }

    return (
      <SettingsLine>
        <Sub4Title>Change Account</Sub4Title>
        <MultiButton>
          {accounts.map(({ name: accountName, id: accountId }) => {
            return (
              <SingleButton
                key={accountId}
                selected={accountId === id}
                onClick={() => {
                  if (accountId !== id) {
                    dispatch({ type: 'disconnected' });
                    dispatchState({
                      type: 'disconnected',
                    });
                    changeAccount(accountId);
                    push('/');
                  }
                }}
              >
                {accountName}
              </SingleButton>
            );
          })}
        </MultiButton>
      </SettingsLine>
    );
  };

  return (
    <CardWithTitle>
      <SubTitle>Account</SubTitle>
      <Card>
        {renderChangeAccount()}
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
