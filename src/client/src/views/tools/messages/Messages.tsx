import React from 'react';
import styled from 'styled-components';
import {
  CardWithTitle,
  SubTitle,
  Card,
} from '../../../components/generic/Styled';
import { SignMessageCard } from './SignMessage';
import { VerifyMessage } from './VerifyMessage';

export const NoWrap = styled.div`
  margin-right: 16px;
  white-space: nowrap;
`;

export const MessagesView = () => {
  return (
    <CardWithTitle>
      <SubTitle>Messages</SubTitle>
      <Card>
        <VerifyMessage />
        <SignMessageCard />
      </Card>
    </CardWithTitle>
  );
};
