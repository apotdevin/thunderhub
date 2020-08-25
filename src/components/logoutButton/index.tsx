import React, { useEffect } from 'react';
import { LogOut } from 'react-feather';
import { useRouter } from 'next/router';
import { useLogoutMutation } from 'src/graphql/mutations/__generated__/logout.generated';
import { useApolloClient } from '@apollo/client';
import { HeaderNavButton } from 'src/layouts/header/Header.styled';
import styled from 'styled-components';
import { themeColors } from 'src/styles/Themes';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { appendBasePath } from '../../utils/basePath';
import { useChatDispatch } from '../../context/ChatContext';

const Logout = styled.button`
  cursor: pointer;
  text-decoration: none;
  border: none;
  background: none;
  margin: 0;
  padding: 0;
`;

export const LogoutButton = () => {
  const { push } = useRouter();
  const client = useApolloClient();

  const dispatchChat = useChatDispatch();

  const [logout, { data, loading }] = useLogoutMutation({
    refetchQueries: ['GetServerAccounts'],
  });

  useEffect(() => {
    if (data && data.logout) {
      dispatchChat({ type: 'disconnected' });
      client.clearStore();
      push(appendBasePath('/'));
    }
  }, [data, dispatchChat, push, client]);

  if (loading) {
    return (
      <Logout>
        <HeaderNavButton>
          <ScaleLoader height={14} width={1} color={themeColors.blue3} />
        </HeaderNavButton>
      </Logout>
    );
  }

  return (
    <Logout onClick={() => logout()}>
      <HeaderNavButton>
        <LogOut size={18} />
      </HeaderNavButton>
    </Logout>
  );
};
