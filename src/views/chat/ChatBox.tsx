import * as React from 'react';
import styled, { css } from 'styled-components';
import { MessageType } from './Chat.types';
import {
  getMessageDate,
  getIsDifferentDay,
  getDayChange,
} from '../../components/generic/helpers';
import { DetailLine } from '../../components/generic/CardGeneric';
import { OverflowText, DarkSubTitle } from '../../components/generic/Styled';
import { cardBorderColor, subCardColor, cardColor } from '../../styles/Themes';
import { sortBy } from 'underscore';
import { NoWrap } from '../tools/Tools.styled';
import { ChatInput } from './ChatInput';

const ChatColumn = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid ${cardBorderColor};
  margin: 0 0 10px 10px;
  padding-bottom: 8px;
  height: 100%;
  min-height: 0;
  background-color: ${subCardColor};
`;

const ColumnWithInput = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledLine = styled<{ rightAlign: boolean }>(DetailLine)`
  width: 100%;
  align-items: center;
  ${({ rightAlign }) =>
    rightAlign &&
    css`
      justify-content: flex-end;
    `};
`;

const DaySeparator = styled.div`
  width: 100%;
  font-size: 14px;
  text-align: center;
  margin: 8px 16px;
  padding: 8px;
`;

const StyledDark = styled(DarkSubTitle)`
  font-size: 12px;
  width: 50px;
  margin-left: 18px;
`;

const StyledChatMessage = styled(OverflowText)`
  background-color: ${cardColor};
  max-width: 60%;
  padding: 8px 16px;
  border-radius: 8px;
`;

interface ChatBox {
  messages: MessageType[];
  alias: string;
}

export const MessageCard = ({
  message,
  key,
}: {
  message: MessageType;
  key?: string;
}) => {
  if (!message.message) {
    return null;
  }
  const { date, message: chatMessage, isSent } = message;
  return (
    <StyledLine key={key} rightAlign={isSent}>
      <StyledChatMessage>{chatMessage}</StyledChatMessage>
      <StyledDark withMargin={'8px'}>
        <NoWrap>{getMessageDate(date)}</NoWrap>
      </StyledDark>
    </StyledLine>
  );
};

export const ChatBox = ({ messages, alias }: ChatBox) => {
  if (!messages) {
    return null;
  }

  const sorted = sortBy(messages, 'date').reverse();

  return (
    <ColumnWithInput>
      <ChatColumn>
        {sorted.map((message, index: number) => {
          const nextDate =
            index < sorted.length - 1 ? sorted[index + 1].date : message.date;
          const isDifferent = getIsDifferentDay(message.date, nextDate);
          return (
            <div
              style={{ width: '100%' }}
              key={`${message.sender}/${message.date}`}
            >
              <MessageCard message={message} />
              {isDifferent && (
                <DaySeparator>{getDayChange(nextDate)}</DaySeparator>
              )}
            </div>
          );
        })}
      </ChatColumn>
      <ChatInput alias={alias} />
    </ColumnWithInput>
  );
};
