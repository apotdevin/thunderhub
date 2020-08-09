import React, { useEffect } from 'react';
import { LogOut } from 'react-feather';
import { useRouter } from 'next/router';
import { chartColors } from 'src/styles/Themes';
import { useLogoutMutation } from 'src/graphql/mutations/__generated__/logout.generated';
import { useAccounts, useAccount } from 'src/hooks/UseAccount';
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
import { appendBasePath } from '../../utils/basePath';
import { useChatDispatch } from '../../context/ChatContext';

export const AccountSettings = () => {
  const { push } = useRouter();

  const dispatchChat = useChatDispatch();

  const [logout, { data, loading }] = useLogoutMutation({
    refetchQueries: ['GetServerAccounts'],
  });

  const accounts = useAccounts();
  const account = useAccount();

  useEffect(() => {
    if (data && data.logout) {
      dispatchChat({ type: 'disconnected' });
      push(appendBasePath('/'));
    }
  }, [data, dispatchChat, push]);

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
                  if (accountId !== account.id) {
                    dispatchChat({ type: 'disconnected' });
                    push(appendBasePath('/'));
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
