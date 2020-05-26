import React, { useState, useEffect } from 'react';
import { X, LogOut } from 'react-feather';
import { useRouter } from 'next/router';
import {
  useAccountState,
  useAccountDispatch,
  SSO_ACCOUNT,
} from 'src/context/AccountContext';
import { chartColors } from 'src/styles/Themes';
import { useLogoutMutation } from 'src/graphql/mutations/__generated__/logout.generated';
import {
  CardWithTitle,
  SubTitle,
  Card,
  SingleLine,
  Sub4Title,
  Separation,
} from '../../components/generic/Styled';
import { SettingsLine } from '../../../pages/settings';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import {
  MultiButton,
  SingleButton,
} from '../../components/buttons/multiButton/MultiButton';
import { useStatusDispatch } from '../../context/StatusContext';
import { Auth } from '../../components/auth';
import { appendBasePath } from '../../utils/basePath';
import { useChatDispatch } from '../../context/ChatContext';

export const AccountSettings = () => {
  const [status, setStatus] = useState('none');

  const { push } = useRouter();
  const { account, accounts } = useAccountState();

  const dispatch = useStatusDispatch();
  const dispatchChat = useChatDispatch();
  const dispatchAccount = useAccountDispatch();

  const [isType, setIsType] = useState('login');
  const [willAdd, setWillAdd] = useState(false);

  const [logout, { data, loading }] = useLogoutMutation({
    refetchQueries: ['GetServerAccounts'],
  });

  useEffect(() => {
    if (data && data.logout) {
      dispatch({ type: 'disconnected' });
      dispatchChat({ type: 'disconnected' });
      dispatchAccount({ type: 'logout' });
      push(appendBasePath('/'));
    }
  }, [data, dispatch, dispatchChat, dispatchAccount, push]);

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
          {accounts.map(
            ({ name: accountName, id: accountId, type: accountType }) => {
              return (
                <SingleButton
                  key={accountId}
                  selected={accountId === account?.id}
                  onClick={() => {
                    if (accountId !== account?.id) {
                      switch (accountType) {
                        case SSO_ACCOUNT:
                          dispatchAccount({
                            type: 'changeAccount',
                            changeId: accountId,
                          });
                          break;
                        default:
                          dispatch({ type: 'disconnected' });
                          dispatchChat({ type: 'disconnected' });
                          dispatchAccount({
                            type: 'changeAccount',
                            changeId: accountId,
                          });
                          push(appendBasePath('/'));
                          break;
                      }
                    }
                  }}
                >
                  {accountName}
                </SingleButton>
              );
            }
          )}
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
          <Sub4Title>Add Browser Account</Sub4Title>
          <ColorButton
            onClick={() => {
              if (willAdd) {
                setIsType('login');
              }
              setWillAdd(prev => !prev);
            }}
          >
            {willAdd ? <X size={18} /> : 'Add New Account'}
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
            <Separation />
          </>
        )}
        <SettingsLine>
          <Sub4Title>Logout</Sub4Title>
          <ColorButton
            disabled={loading}
            loading={loading}
            onClick={() => {
              logout({ variables: { type: account.type } });
            }}
          >
            <LogOut color={chartColors.red} size={14} />
          </ColorButton>
        </SettingsLine>
      </Card>
    </CardWithTitle>
  );
};
