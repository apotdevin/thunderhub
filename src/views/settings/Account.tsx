import React, { useEffect } from 'react';
import { LogOut } from 'react-feather';
import { useRouter } from 'next/router';
import { chartColors } from 'src/styles/Themes';
import { useLogoutMutation } from 'src/graphql/mutations/__generated__/logout.generated';
import {
  CardWithTitle,
  SubTitle,
  Card,
  Sub4Title,
} from '../../components/generic/Styled';
import { SettingsLine } from '../../../pages/settings';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import {
  MultiButton,
  SingleButton,
} from '../../components/buttons/multiButton/MultiButton';
import { useStatusDispatch } from '../../context/StatusContext';
import { appendBasePath } from '../../utils/basePath';
import { useChatDispatch } from '../../context/ChatContext';

export const AccountSettings = () => {
  const { push } = useRouter();

  const dispatch = useStatusDispatch();
  const dispatchChat = useChatDispatch();

  const [logout, { data, loading }] = useLogoutMutation({
    refetchQueries: ['GetServerAccounts'],
  });

  // TODO: Get accounts from server
  const accounts = [{ name: 'test', id: 'testing', type: 'testing' }];
  const account = { name: 'test', id: 'testing', type: 'testing' };

  useEffect(() => {
    if (data && data.logout) {
      dispatch({ type: 'disconnected' });
      dispatchChat({ type: 'disconnected' });
      push(appendBasePath('/'));
    }
  }, [data, dispatch, dispatchChat, push]);

  if (!account) {
    return null;
  }

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
                selected={accountId === account.id}
                onClick={() => {
                  // TODO: Do correct click handling
                  // if (accountId !== account.id) {
                  //   switch (accountType) {
                  //     case 'sso':
                  //       dispatchAccount({
                  //         type: 'changeAccount',
                  //         changeId: accountId,
                  //       });
                  //       break;
                  //     default:
                  //       dispatch({ type: 'disconnected' });
                  //       dispatchChat({ type: 'disconnected' });
                  //       dispatchAccount({
                  //         type: 'changeAccount',
                  //         changeId: accountId,
                  //       });
                  //       push(appendBasePath('/'));
                  //       break;
                  //   }
                  // }
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
