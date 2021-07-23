import React from 'react';
import { Users } from 'react-feather';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';
import { HeaderNavButton } from 'src/layouts/header/Header.styled';
import styled from 'styled-components';
import getConfig from 'next/config';
import { useChatDispatch } from '../../context/ChatContext';

const { publicRuntimeConfig } = getConfig();
const { withAccountSwitch } = publicRuntimeConfig;

const Button = styled.button`
  cursor: pointer;
  text-decoration: none;
  border: none;
  background: none;
  margin: 0;
  padding: 0;
`;

export const ChangeUserButton = () => {
  const { push } = useRouter();
  const client = useApolloClient();

  const dispatchChat = useChatDispatch();

  const handleClick = () => {
    dispatchChat({ type: 'disconnected' });
    client.clearStore();
    push('/login');
  };

  if (!withAccountSwitch) {
    return null;
  }

  return (
    <Button onClick={() => handleClick()}>
      <HeaderNavButton>
        <Users size={18} />
      </HeaderNavButton>
    </Button>
  );
};
