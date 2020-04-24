import * as React from 'react';
import styled from 'styled-components';
import { MessageType } from './Chat.types';
import { getMessageDate } from '../../components/generic/helpers';
import { DetailLine } from '../../components/generic/CardGeneric';
import { OverflowText, DarkSubTitle } from '../../components/generic/Styled';
import { cardBorderColor } from '../../styles/Themes';

const ContactColumn = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-y: auto;
  width: 100%;
  border: 1px solid ${cardBorderColor};
  margin: 0 0 10px 10px;
`;

const StyledLine = styled(DetailLine)`
  width: 100%;
  align-items: center;
`;

interface ChatBox {
  messages: MessageType[];
}

export const MessageCard = ({ message }: { message: MessageType }) => {
  return (
    <StyledLine key={message.id}>
      <OverflowText>
        <div>{message.message}</div>
      </OverflowText>
      <DarkSubTitle withMargin={'8px'}>
        {getMessageDate(message.date)}
      </DarkSubTitle>
    </StyledLine>
  );
};

export const ChatBox = ({ messages }: ChatBox) => {
  console.log('CHAT BOX: ', messages);
  if (!messages) {
    return null;
  }
  return (
    <ContactColumn>
      {messages.map(message => (
        <MessageCard message={message} />
      ))}
    </ContactColumn>
  );
};
