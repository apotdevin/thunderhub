import { FC, ReactNode, useEffect } from 'react';
import { LogOut } from 'react-feather';
import { useLogoutMutation } from '../../../src/graphql/mutations/__generated__/logout.generated';
import { useApolloClient } from '@apollo/client';
import { HeaderNavButton } from '../../../src/layouts/header/Header.styled';
import styled from 'styled-components';
import { themeColors } from '../../../src/styles/Themes';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { config } from '../../config/thunderhubConfig';
import { safeRedirect } from '../../utils/url';
import { useChatDispatch } from '../../context/ChatContext';

const Logout = styled.button`
  cursor: pointer;
  text-decoration: none;
  border: none;
  background: none;
  margin: 0;
  padding: 0;
`;

const LogoutWrapperStyled = styled(Logout)`
  width: 100%;
`;

export const LogoutWrapper: FC<{ children?: ReactNode }> = ({ children }) => {
  const client = useApolloClient();

  const dispatchChat = useChatDispatch();

  const [logout, { data, loading }] = useLogoutMutation({
    refetchQueries: ['GetServerAccounts'],
  });

  useEffect(() => {
    if (data && data.logout) {
      dispatchChat({ type: 'disconnected' });
      client.clearStore();

      safeRedirect(
        config.logoutUrl || `${config.basePath}/login`,
        `${config.basePath}/login`
      );
    }
  }, [data, dispatchChat, client]);

  if (loading) {
    return (
      <LogoutWrapperStyled>
        <ScaleLoader height={14} width={1} color={themeColors.blue3} />
      </LogoutWrapperStyled>
    );
  }

  return (
    <LogoutWrapperStyled onClick={() => logout()}>
      {children}
    </LogoutWrapperStyled>
  );
};

export const LogoutButton = () => {
  const client = useApolloClient();

  const dispatchChat = useChatDispatch();

  const [logout, { data, loading }] = useLogoutMutation({
    refetchQueries: ['GetServerAccounts'],
  });

  useEffect(() => {
    if (data && data.logout) {
      dispatchChat({ type: 'disconnected' });
      client.clearStore();

      safeRedirect(
        config.logoutUrl || `${config.basePath}/login`,
        `${config.basePath}/login`
      );
    }
  }, [data, dispatchChat, client]);

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
