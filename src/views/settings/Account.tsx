import React, { useEffect } from 'react';
import { LogOut } from 'react-feather';
import { useRouter } from 'next/router';
import { chartColors } from 'src/styles/Themes';
import { useLogoutMutation } from 'src/graphql/mutations/__generated__/logout.generated';
import { useAccount } from 'src/hooks/UseAccount';
import {
  CardWithTitle,
  SubTitle,
  Card,
  Sub4Title,
} from '../../components/generic/Styled';
import { SettingsLine } from '../../../pages/settings';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { appendBasePath } from '../../utils/basePath';
import { useChatDispatch } from '../../context/ChatContext';

export const AccountSettings = () => {
  const { push } = useRouter();

  const dispatchChat = useChatDispatch();

  const [logout, { data, loading }] = useLogoutMutation({
    refetchQueries: ['GetServerAccounts'],
  });

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

  return (
    <CardWithTitle>
      <SubTitle>Account</SubTitle>
      <Card>
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
